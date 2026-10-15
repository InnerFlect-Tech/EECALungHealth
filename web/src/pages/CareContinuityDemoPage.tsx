import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from '../components/Layout';
import { scenario, type Actor, type Severity } from '../demo/careContinuityScenario';
import '../demo-care.css';

// Demo page (route: /demo/care-continuity). Not in the menu. Patient-facing
// counterpart to /demo/parliamentary-intelligence for the same Kazakhstan
// scenario. All data is synthetic (see ../demo/careContinuityScenario.ts).

const PAGE_URL = 'https://eecalunghealth.com/demo/care-continuity';

const VIEWS = [
  { id: 'overview', label: 'Programme overview' },
  { id: 'journey', label: 'Patient journey' },
  { id: 'alerts', label: 'Continuity alerts' },
  { id: 'map', label: 'Service map' },
  { id: 'impact', label: 'Impact and evidence' },
] as const;
type ViewId = (typeof VIEWS)[number]['id'];

const SEVERITY_LABEL: Record<Severity, string> = { high: 'High', medium: 'Medium', low: 'Low' };
const serviceName = (id: string) => scenario.services.find((s) => s.id === id)?.name ?? id;

function Banner() {
  return (
    <p className="dcc-banner" role="note">
      <span className="dcc-banner-tag">Demo</span>
      <span>Illustrative scenario. All figures, cohorts and alerts are synthetic. No real patient data.</span>
    </p>
  );
}

