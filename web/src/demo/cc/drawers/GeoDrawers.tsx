import { adherenceTrend, months, services, type RegionId } from '../../careContinuityScenario';
import { BarList, LineChart, Meter, Sparkline } from '../charts';
import { Icon } from '../icons';
import {
  SERVICE_COLOR, districtById, districtLabel, districtLoad, fmtInt, last, regionStats,
} from '../model';
import { Drawer } from '../overlay';
import { useNav } from '../nav';
import { useDemo } from '../store';
import { SeverityBadge, Stat, Tag } from '../ui';

export function RegionDrawer({ id, onClose }: { id: RegionId; onClose: () => void }) {
  const { open, go } = useNav();
  const { alerts } = useDemo();
  const r = regionStats(id);
  const regionAlerts = alerts.filter((a) => a.status !== 'resolved' && (a.regionId === id || a.regionId === null));
  return (
    <Drawer
      itemKey={id}
      eyebrow="Region"
      title={r.region.name}
      meta={<><Tag>{r.districts.length} districts</Tag><Tag>{fmtInt(r.cohort)} people</Tag></>}
      onClose={onClose}
      footer={<button type="button" className="cc-btn" onClick={() => go('caseload', { district: id })}><Icon name="users" size={15} /> View synthetic cases</button>}
    >
      <p className="cc-drawer-lead">{r.region.setting}.</p>
      <div className="cc-stats cc-stats-3">
        <Stat label="Doses taken" value={`${r.adherence.toFixed(0)}%`} hint={`${(r.adherence - r.adherenceSeries[0]).toFixed(1)} pts in 12 mo`} />
        <Stat label="Loss to follow-up" value={`${r.ltfu.toFixed(1)}%`} hint="this quarter" tone={r.ltfu > 5 ? 'warn' : undefined} />
        <Stat label="Outreach load" value={`${Math.round(r.load * 100)}%`} hint={`${r.workers} workers`} tone={r.load > 1 ? 'bad' : undefined} />
      </div>

      <h3 className="cc-h3">Doses taken, region vs national</h3>
      <LineChart
        labels={months}
        series={[
          { id: 'r', name: r.region.name, values: r.adherenceSeries, color: 'var(--cc-accent-2)', area: true },
          { id: 'n', name: 'All regions', values: adherenceTrend.supported, color: 'var(--cc-gray)', dashed: true },
        ]}
        min={80} max={96} ticks={[80, 85, 90, 95]} height={180}
        format={(v) => `${v.toFixed(0)}%`}
        ariaLabel={`Doses taken in ${r.region.name} over 12 months.`}
      />

      <h3 className="cc-h3">Districts</h3>
      <ul className="cc-dlist">
        {r.districts.map((d) => {
          const a = last(d.adherence);
          return (
            <li key={d.id}>
              <button type="button" onClick={() => open(d.id)}>
                <span className="cc-dlist-name">
                  <strong>District {d.letter}</strong>
                  <span>{d.setting} · {d.cohort} people</span>
                </span>
                <span className="cc-dlist-spark"><Sparkline values={d.adherence} height={24} area={false} color={a < 85 ? 'var(--cc-high)' : a < 89 ? 'var(--cc-med)' : 'var(--cc-accent-2)'} /></span>
                <span className={`cc-dlist-val cc-num ${a < 85 ? 'cc-neg' : ''}`}>{a.toFixed(0)}%</span>
                <Icon name="chevron-right" size={16} />
              </button>
            </li>
          );
        })}
      </ul>

      <h3 className="cc-h3">Open alerts <span className="cc-count">{regionAlerts.length}</span></h3>
      <ul className="cc-mini-alerts">
        {regionAlerts.map((a) => (
          <li key={a.id}>
            <button type="button" onClick={() => go('alerts', { item: a.id })}>
              <SeverityBadge severity={a.severity} />
              <span>{a.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </Drawer>
  );
}

export function DistrictDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const { go, open } = useNav();
  const { alerts, cases } = useDemo();
  const d = districtById.get(id)!;
  const rs = regionStats(d.regionId);
  const a = last(d.adherence);
  const change = a - d.adherence[8];
  const load = districtLoad(d);
  const capacity = d.workers * d.capacityPerWorker;
  const dAlerts = alerts.filter((x) => x.status !== 'resolved' && x.districtIds.includes(id));
  const dCases = cases.filter((c) => c.districtId === id);
  return (
    <Drawer
      itemKey={id}
      eyebrow={<button type="button" className="cc-link-btn cc-eyebrow-link" onClick={() => open(d.regionId)}>{rs.region.name}</button>}
      title={`District ${d.letter}`}
      meta={<><Tag>{d.setting}</Tag><Tag>{d.cohort} people</Tag>{load > 1 && <Tag tone="bad">Over capacity</Tag>}</>}
      onClose={onClose}
      footer={(
        <>
          <button type="button" className="cc-btn" onClick={() => go('caseload', { district: id })}><Icon name="users" size={15} /> Synthetic cases ({dCases.length})</button>
          {dAlerts.length > 0 && <button type="button" className="cc-btn cc-btn-primary" onClick={() => go('alerts', { item: dAlerts[0].id })}><Icon name="alert" size={15} /> Open top alert</button>}
        </>
      )}
    >
      <p className="cc-drawer-lead">{d.note}</p>
      <div className="cc-stats cc-stats-4">
        <Stat label="Cohort" value={d.cohort} hint="people supported" />
        <Stat label="Doses taken" value={`${a.toFixed(0)}%`} hint={`${change > 0 ? '+' : ''}${change.toFixed(1)} pts in 3 mo`} tone={change < -2 ? 'bad' : undefined} />
        <Stat label="Loss to follow-up" value={`${d.ltfu.toFixed(1)}%`} hint="this quarter" tone={d.ltfu >= 5.5 ? 'warn' : undefined} />
        <Stat label="Outreach load" value={`${Math.round(load * 100)}%`} hint="of capacity" tone={load > 1 ? 'bad' : undefined} />
      </div>

      <h3 className="cc-h3">Doses taken, last 12 months</h3>
      <LineChart
        labels={months}
        series={[
          { id: 'd', name: districtLabel(id), values: d.adherence, color: a < 85 ? 'var(--cc-high)' : 'var(--cc-accent-2)', area: true },
          { id: 'r', name: rs.region.name, values: rs.adherenceSeries, color: 'var(--cc-gray)', dashed: true },
        ]}
        min={78} max={96} ticks={[80, 85, 90, 95]} height={180}
        format={(v) => `${v.toFixed(0)}%`}
        threshold={{ value: 85, label: 'Alert level 85%' }}
        ariaLabel={`Doses taken in ${districtLabel(id)} over 12 months, ending at ${a}%.`}
      />

      <h3 className="cc-h3">Services in use</h3>
      <BarList
        items={services.map((s) => ({ id: s.id, label: s.name, value: Math.round(d.serviceShare[s.id] * d.cohort), color: SERVICE_COLOR[s.id] }))}
        format={(v) => `${v} people`}
        max={d.cohort}
      />

      <h3 className="cc-h3">Outreach-worker capacity</h3>
      <div className="cc-capacity">
        <div className="cc-capacity-row">
          <span><strong className="cc-num">{d.workers}</strong> outreach workers</span>
          <span><strong className="cc-num">{d.cohort}</strong> / {capacity} recommended caseload</span>
        </div>
        <Meter value={load * 100} max={130} tone={load > 1 ? 'bad' : load > 0.9 ? 'warn' : 'good'} />
        <p className="cc-fine">
          {load > 1
            ? `About ${d.cohort - capacity} people above the recommended ${d.capacityPerWorker} per worker. Consider a temporary peer-navigator day.`
            : `${capacity - d.cohort} places free at the recommended ${d.capacityPerWorker} people per worker.`}
        </p>
      </div>

      <h3 className="cc-h3">Open alerts <span className="cc-count">{dAlerts.length}</span></h3>
      {dAlerts.length === 0 ? <p className="cc-fine">No open alerts for this district.</p> : (
        <ul className="cc-mini-alerts">
          {dAlerts.map((x) => (
            <li key={x.id}>
              <button type="button" onClick={() => go('alerts', { item: x.id })}>
                <SeverityBadge severity={x.severity} />
                <span>{x.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
