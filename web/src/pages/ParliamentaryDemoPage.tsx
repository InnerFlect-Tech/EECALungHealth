import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { SiteLayout } from '../components/Layout';
import {
  issue, evidence, options, recommendation, stakeholders, links, tracker,
} from '../demo/kazakhstanScenario';
import type { EvidenceType, Status, Option } from '../demo/kazakhstanScenario';
import '../demo.css';

const CANONICAL = 'https://eecalunghealth.com/demo/parliamentary-intelligence';

const TABS = [
  { id: 'dashboard', label: 'Decision dashboard' },
  { id: 'evidence', label: 'Evidence workspace' },
  { id: 'brief', label: 'Decision brief' },
  { id: 'stakeholders', label: 'Stakeholder map' },
  { id: 'tracker', label: 'Decision tracker' },
] as const;
type TabId = (typeof TABS)[number]['id'];

function Banner() {
  return (
    <div className="pi-banner" role="note">
      <strong>Demo · illustrative scenario.</strong> Figures, dates, documents and stakeholder positions are illustrative, not official data.
    </div>
  );
}

function Dashboard() {
  return (
    <div className="pi-stack">
      <section className="pi-card pi-issue">
        <p className="pi-eyebrow">Active policy issue · {issue.country}</p>
        <h2>{issue.title}</h2>
        <p className="pi-muted">{issue.summary}</p>
        <ol className="pi-stages" aria-label="Decision stage">
          {issue.stages.map((s, i) => (
            <li key={s} className={i < issue.stageIndex ? 'is-done' : i === issue.stageIndex ? 'is-current' : ''} aria-current={i === issue.stageIndex ? 'step' : undefined}>
              <span className="pi-stage-dot" aria-hidden="true" />{s}
            </li>
          ))}
        </ol>
      </section>
      <div className="pi-kpis">
        {issue.kpis.map((k) => (
          <div className="pi-card pi-kpi" key={k.label}>
            <span className="pi-kpi-label">{k.label}</span>
            <span className="pi-kpi-value">{k.value}</span>
            <span className="pi-kpi-note">{k.note}</span>
          </div>
        ))}
      </div>
      <div className="pi-grid2">
        <section className="pi-card">
          <h3>Decision deadline</h3>
          <p className="pi-big">{issue.deadlineLabel}</p>
          <p className="pi-muted">Current status: <strong>{issue.stage}</strong></p>
          <h3 className="pi-mt">Responsible institutions</h3>
          <ul className="pi-list">
            {issue.institutions.map((i) => (
              <li key={i.name}><strong>{i.name}</strong><span>{i.role}</span></li>
            ))}
          </ul>
        </section>
        <section className="pi-card">
          <h3>Outstanding questions</h3>
          <ul className="pi-list">
            {issue.questions.map((q) => (
              <li key={q.q}>
                <span className={`pi-tag pi-tag-${q.priority}`}>{q.priority} priority</span>
                <strong>{q.q}</strong><span>Owner: {q.owner}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

const TYPE_LABEL: Record<EvidenceType, string> = {
  research: 'Research', legislation: 'Legislation', financing: 'Financing', stakeholder: 'Stakeholder perspectives', gap: 'Evidence gaps',
};

function Evidence() {
  const [filter, setFilter] = useState<EvidenceType | 'all'>('all');
  const items = filter === 'all' ? evidence : evidence.filter((e) => e.type === filter);
  const types = Object.keys(TYPE_LABEL) as EvidenceType[];
  return (
    <div className="pi-stack">
      <div className="pi-filters" role="group" aria-label="Filter evidence by type">
        {(['all', ...types] as const).map((t) => (
          <button key={t} type="button" className="pi-chip" aria-pressed={filter === t} onClick={() => setFilter(t)}>
            {t === 'all' ? 'All' : TYPE_LABEL[t]}
            <span className="pi-chip-count">{t === 'all' ? evidence.length : evidence.filter((e) => e.type === t).length}</span>
          </button>
        ))}
      </div>
      <p className="pi-muted" aria-live="polite">{items.length} item{items.length === 1 ? '' : 's'} shown</p>
      <div className="pi-evidence">
        {items.map((e) => (
          <article key={e.id} className={`pi-card pi-ev pi-ev-${e.type}`}>
            <div className="pi-ev-head">
              <span className="pi-tag">{TYPE_LABEL[e.type]}</span>
              <span className={`pi-conf pi-conf-${e.confidence}`}>
                <span className="pi-conf-bars" aria-hidden="true"><i /><i /><i /></span>
                {e.confidence} confidence
              </span>
            </div>
            <h3>{e.title}</h3>
            <p className="pi-src">{e.sourceType} · {e.source}</p>
            <p>{e.summary}</p>
            <p className="pi-rel"><strong>Why it matters:</strong> {e.relevance}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function Dots({ n, label }: { n: number; label: string }) {
  return (
    <span className="pi-dots" role="img" aria-label={`${label}: ${n} of 3`}>
      {[1, 2, 3].map((i) => <i key={i} className={i <= n ? 'on' : ''} />)}
    </span>
  );
}

function OptionCard({ o }: { o: Option }) {
  return (
    <article className={`pi-card pi-opt${o.recommended ? ' is-rec' : ''}`}>
      <div className="pi-ev-head">
        <span className="pi-opt-id">Option {o.id}</span>
        {o.recommended && <span className="pi-tag pi-tag-rec">Recommended in this demo</span>}
      </div>
      <h3>{o.title}</h3>
      <p className="pi-muted">{o.mechanism}</p>
      <dl className="pi-dl">
        <div><dt>Indicative cost</dt><dd>{o.cost} <small>({o.costNote})</small></dd></div>
        <div><dt>Time to implement</dt><dd>{o.timeToImplement}</dd></div>
        <div><dt>Legal basis</dt><dd>{o.legalBasis}</dd></div>
      </dl>
      <div className="pi-pc">
        <div><h4>Advantages</h4><ul>{o.pros.map((p) => <li key={p}>{p}</li>)}</ul></div>
        <div><h4>Trade-offs</h4><ul>{o.cons.map((p) => <li key={p}>{p}</li>)}</ul></div>
        <div><h4>Risks</h4><ul>{o.risks.map((p) => <li key={p}>{p}</li>)}</ul></div>
      </div>
    </article>
  );
}

function Brief() {
  const [mode, setMode] = useState<'cards' | 'compare'>('cards');
  return (
    <div className="pi-stack">
      <section className="pi-card">
        <p className="pi-eyebrow">The problem</p>
        <p className="pi-lead">{issue.summary}</p>
      </section>
      <div className="pi-row">
        <h2 className="pi-h2">Policy responses</h2>
        <div className="pi-seg" role="group" aria-label="View mode">
          <button type="button" aria-pressed={mode === 'cards'} onClick={() => setMode('cards')}>Detail</button>
          <button type="button" aria-pressed={mode === 'compare'} onClick={() => setMode('compare')}>Compare side by side</button>
        </div>
      </div>
      {mode === 'cards' ? (
        <div className="pi-opts">{options.map((o) => <OptionCard key={o.id} o={o} />)}</div>
      ) : (
        <div className="pi-table-wrap" tabIndex={0} role="region" aria-label="Option comparison table">
          <table className="pi-table">
            <caption className="pi-sr">Comparison of three policy options (illustrative)</caption>
            <thead>
              <tr><th scope="col">Criterion</th>{options.map((o) => <th scope="col" key={o.id} className={o.recommended ? 'is-rec' : ''}>Option {o.id}<span>{o.short}</span></th>)}</tr>
            </thead>
            <tbody>
              <tr><th scope="row">Indicative cost</th>{options.map((o) => <td key={o.id}>{o.cost}</td>)}</tr>
              <tr><th scope="row">Time to implement</th>{options.map((o) => <td key={o.id}>{o.timeToImplement}</td>)}</tr>
              <tr><th scope="row">Long-term sustainability</th>{options.map((o) => <td key={o.id}><Dots n={o.sustainability} label="Sustainability" /></td>)}</tr>
              <tr><th scope="row">Near-term feasibility</th>{options.map((o) => <td key={o.id}><Dots n={o.feasibility} label="Feasibility" /></td>)}</tr>
              <tr><th scope="row">Reach of NGO services</th>{options.map((o) => <td key={o.id}><Dots n={o.ngoReach} label="NGO reach" /></td>)}</tr>
              <tr><th scope="row">Main risk</th>{options.map((o) => <td key={o.id}>{o.risks[0]}</td>)}</tr>
            </tbody>
          </table>
          <p className="pi-muted pi-small">All costs are indicative and illustrative. Scores are qualitative demo judgements (1–3).</p>
        </div>
      )}
      <section className="pi-card pi-next">
        <p className="pi-eyebrow">Recommended next procedural step</p>
        <h3>{recommendation.step}</h3>
        <p>{recommendation.text}</p>
        <p className="pi-muted">Owner: {recommendation.owner}</p>
      </section>
    </div>
  );
}

const GROUP_LABEL = {
  parliament: 'Parliament', government: 'Government', technical: 'Technical agency', implementer: 'Local implementer', civil: 'Civil society', funder: 'Funder',
} as const;

function StakeholderMap() {
  const [sel, setSel] = useState('mazhilis');
  const s = stakeholders.find((x) => x.id === sel)!;
  const pos = (id: string) => stakeholders.find((x) => x.id === id)!;
  return (
    <div className="pi-map-layout">
      <div className="pi-card pi-map">
        <svg className="pi-map-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {links.map(([a, b]) => {
            const A = pos(a); const B = pos(b);
            const on = a === sel || b === sel;
            return <line key={a + b} x1={A.x} y1={A.y} x2={B.x} y2={B.y} className={on ? 'on' : ''} vectorEffect="non-scaling-stroke" />;
          })}
        </svg>
        {stakeholders.map((x) => (
          <button
            key={x.id}
            type="button"
            className={`pi-node pi-g-${x.group}`}
            style={{ left: `${x.x}%`, top: `${x.y}%` }}
            aria-pressed={sel === x.id}
            onClick={() => setSel(x.id)}
          >
            {x.name}
          </button>
        ))}
      </div>
      <aside className="pi-card pi-detail" aria-live="polite">
        <span className={`pi-tag pi-g-${s.group}`}>{GROUP_LABEL[s.group]}</span>
        <h3>{s.id === 'moh' ? 'Ministry of Health of the Republic of Kazakhstan' : s.id === 'mof' ? 'Ministry of Finance of the Republic of Kazakhstan' : s.name}</h3>
        <h4>Responsibilities</h4>
        <ul>{s.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul>
        <dl className="pi-dl">
          <div><dt>Interest</dt><dd>{s.interest}</dd></div>
          <div><dt>Position</dt><dd>{s.position}</dd></div>
          <div><dt>Linked to</dt><dd>{links.filter((l) => l.includes(s.id)).map((l) => pos(l[0] === s.id ? l[1] : l[0]).name).join(', ')}</dd></div>
        </dl>
      </aside>
    </div>
  );
}

const COLS: { id: Status; label: string }[] = [
  { id: 'done', label: 'Reviewed' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'awaiting', label: 'Awaiting action' },
  { id: 'blocked', label: 'Blocked' },
];
const fmt = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

function Tracker() {
  const next = tracker.find((t) => t.status === 'awaiting');
  return (
    <div className="pi-stack">
      {next && (
        <section className="pi-card pi-next">
          <p className="pi-eyebrow">Next step owner</p>
          <h3>{next.owner}</h3>
          <p>{next.title} · due {fmt(next.date)} (illustrative)</p>
        </section>
      )}
      <div className="pi-kanban">
        {COLS.map((c) => {
          const items = tracker.filter((t) => t.status === c.id);
          return (
            <section key={c.id} className={`pi-col pi-col-${c.id}`} aria-label={c.label}>
              <h3>{c.label} <span>{items.length}</span></h3>
              {items.map((t) => (
                <article key={t.id} className="pi-task">
                  <strong>{t.title}</strong>
                  <span>{t.owner}</span>
                  <time dateTime={t.date}>{fmt(t.date)}</time>
                  <small>{t.note}</small>
                </article>
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default function ParliamentaryDemoPage() {
  const [tab, setTab] = useState<TabId>('dashboard');
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const prev = document.title;
    document.title = 'Parliamentary Intelligence demo • EECA Lung Health Hub';
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const created = !link;
    const prevHref = link?.href;
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = CANONICAL;
    return () => {
      document.title = prev;
      if (created) link?.remove(); else if (link && prevHref) link.href = prevHref;
    };
  }, []);

  const onKey = (e: KeyboardEvent, i: number) => {
    let n = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % TABS.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + TABS.length) % TABS.length;
    if (e.key === 'Home') n = 0;
    if (e.key === 'End') n = TABS.length - 1;
    if (n >= 0) { e.preventDefault(); setTab(TABS[n].id); refs.current[n]?.focus(); }
  };

  return (
    <SiteLayout>
      <div className="pi-page">
        <header className="pi-head container">
          <p className="pi-eyebrow">Demo · Parliamentary Intelligence &amp; Decision Support</p>
          <h1>From a complex health issue to an informed institutional decision</h1>
          <p className="pi-muted">Scenario: Kazakhstan, sustainable domestic financing for community-based TB patient support.</p>
        </header>
        <div className="pi-shell container">
          <nav className="pi-tabs" role="tablist" aria-label="Workspace views" aria-orientation="vertical">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => { refs.current[i] = el; }}
                role="tab"
                id={`pi-tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`pi-panel-${t.id}`}
                tabIndex={tab === t.id ? 0 : -1}
                onClick={() => setTab(t.id)}
                onKeyDown={(e) => onKey(e, i)}
              >
                <span className="pi-tab-n" aria-hidden="true">{i + 1}</span>{t.label}
              </button>
            ))}
          </nav>
          <div className="pi-main">
            <Banner />
            <div role="tabpanel" id={`pi-panel-${tab}`} aria-labelledby={`pi-tab-${tab}`} tabIndex={0} className="pi-panel">
              {tab === 'dashboard' && <Dashboard />}
              {tab === 'evidence' && <Evidence />}
              {tab === 'brief' && <Brief />}
              {tab === 'stakeholders' && <StakeholderMap />}
              {tab === 'tracker' && <Tracker />}
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