function Overview() {
  const maxCohort = Math.max(...scenario.regions.map((r) => r.cohort));
  const topAlerts = scenario.alerts.filter((a) => a.severity === 'high');
  return (
    <div className="dcc-stack">
      <div className="dcc-kpis">
        {scenario.kpis.map((k) => (
          <div key={k.id} className={`dcc-card dcc-kpi ${k.good ? 'is-good' : 'is-warn'}`}>
            <p className="dcc-kpi-label">{k.label}</p>
            <p className="dcc-kpi-value">
              {k.value}
              <span className="dcc-kpi-trend" aria-hidden="true">{k.trend === 'up' ? '▲' : k.trend === 'down' ? '▼' : '■'}</span>
            </p>
            <p className="dcc-kpi-note">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="dcc-grid-2">
        <section className="dcc-card" aria-labelledby="dcc-regions">
          <h3 id="dcc-regions">Regions covered</h3>
          <p className="dcc-muted">Supported cohort and share of doses taken, last 4 weeks.</p>
          <ul className="dcc-regions">
            {scenario.regions.map((r) => (
              <li key={r.name}>
                <div className="dcc-region-head">
                  <strong>{r.name}</strong>
                  <span className="dcc-muted">{r.districts} districts · {r.cohort} people</span>
                </div>
                <div className="dcc-bar" aria-hidden="true"><span style={{ width: `${(r.cohort / maxCohort) * 100}%` }} /></div>
                <p className={`dcc-region-adh ${r.adherence < 90 ? 'is-warn' : ''}`}>{r.adherence}% doses taken</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="dcc-card" aria-labelledby="dcc-funding">
          <h3 id="dcc-funding">Funding status</h3>
          <p className="dcc-muted">What pays for the support package today.</p>
          <ul className="dcc-funding">
            {scenario.funding.map((f) => (
              <li key={f.label}>
                <span className={`dcc-pill dcc-pill-${f.status}`}>{f.status === 'ending' ? 'Ending' : f.status === 'pending' ? 'Decision pending' : 'Secured'}</span>
                <div>
                  <strong>{f.label}</strong>
                  <p className="dcc-muted">{f.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="dcc-card" aria-labelledby="dcc-now">
        <h3 id="dcc-now">Needs attention now</h3>
        <ul className="dcc-alert-mini">
          {topAlerts.map((a) => (
            <li key={a.id}>
              <span className={`dcc-sev dcc-sev-${a.severity}`}>{SEVERITY_LABEL[a.severity]}</span>
              <span><strong>{a.scope}.</strong> {a.signal}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function RetentionChart() {
  const W = 640, H = 220, L = 40, R = 16, T = 16, B = 28;
  const n = scenario.stages.length;
  const x = (i: number) => L + (i * (W - L - R)) / (n - 1);
  const y = (v: number) => T + ((100 - v) / 40) * (H - T - B);
  const line = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');
  const sup = scenario.stages.map((s) => s.retained);
  const uns = scenario.unsupportedRetained;
  const gap = `${line(sup)} ${[...uns].reverse().map((v, i) => `L${x(n - 1 - i)},${y(v)}`).join(' ')} Z`;
  return (
    <figure className="dcc-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Illustrative chart: people still on treatment at each stage, out of 100. With support: 100, 97, 93, 89, 87. Without support: 100, 94, 86, 78, 74.">
        {[100, 90, 80, 70, 60].map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} className="dcc-grid" />
            <text x={L - 8} y={y(v) + 4} textAnchor="end" className="dcc-axis">{v}</text>
          </g>
        ))}
        <path d={gap} className="dcc-gap" />
        <path d={line(uns)} className="dcc-line dcc-line-muted" />
        <path d={line(sup)} className="dcc-line" />
        {sup.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={4} className="dcc-dot" />)}
        <text x={x(n - 1) - 6} y={y(sup[n - 1]) - 10} textAnchor="end" className="dcc-label">{sup[n - 1]} with support</text>
        <text x={x(n - 1) - 6} y={y(uns[n - 1]) + 18} textAnchor="end" className="dcc-label dcc-label-muted">{uns[n - 1]} without</text>
      </svg>
      <figcaption className="dcc-legend">
        <span><i className="dcc-key" /> With community support</span>
        <span><i className="dcc-key dcc-key-muted" /> Without (comparison)</span>
        <span><i className="dcc-key dcc-key-gap" /> People kept on treatment</span>
      </figcaption>
    </figure>
  );
}

function Journey() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className="dcc-stack">
      <section className="dcc-card" aria-labelledby="dcc-journey-h">
        <h3 id="dcc-journey-h">From diagnosis to completion</h3>
        <p className="dcc-muted">Out of every 100 people starting, how many are still on treatment at each stage (illustrative).</p>
        <ol className="dcc-journey">
          {scenario.stages.map((s, i) => {
            const lost = i > 0 ? scenario.stages[i - 1].retained - s.retained : 0;
            return (
              <li key={s.id} className="dcc-stage">
                <span className="dcc-stage-dot" aria-hidden="true">{i + 1}</span>
                <div className="dcc-stage-body">
                  <p className="dcc-stage-time">{s.timing}</p>
                  <h4>{s.label}</h4>
                  <p className="dcc-stage-num"><strong>{s.retained}</strong> of 100 on treatment{lost > 0 && <span className="dcc-drop"> · {lost} lost</span>}</p>
                  <p className="dcc-stage-risk"><span>Drop-out risk:</span> {s.dropRisk}</p>
                  <ul className="dcc-chips" aria-label="Support services at this stage">
                    {s.services.map((id) => (
                      <li key={id} className={`dcc-chip dcc-chip-${id}${active && active !== id ? ' is-dim' : ''}`}>{serviceName(id)}</li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="dcc-grid-2">
        <section className="dcc-card" aria-labelledby="dcc-ret-h">
          <h3 id="dcc-ret-h">Where people drop out</h3>
          <RetentionChart />
        </section>
        <section className="dcc-card" aria-labelledby="dcc-svc-h">
          <h3 id="dcc-svc-h">Support services</h3>
          <p className="dcc-muted">Select one to highlight where it acts.</p>
          <div className="dcc-services">
            {scenario.services.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={active === s.id}
                className={`dcc-service dcc-chip-${s.id}`}
                onClick={() => setActive(active === s.id ? null : s.id)}
              >
                <strong>{s.name}</strong>
                <span>{s.what}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Alerts() {
  const [filter, setFilter] = useState<Severity | 'all'>('all');
  const list = scenario.alerts.filter((a) => filter === 'all' || a.severity === filter);
  return (
    <div className="dcc-stack">
      <div className="dcc-filter" role="group" aria-label="Filter by severity">
        {(['all', 'high', 'medium', 'low'] as const).map((f) => (
          <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f === 'all' ? `All (${scenario.alerts.length})` : `${SEVERITY_LABEL[f]} (${scenario.alerts.filter((a) => a.severity === f).length})`}
          </button>
        ))}
      </div>
      <p className="dcc-muted dcc-privacy">Signals are aggregated by region or district. No individual patient records are shown.</p>
      <ul className="dcc-alerts" aria-live="polite">
        {list.map((a) => (
          <li key={a.id} className={`dcc-card dcc-alert dcc-alert-${a.severity}`}>
            <div className="dcc-alert-top">
              <span className={`dcc-sev dcc-sev-${a.severity}`}>{SEVERITY_LABEL[a.severity]}</span>
              <span className="dcc-alert-cat">{a.category}</span>
              <span className="dcc-alert-id">{a.id}</span>
            </div>
            <p className="dcc-alert-scope">{a.scope}</p>
            <p className="dcc-alert-signal">{a.signal}</p>
            <div className="dcc-alert-action">
              <p><span>Suggested action</span>{a.action}</p>
              <p><span>Owner</span>{a.owner}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ServiceMap() {
  const [sel, setSel] = useState<string>('ngo');
  const actor = scenario.actors.find((a) => a.id === sel) as Actor;
  const C = 260;
  const pos = (a: Actor) => {
    const r = a.ring === 'care' ? 120 : 210;
    const rad = (a.angle * Math.PI) / 180;
    return { x: C + r * Math.sin(rad), y: C - r * Math.cos(rad) };
  };
  return (
    <div className="dcc-map-wrap">
      <section className="dcc-card" aria-labelledby="dcc-map-h">
        <h3 id="dcc-map-h">Who acts around the patient</h3>
        <p className="dcc-muted">Inner ring: direct care. Outer ring: policy, funding and oversight. Select a node.</p>
        <svg viewBox="0 0 520 520" className="dcc-map" role="group" aria-label="Service map">
          <circle cx={C} cy={C} r={120} className="dcc-ring" />
          <circle cx={C} cy={C} r={210} className="dcc-ring dcc-ring-outer" />
          {scenario.actors.map((a) => {
            const p = pos(a);
            return <line key={a.id} x1={C} y1={C} x2={p.x} y2={p.y} className={`dcc-spoke${a.id === sel ? ' is-on' : ''}`} />;
          })}
          <circle cx={C} cy={C} r={50} className="dcc-core" />
          <text x={C} y={C - 4} textAnchor="middle" className="dcc-core-text">Person on</text>
          <text x={C} y={C + 14} textAnchor="middle" className="dcc-core-text">treatment</text>
          {scenario.actors.map((a) => {
            const p = pos(a);
            const w = Math.max(96, a.short.length * 8.4 + 24);
            const on = a.id === sel;
            return (
              <g
                key={a.id}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={a.name}
                className={`dcc-node dcc-node-${a.ring}${on ? ' is-on' : ''}`}
                onClick={() => setSel(a.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(a.id); } }}
              >
                <rect x={p.x - w / 2} y={p.y - 19} width={w} height={38} rx={19} />
                <text x={p.x} y={p.y + 5} textAnchor="middle">{a.short}</text>
              </g>
            );
          })}
        </svg>
      </section>
      <aside className="dcc-card dcc-actor" aria-live="polite">
        <p className="dcc-eyebrow">{actor.ring === 'care' ? 'Direct care' : 'Policy and funding'}</p>
        <h3>{actor.name}</h3>
        <p className="dcc-actor-role">{actor.role}</p>
        <ul>
          {actor.responsibilities.map((r) => <li key={r}>{r}</li>)}
        </ul>
      </aside>
    </div>
  );
}

function OutcomesChart() {
  const W = 640, H = 240, L = 40, R = 16, T = 16, B = 32;
  const d = scenario.outcomes;
  const x = (i: number) => L + (i * (W - L - R)) / (d.length - 1);
  const y = (v: number) => T + ((95 - v) / 25) * (H - T - B);
  const line = (k: 'supported' | 'comparison') => d.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p[k])}`).join(' ');
  return (
    <figure className="dcc-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Illustrative chart: treatment success by quarter. Supported cohort rises from ${d[0].supported}% to ${d[d.length - 1].supported}%. Comparison cohort stays near ${d[d.length - 1].comparison}%.`}>
        {[90, 80, 70].map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} className="dcc-grid" />
            <text x={L - 8} y={y(v) + 4} textAnchor="end" className="dcc-axis">{v}%</text>
          </g>
        ))}
        {d.map((p, i) => (i % 2 === 0 || i === d.length - 1) && (
          <text key={p.q} x={x(i)} y={H - 8} textAnchor="middle" className="dcc-axis">{p.q}</text>
        ))}
        <path d={line('comparison')} className="dcc-line dcc-line-muted" />
        <path d={line('supported')} className="dcc-line" />
        <circle cx={x(d.length - 1)} cy={y(d[d.length - 1].supported)} r={5} className="dcc-dot" />
        <text x={x(d.length - 1) - 8} y={y(d[d.length - 1].supported) - 10} textAnchor="end" className="dcc-label">{d[d.length - 1].supported}% supported</text>
        <text x={x(d.length - 1) - 8} y={y(d[d.length - 1].comparison) + 20} textAnchor="end" className="dcc-label dcc-label-muted">{d[d.length - 1].comparison}% comparison</text>
      </svg>
      <figcaption className="dcc-legend">
        <span><i className="dcc-key" /> Supported cohort</span>
        <span><i className="dcc-key dcc-key-muted" /> Comparison cohort</span>
      </figcaption>
    </figure>
  );
}

function Impact() {
  const total = scenario.costs.reduce((s, c) => s + c.value, 0);
  const max = Math.max(...scenario.costs.map((c) => c.value));
  return (
    <div className="dcc-stack">
      <div className="dcc-grid-2 dcc-grid-wide">
        <section className="dcc-card" aria-labelledby="dcc-out-h">
          <h3 id="dcc-out-h">Treatment success over time</h3>
          <p className="dcc-muted">Share of each quarterly cohort completing treatment (illustrative).</p>
          <OutcomesChart />
        </section>
        <section className="dcc-card" aria-labelledby="dcc-cost-h">
          <h3 id="dcc-cost-h">Cost per patient supported <span className="dcc-pill dcc-pill-pending">Indicative</span></h3>
          <p className="dcc-muted">USD per full treatment course. Placeholder values for discussion, not a costing.</p>
          <p className="dcc-cost-total"><strong>~${total}</strong> per person</p>
          <ul className="dcc-costs">
            {scenario.costs.map((c) => (
              <li key={c.label}>
                <span>{c.label}</span>
                <div className="dcc-bar" aria-hidden="true"><span style={{ width: `${(c.value / max) * 100}%` }} /></div>
                <span className="dcc-cost-val">${c.value}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="dcc-card dcc-evidence" aria-labelledby="dcc-ev-h">
        <p className="dcc-eyebrow">Evidence for decision-makers</p>
        <h3 id="dcc-ev-h">What this programme tells the budget decision</h3>
        <ol>
          {scenario.evidence.map((e) => <li key={e}>{e}</li>)}
        </ol>
        <Link className="btn btn-primary" to="/demo/parliamentary-intelligence">See how this evidence feeds the parliamentary decision →</Link>
      </section>
    </div>
  );
}

export function CareContinuityDemoPage() {
  const [view, setView] = useState<ViewId>('overview');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Demo: Community TB Care Continuity • EECA Lung Health Hub';
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const prevHref = canonical?.href;
    if (canonical) canonical.href = PAGE_URL;
    return () => {
      document.title = prevTitle;
      if (canonical && prevHref) canonical.href = prevHref;
    };
  }, []);

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % VIEWS.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + VIEWS.length) % VIEWS.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = VIEWS.length - 1;
    if (next < 0) return;
    e.preventDefault();
    setView(VIEWS[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <SiteLayout>
      <section className="dcc-hero">
        <div className="container">
          <p className="dcc-hero-eyebrow">Interactive demo · Patient-facing model · {scenario.country}</p>
          <h1>{scenario.title}</h1>
          <p className="dcc-lead">
            A workspace for outreach workers, NGO case managers and programme coordinators. It shows how community
            support keeps people on TB treatment, and what evidence that produces for the decision on{' '}
            <em>{scenario.question.charAt(0).toLowerCase() + scenario.question.slice(1)}</em>.
          </p>
        </div>
      </section>

      <section className="dcc-main">
        <div className="container">
          <Banner />
          <div className="dcc-tabs" role="tablist" aria-label="Demo views">
            {VIEWS.map((v, i) => (
              <button
                key={v.id}
                ref={(el) => { tabRefs.current[i] = el; }}
                role="tab"
                id={`dcc-tab-${v.id}`}
                aria-selected={view === v.id}
                aria-controls="dcc-panel"
                tabIndex={view === v.id ? 0 : -1}
                className="dcc-tab"
                onClick={() => setView(v.id)}
                onKeyDown={(e) => onTabKey(e, i)}
              >
                <span className="dcc-tab-num" aria-hidden="true">{i + 1}</span>
                {v.label}
              </button>
            ))}
          </div>
          <div id="dcc-panel" role="tabpanel" aria-labelledby={`dcc-tab-${view}`} tabIndex={0} className="dcc-panel">
            <div className="dcc-panel-head">
              <h2>{VIEWS.find((v) => v.id === view)?.label}</h2>
              <span className="dcc-asof">{scenario.asOf}</span>
            </div>
            {view === 'overview' && <Overview />}
            {view === 'journey' && <Journey />}
            {view === 'alerts' && <Alerts />}
            {view === 'map' && <ServiceMap />}
            {view === 'impact' && <Impact />}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
