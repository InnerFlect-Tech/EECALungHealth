import { adherenceTrend, funding, kpis, meta, months, type Kpi, type ViewId } from '../../careContinuityScenario';
import { LineChart, Meter, Sparkline } from '../charts';
import { Icon } from '../icons';
import { agoLabel, allRegionStats, fmtInt, fmtUsd } from '../model';
import { useNav } from '../nav';
import { useDemo } from '../store';
import { Card, Delta, PageHeader, SeverityBadge, Tag } from '../ui';

const KPI_TARGET: Record<Kpi['id'], { view: ViewId; hint: string }> = {
  cohort: { view: 'regions', hint: 'See cohort by region' },
  adherence: { view: 'regions', hint: 'See doses taken by district' },
  ltfu: { view: 'journey', hint: 'See where people drop out' },
  funding: { view: 'impact', hint: 'See the evidence for funding' },
};

function fmtKpi(k: Kpi) {
  if (k.format === 'int') return fmtInt(k.value);
  if (k.format === 'pct') return `${k.value}%`;
  if (k.format === 'pct1') return `${k.value.toFixed(1)}%`;
  return `${k.value} mo`;
}

const SEV_ORDER = { high: 0, medium: 1, low: 2 } as const;

export function Overview() {
  const { go } = useNav();
  const { alerts } = useDemo();
  const open = alerts.filter((a) => a.status !== 'resolved');
  const attention = [...open].sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity] || a.detectedDaysAgo - b.detectedDaysAgo).slice(0, 4);
  const highCount = open.filter((a) => a.severity === 'high').length;
  const grant = funding[0];

  return (
    <div className="cc-view">
      <PageHeader
        eyebrow={meta.scenario}
        title="Programme overview"
        subtitle={<>How community support is keeping people on TB treatment. Synthetic data · {meta.period.toLowerCase()} · as of {meta.asOfLabel}.</>}
        actions={(
          <>
            <button type="button" className="cc-btn" onClick={() => go('impact')}>
              <Icon name="file" size={16} /> Evidence pack
            </button>
            <button type="button" className="cc-btn cc-btn-primary" onClick={() => go('alerts')}>
              <Icon name="alert" size={16} /> Review {open.length} open alerts
            </button>
          </>
        )}
      />

      <div className="cc-kpis">
        {kpis.map((k) => {
          const t = KPI_TARGET[k.id];
          const warn = k.id === 'funding';
          return (
            <button key={k.id} type="button" className={`cc-kpi ${warn ? 'is-warn' : ''}`} onClick={() => go(t.view)} aria-label={`${k.label}: ${fmtKpi(k)}. ${k.delta}. ${t.hint}`}>
              <div className="cc-kpi-top">
                <span className="cc-kpi-label">{k.label}</span>
                <Icon name="arrow-right" size={14} className="cc-kpi-go" />
              </div>
              <div className="cc-kpi-row">
                <span className="cc-kpi-value cc-num">{fmtKpi(k)}</span>
                <Delta text={k.delta} good={k.deltaGood} />
              </div>
              <Sparkline values={k.spark} color={warn ? 'var(--cc-high)' : 'var(--cc-accent-2)'} />
              <span className="cc-kpi-note">{k.note}</span>
            </button>
          );
        })}
      </div>

      <div className="cc-grid cc-grid-2-1">
        <Card
          id="ov-trend"
          title="Doses taken, supported vs comparison cohort"
          subtitle="Share of scheduled doses taken each month. The comparison cohort has no community support (synthetic)."
          actions={<Tag tone="good">+{adherenceTrend.supported[11] - adherenceTrend.comparison[11]} pts gap</Tag>}
        >
          <LineChart
            labels={months}
            series={[
              { id: 's', name: 'Supported cohort', values: adherenceTrend.supported, color: 'var(--cc-accent-2)', area: true },
              { id: 'c', name: 'Comparison cohort', values: adherenceTrend.comparison, color: 'var(--cc-gray)', dashed: true },
            ]}
            min={74}
            max={94}
            ticks={[75, 80, 85, 90]}
            format={(v) => `${Math.round(v)}%`}
            threshold={{ value: adherenceTrend.target, label: `Target ${adherenceTrend.target}%`, tone: 'target' }}
            ariaLabel={`Line chart of doses taken per month. Supported cohort rises from ${adherenceTrend.supported[0]}% to ${adherenceTrend.supported[11]}%; comparison cohort stays near ${adherenceTrend.comparison[11]}%.`}
          />
        </Card>

        <Card id="ov-funding" title="Funding status" subtitle="What pays for the support package today (indicative).">
          <div className="cc-runway">
            <div className="cc-runway-head">
              <span>External grant runway</span>
              <strong className="cc-num">{grant.monthsLeft} of 24 months left</strong>
            </div>
            <div className="cc-runway-track" aria-hidden="true"><span style={{ width: `${((grant.monthsLeft ?? 0) / 24) * 100}%` }} /></div>
            <p className="cc-runway-note">Ends May 2027. Psychosocial support, vouchers and peer navigation depend on it.</p>
          </div>
          <ul className="cc-funding-list">
            {funding.map((f) => (
              <li key={f.id}>
                <span className={`cc-fstatus cc-fstatus-${f.status}`}>{f.status === 'ending' ? 'Ending' : f.status === 'pending' ? 'Pending' : 'Secured'}</span>
                <div className="cc-funding-text">
                  <span className="cc-funding-label">{f.label}</span>
                  <span className="cc-funding-detail">{f.source}{f.annualUsd ? ` · ${fmtUsd(f.annualUsd)}/yr` : ''}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="cc-grid cc-grid-2-1">
        <Card id="ov-regions" title="Regions" subtitle="Select a region to see its districts and trends." flush>
          <div className="cc-table-wrap">
            <table className="cc-table cc-table-click cc-table-cards">
              <thead>
                <tr>
                  <th scope="col">Region</th>
                  <th scope="col" className="cc-r">Cohort</th>
                  <th scope="col">Doses taken</th>
                  <th scope="col" className="cc-r">Loss to follow-up</th>
                  <th scope="col" className="cc-hide-sm">12-month trend</th>
                  <th scope="col" className="cc-r">Alerts</th>
                </tr>
              </thead>
              <tbody>
                {allRegionStats.map((r) => {
                  const ra = open.filter((a) => a.regionId === r.region.id || a.regionId === null).length;
                  return (
                    <tr key={r.region.id} onClick={() => go('overview', { item: r.region.id })}>
                      <th scope="row" data-label="Region">
                        <button type="button" className="cc-row-link" onClick={(e) => { e.stopPropagation(); go('overview', { item: r.region.id }); }}>
                          {r.region.name}
                        </button>
                        <span className="cc-cell-sub">{r.districts.length} districts</span>
                      </th>
                      <td className="cc-r cc-num" data-label="Cohort">{fmtInt(r.cohort)}</td>
                      <td data-label="Doses taken">
                        <span className="cc-meter-cell">
                          <Meter value={r.adherence - 70} max={30} tone={r.adherence < 89 ? 'warn' : 'accent'} />
                          <span className="cc-num">{r.adherence.toFixed(0)}%</span>
                        </span>
                      </td>
                      <td className="cc-r cc-num" data-label="Loss to follow-up">{r.ltfu.toFixed(1)}%</td>
                      <td className="cc-hide-sm cc-spark-cell"><Sparkline values={r.adherenceSeries} height={24} area={false} /></td>
                      <td className="cc-r" data-label="Alerts"><span className={`cc-count ${ra > 2 ? 'is-hot' : ''}`}>{ra}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          id="ov-attention"
          title="Needs attention now"
          subtitle={`${highCount} high-severity signals open`}
          actions={<button type="button" className="cc-link-btn" onClick={() => go('alerts')}>All alerts <Icon name="arrow-right" size={14} /></button>}
          flush
        >
          <ul className="cc-attention">
            {attention.map((a) => (
              <li key={a.id}>
                <button type="button" onClick={() => go('alerts', { item: a.id })}>
                  <span className="cc-attention-top">
                    <SeverityBadge severity={a.severity} />
                    <span className="cc-attention-age">{agoLabel(a.detectedDaysAgo)}</span>
                  </span>
                  <span className="cc-attention-title">{a.title}</span>
                  <span className="cc-attention-scope">{a.scope}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
