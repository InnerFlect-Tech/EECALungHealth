import { useState } from 'react';
import { funding, services, stages, type ServiceId, type Stage } from '../../careContinuityScenario';
import { BarList } from '../charts';
import { Icon } from '../icons';
import { SERVICE_COLOR, fmtInt, fmtUsd, serviceById } from '../model';
import { useNav } from '../nav';
import { Card, PageHeader, Stat, Tag } from '../ui';

const actsAt = (svc: ServiceId, st: Stage) => st.services.some((s) => s.serviceId === svc);

export function Journey() {
  const { params, set, go } = useNav();
  const [compare, setCompare] = useState(true);
  const stageId = (params.get('stage') as Stage['id'] | null) ?? 'intensive';
  const stage = stages.find((s) => s.id === stageId) ?? stages[2];
  const serviceParam = params.get('service') as ServiceId | null;
  const svc = serviceParam ? serviceById.get(serviceParam) : undefined;
  const idx = stages.indexOf(stage);
  const prev = idx > 0 ? stages[idx - 1] : null;
  const dropHere = prev ? prev.retained - stage.retained : 0;
  const dropUnsupported = prev ? prev.retainedUnsupported - stage.retainedUnsupported : 0;
  const final = stages[stages.length - 1];

  return (
    <div className="cc-view">
      <PageHeader
        title="Patient journey"
        subtitle={<>Of every 100 people who start, {final.retained} complete treatment with community support and {final.retainedUnsupported} without it (synthetic). Select a stage to see which services act there.</>}
      />

      <Card
        id="jr-funnel"
        title="From diagnosis to completion"
        subtitle="People still on treatment at each stage, per 100 diagnosed."
        actions={(
          <label className="cc-switch">
            <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} />
            <span className="cc-switch-track" aria-hidden="true"><span /></span>
            Show comparison cohort
          </label>
        )}
      >
        <div className="cc-funnel" role="tablist" aria-label="Journey stages">
          {stages.map((s, i) => {
            const on = s.id === stage.id;
            const lit = svc ? actsAt(svc.id, s) : false;
            const drop = i > 0 ? stages[i - 1].retained - s.retained : 0;
            return (
              <div key={s.id} className="cc-funnel-col">
                {i > 0 && <span className="cc-funnel-drop cc-num" aria-hidden="true">−{drop}</span>}
                <button
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls="cc-stage-panel"
                  className={`cc-funnel-step ${on ? 'is-on' : ''} ${lit ? 'is-lit' : ''} ${svc && !lit ? 'is-dim' : ''}`}
                  onClick={() => set({ stage: s.id }, { replace: true })}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight') { e.preventDefault(); const n = stages[Math.min(i + 1, stages.length - 1)]; set({ stage: n.id }, { replace: true }); (e.currentTarget.parentElement?.nextElementSibling?.querySelector('button') as HTMLElement | null)?.focus(); }
                    if (e.key === 'ArrowLeft') { e.preventDefault(); const n = stages[Math.max(i - 1, 0)]; set({ stage: n.id }, { replace: true }); (e.currentTarget.parentElement?.previousElementSibling?.querySelector('button') as HTMLElement | null)?.focus(); }
                  }}
                  tabIndex={on ? 0 : -1}
                  title={`${s.label}: ${s.retained} of 100 with support, ${s.retainedUnsupported} without`}
                >
                  <span className="cc-funnel-num">{i + 1}</span>
                  <span className="cc-funnel-label">{s.label}</span>
                  <span className="cc-funnel-timing">{s.timing}</span>
                  <span className="cc-funnel-bars" aria-hidden="true">
                    <span className="cc-funnel-bar" style={{ height: `${((s.retained - 60) / 40) * 100}%` }} />
                    {compare && <span className="cc-funnel-bar is-ghost" style={{ height: `${((s.retainedUnsupported - 60) / 40) * 100}%` }} />}
                  </span>
                  <span className="cc-funnel-val">
                    <strong className="cc-num">{s.retained}</strong>
                    {compare && <span className="cc-num"> vs {s.retainedUnsupported}</span>}
                  </span>
                  <span className="cc-funnel-svcs" aria-hidden="true">
                    {s.services.map((x) => <i key={x.serviceId} style={{ background: SERVICE_COLOR[x.serviceId] }} />)}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
        <div className="cc-legend cc-legend-inline">
          <span><i style={{ background: 'var(--cc-accent-2)' }} />With community support</span>
          {compare && <span><i style={{ background: 'var(--cc-gray-soft)' }} />Comparison cohort, no support</span>}
          <span className="cc-legend-note">Bars start at 60 to show the gaps. Dots show services acting at each stage.</span>
        </div>
      </Card>

      <div className="cc-grid cc-grid-1-1" id="cc-stage-panel" role="tabpanel" aria-label={`${stage.label} details`}>
        <Card
          id="jr-stage"
          title={<>{stage.label} <span className="cc-muted-inline">· {stage.timing}</span></>}
          subtitle={`Main drop-out risk: ${stage.dropRisk.toLowerCase()}.`}
        >
          <div className="cc-stats cc-stats-3">
            <Stat label="People in this stage now" value={fmtInt(stage.inStage)} hint="aggregated" />
            <Stat label="Still on treatment" value={`${stage.retained} / 100`} hint={`${stage.retainedUnsupported} without support`} />
            <Stat label="Lost at this step" value={prev ? `${dropHere}` : '—'} hint={prev ? `${dropUnsupported} without support` : 'first stage'} tone={dropHere >= 4 ? 'warn' : undefined} />
          </div>
          <h3 className="cc-h3">Why people drop out here</h3>
          <BarList
            items={stage.reasons.map((r) => ({ id: r.label, label: r.label, value: r.share, color: 'var(--cc-med)' }))}
            format={(v) => `${v}%`}
            max={100}
          />
          <p className="cc-fine">Median time in stage: {stage.medianDays} days. Reasons are reported by peer navigators and aggregated.</p>
        </Card>

        <Card id="jr-services" title="Support services acting at this stage" subtitle={`${stage.services.length} service${stage.services.length > 1 ? 's' : ''}, aggregated across all regions.`}>
          <ul className="cc-svc-list">
            {stage.services.map((x) => {
              const s = serviceById.get(x.serviceId)!;
              return (
                <li key={x.serviceId} className={`cc-svc ${serviceParam === x.serviceId ? 'is-on' : ''}`}>
                  <span className="cc-svc-dot" style={{ background: SERVICE_COLOR[x.serviceId] }} aria-hidden="true" />
                  <div className="cc-svc-body">
                    <div className="cc-svc-top">
                      <strong>{s.name}</strong>
                      <span className="cc-num cc-svc-enrolled">{fmtInt(x.enrolled)} people</span>
                    </div>
                    <p className="cc-svc-effect">{x.effect}</p>
                    <p className="cc-svc-what">{s.what}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <Card
        id="jr-catalogue"
        title="Service catalogue"
        subtitle="Select a service to highlight the stages where it acts."
        actions={svc ? <button type="button" className="cc-link-btn" onClick={() => set({ service: null }, { replace: true })}>Clear highlight</button> : undefined}
      >
        <div className="cc-svc-grid">
          {services.map((s) => {
            const on = serviceParam === s.id;
            const fl = funding.find((f) => f.id === s.fundedBy);
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={on}
                className={`cc-svc-card ${on ? 'is-on' : ''}`}
                style={{ ['--svc' as string]: SERVICE_COLOR[s.id] }}
                onClick={() => set({ service: on ? null : s.id }, { replace: true })}
              >
                <span className="cc-svc-card-top">
                  <span className="cc-svc-dot" aria-hidden="true" />
                  <strong>{s.name}</strong>
                </span>
                <span className="cc-svc-card-what">{s.what}</span>
                <span className="cc-svc-card-meta">
                  <Tag tone={fl?.status === 'ending' ? 'bad' : fl?.status === 'pending' ? 'warn' : 'good'}>
                    {fl?.status === 'ending' ? 'Funding ends in 7 mo' : fl?.status === 'pending' ? 'Funding pending' : 'Funding secured'}
                  </Tag>
                  <span className="cc-num">{fmtUsd(s.costPerPatient)} / person</span>
                </span>
              </button>
            );
          })}
        </div>
        {svc && (
          <div className="cc-svc-detail" aria-live="polite">
            <p><strong>{svc.name}</strong> is provided by {svc.provider.toLowerCase()}. It acts at {svc.stages === 'all' ? 'every stage' : `${svc.stages.length} stages`} of the journey. Indicative cost {fmtUsd(svc.costPerPatient)} per person per treatment course.</p>
            <button type="button" className="cc-link-btn" onClick={() => go('impact')}>See costs and outcomes <Icon name="arrow-right" size={14} /></button>
          </div>
        )}
      </Card>
    </div>
  );
}
