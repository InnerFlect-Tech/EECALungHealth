import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import * as S from '../kazakhstanScenario';
import type { OptionId, TaskStatus } from '../kazakhstanScenario';
import { Icon } from './Icon';
import { AnswerModal, NewTaskModal, RecommendModal, ReassignModal } from './modals';
import { ConfidenceMeter, Drawer, OwnerChip, PriorityBadge, Section, StanceBadge, StatusBadge, Switch, TypeBadge } from './ui';
import { initials, instName, stamp, statusLabel, typeLabel, useDemo, useNav, useToast } from './store';
import { daysUntil, fmtDate, fmtDateTime, relTime, useNow } from './format';
import { rankOptions } from './scoring';

const CONF_TEXT = {
  high: 'Consistent findings from authoritative or peer-reviewed sources.',
  medium: 'Credible source, but partial, indirect or not yet verified for Kazakhstan.',
  low: 'Illustrative, unverified or a known gap. Treat with caution.',
};

function EvidenceLinks({ ids }: { ids: string[] }) {
  const nav = useNav();
  return (
    <ul className="pi-link-list">
      {ids.map((id) => {
        const e = S.evidence.find((x) => x.id === id);
        if (!e) return null;
        return (
          <li key={id}>
            <button type="button" onClick={() => nav.go({ view: 'evidence', item: id })}>
              <TypeBadge type={e.type} />
              <span>{e.title}</span>
              <Icon name="chevronRight" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

// --- Question ---------------------------------------------------------------

function QuestionDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const { state, dispatch } = useDemo();
  const nav = useNav();
  const toast = useToast();
  const now = useNow();
  const [modal, setModal] = useState<'answer' | 'reassign' | null>(null);
  const q = state.questions.find((x) => x.id === id);
  if (!q) return null;
  const d = daysUntil(q.due, now);
  const prof = S.stakeholderProfiles.find((p) => p.institutionId === q.ownerId);
  return (
    <Drawer
      title={q.text}
      onClose={onClose}
      eyebrow={<><Icon name="message" />Question · {q.id.toUpperCase()}</>}
      meta={(
        <>
          {q.status === 'open' ? <span className="pi-status pi-status-awaiting"><i aria-hidden="true" />Open</span> : <span className="pi-status pi-status-reviewed"><i aria-hidden="true" />Answered</span>}
          <PriorityBadge p={q.priority} />
          <span className={`pi-due${q.status === 'open' && d < 0 ? ' is-over' : ''}`}><Icon name="calendar" size={13} />Due {fmtDate(q.due)}</span>
        </>
      )}
      footer={q.status === 'open' ? (
        <>
          <button type="button" className="pi-btn" onClick={() => setModal('reassign')}><Icon name="user" />Reassign</button>
          <button type="button" className="pi-btn pi-btn-primary" onClick={() => setModal('answer')}><Icon name="check" />Mark answered</button>
        </>
      ) : (
        <button type="button" className="pi-btn" onClick={() => { dispatch({ type: 'reopen', id: q.id, ...stamp() }); toast({ title: 'Question reopened', body: q.text, tone: 'info' }); }}><Icon name="refresh" />Reopen question</button>
      )}
    >
      {q.status === 'answered' && q.answer && (
        <div className="pi-callout pi-callout-success"><Icon name="check" /><div><strong>Answer</strong><p>{q.answer}</p></div></div>
      )}
      <Section title="Context"><p>{q.context}</p></Section>
      <Section title="Owner" aside={q.status === 'open' ? <button type="button" className="pi-link-btn" onClick={() => setModal('reassign')}>Change</button> : undefined}>
        <div className="pi-owner-card">
          <OwnerChip id={q.ownerId} />
          {prof && <StanceBadge stance={prof.stance} />}
          {prof && <button type="button" className="pi-link-btn" onClick={() => nav.go({ view: 'stakeholders', item: `sh-${q.ownerId}` })}>Profile <Icon name="arrowRight" /></button>}
        </div>
      </Section>
      <Section title="Timeline">
        <dl className="pi-kv">
          <div><dt>Raised</dt><dd>{fmtDate(q.raised)}</dd></div>
          <div><dt>Due</dt><dd>{fmtDate(q.due)}{q.status === 'open' && <span className="pi-muted-xs"> · {d < 0 ? `${-d} days overdue` : `in ${d} days`}</span>}</dd></div>
        </dl>
      </Section>
      <Section title={`Linked evidence (${q.linkedEvidence.length})`}><EvidenceLinks ids={q.linkedEvidence} /></Section>
      {modal === 'answer' && <AnswerModal questionId={q.id} onClose={() => setModal(null)} />}
      {modal === 'reassign' && <ReassignModal questionId={q.id} onClose={() => setModal(null)} />}
    </Drawer>
  );
}

// --- Evidence ---------------------------------------------------------------

function EvidenceDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const { state, dispatch } = useDemo();
  const nav = useNav();
  const toast = useToast();
  const [request, setRequest] = useState(false);
  const e = S.evidence.find((x) => x.id === id);
  if (!e) return null;
  const inBrief = state.inBrief.includes(e.id);
  const related = state.questions.filter((q) => q.linkedEvidence.includes(e.id));
  const requested = state.tasks.find((t) => t.kind === 'evidence-request' && t.title === e.title);
  return (
    <Drawer
      title={e.title}
      onClose={onClose}
      eyebrow={<><TypeBadge type={e.type} /><span>{e.id.toUpperCase()}</span></>}
      meta={<><ConfidenceMeter level={e.confidence} /><span className="pi-muted-xs">Added {fmtDate(e.date)}</span></>}
      footer={(
        <>
          <Switch
            checked={inBrief}
            label="Include in decision brief"
            onChange={() => {
              dispatch({ type: 'toggleBrief', id: e.id, ...stamp() });
              toast({ title: inBrief ? 'Removed from brief' : 'Added to brief', body: e.title, tone: 'info', action: { label: 'Open brief', ref: { view: 'brief' } } });
            }}
          />
          {e.type === 'gap' && (requested
            ? <button type="button" className="pi-btn" onClick={() => nav.go({ view: 'tracker', item: requested.id })}>View request</button>
            : <button type="button" className="pi-btn pi-btn-primary" onClick={() => setRequest(true)}><Icon name="send" />Request evidence</button>)}
        </>
      )}
    >
      {e.type === 'gap' && <div className="pi-callout pi-callout-warn"><Icon name="alert" /><div><strong>Evidence gap</strong><p>{e.relevance}</p></div></div>}
      <Section title="Summary"><p>{e.summary}</p></Section>
      <Section title="Key findings">
        <ul className="pi-bullets">{e.keyFindings.map((k) => <li key={k}>{k}</li>)}</ul>
      </Section>
      {e.link && (
        <Link className="pi-crosslink" to={e.link.href}>
          <span className="pi-crosslink-icon" aria-hidden="true"><Icon name="external" /></span>
          <span><strong>{e.link.label}</strong><span>Synthetic outcomes in the sibling care-continuity demo</span></span>
          <Icon name="chevronRight" />
        </Link>
      )}
      <Section title="Provenance">
        <dl className="pi-kv">
          <div><dt>Source</dt><dd>{e.source}</dd></div>
          <div><dt>Category</dt><dd>{e.sourceCategory}</dd></div>
          <div><dt>Type</dt><dd>{typeLabel[e.type]}</dd></div>
        </dl>
      </Section>
      <Section title="Confidence">
        <div className="pi-conf-box"><ConfidenceMeter level={e.confidence} /><p>{CONF_TEXT[e.confidence]}</p></div>
      </Section>
      <Section title="Why it matters"><p>{e.relevance}</p></Section>
      <Section title="Linked policy options">
        <div className="pi-opt-links">
          {e.linkedOptions.map((o) => {
            const opt = S.options.find((x) => x.id === o)!;
            return (
              <button key={o} type="button" className="pi-opt-link" onClick={() => nav.go({ view: 'brief', item: `opt-${o}` })}>
                <span className={`pi-opt-badge pi-opt-${o}`}>{o}</span><span>{opt.short}</span>
              </button>
            );
          })}
        </div>
      </Section>
      {related.length > 0 && (
        <Section title="Related questions">
          <ul className="pi-link-list">
            {related.map((q) => (
              <li key={q.id}><button type="button" onClick={() => nav.go({ view: 'dashboard', item: q.id })}><Icon name="message" /><span>{q.text}</span><Icon name="chevronRight" /></button></li>
            ))}
          </ul>
        </Section>
      )}
      {request && (
        <NewTaskModal heading="Request evidence" kind="evidence-request" status="awaiting" title={e.title} ownerId={e.suggestedOwnerId ?? 'moh'} description={e.summary} source="an evidence gap" onClose={() => setRequest(false)} />
      )}
    </Drawer>
  );
}

// --- Stakeholder --------------------------------------------------------------

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="pi-meter">
      <span className="pi-meter-label">{label}</span>
      <span className="pi-meter-track" aria-hidden="true"><i style={{ width: `${value * 10}%` }} /></span>
      <b className="pi-num">{value}/10</b>
    </div>
  );
}

function StakeholderDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const { state } = useDemo();
  const nav = useNav();
  const [task, setTask] = useState(false);
  const instId = id.slice(3);
  const inst = S.institutions.find((i) => i.id === instId);
  const p = S.stakeholderProfiles.find((x) => x.institutionId === instId);
  if (!inst || !p) return null;
  const rels = S.stakeholderLinks.filter((l) => l.from === instId || l.to === instId);
  const tasks = state.tasks.filter((t) => t.ownerId === instId);
  const qs = state.questions.filter((q) => q.ownerId === instId);
  return (
    <Drawer
      title={inst.name}
      onClose={onClose}
      eyebrow={<><i className={`pi-sector-dot pi-sector-${inst.sector}`} aria-hidden="true" />{S.sectors.find((s) => s.id === inst.sector)?.label}</>}
      meta={<><StanceBadge stance={p.stance} /><span className="pi-muted-xs">Position is illustrative</span></>}
      footer={<button type="button" className="pi-btn pi-btn-primary" onClick={() => setTask(true)}><Icon name="plus" />Create follow-up task</button>}
    >
      <Section title="Overview"><p>{p.summary}</p></Section>
      <Section title="Responsibilities"><ul className="pi-bullets">{p.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul></Section>
      <Section title="Position on the issue"><p>{p.position}</p></Section>
      <Section title="Interest and influence">
        <Meter label="Interest" value={p.interest} />
        <Meter label="Influence" value={p.influence} />
        <button type="button" className="pi-link-btn" onClick={() => nav.go({ view: 'stakeholders', item: id })} hidden={nav.view === 'stakeholders'}>Show on map <Icon name="arrowRight" /></button>
      </Section>
      <Section title="Levers"><div className="pi-tags">{p.levers.map((l) => <span key={l} className="pi-tag">{l}</span>)}</div></Section>
      <Section title={`Relationships (${rels.length})`}>
        <ul className="pi-link-list">
          {rels.map((l) => {
            const other = l.from === instId ? l.to : l.from;
            return (
              <li key={`${l.from}-${l.to}`}>
                <button type="button" onClick={() => nav.open(`sh-${other}`)}>
                  <Icon name="link" /><span><strong>{instName(other)}</strong><small>{l.label}</small></span><Icon name="chevronRight" />
                </button>
              </li>
            );
          })}
        </ul>
      </Section>
      {(tasks.length > 0 || qs.length > 0) && (
        <Section title="Open items">
          <ul className="pi-link-list">
            {qs.map((q) => <li key={q.id}><button type="button" onClick={() => nav.go({ view: 'dashboard', item: q.id })}><Icon name="message" /><span>{q.text}</span><Icon name="chevronRight" /></button></li>)}
            {tasks.map((t) => <li key={t.id}><button type="button" onClick={() => nav.go({ view: 'tracker', item: t.id })}><Icon name="tracker" /><span>{t.title}</span><StatusBadge status={t.status} /></button></li>)}
          </ul>
        </Section>
      )}
      {p.links.length > 0 && (
        <Section title="Links">
          <ul className="pi-link-list">
            {p.links.map((l) => {
              const params = new URLSearchParams(l.href.slice(1));
              return (
                <li key={l.href}>
                  <button type="button" onClick={() => nav.go({ view: (params.get('view') ?? 'dashboard') as 'dashboard', item: params.get('item') ?? undefined })}>
                    <Icon name="arrowRight" /><span>{l.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Section>
      )}
      {task && <NewTaskModal heading={`Follow up with ${inst.short}`} ownerId={instId} title={`Follow up with ${inst.short}`} status="awaiting" source="the stakeholder map" onClose={() => setTask(false)} />}
    </Drawer>
  );
}

// --- Task -------------------------------------------------------------------

function TaskDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const { state, dispatch } = useDemo();
  const toast = useToast();
  const now = useNow();
  const [note, setNote] = useState('');
  const sid = useId();
  const t = state.tasks.find((x) => x.id === id);
  if (!t) return null;
  const addNote = (e: FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    dispatch({ type: 'addNote', id: t.id, text: note.trim(), ...stamp() });
    setNote('');
    toast({ title: 'Note added', body: t.title, tone: 'info' });
  };
  const KIND = { task: 'Task', 'evidence-request': 'Evidence request', decision: 'Decision', milestone: 'Milestone' } as const;
  return (
    <Drawer
      title={t.title}
      onClose={onClose}
      eyebrow={<><Icon name="tracker" />{KIND[t.kind]} · {t.id.toUpperCase()}</>}
      meta={<><StatusBadge status={t.status} /><span className="pi-due"><Icon name="calendar" size={13} />Due {fmtDate(t.due)}</span></>}
      footer={t.status !== 'reviewed' ? (
        <button type="button" className="pi-btn pi-btn-primary" onClick={() => { dispatch({ type: 'moveTask', id: t.id, status: 'reviewed', ...stamp() }); toast({ title: 'Marked as reviewed', body: t.title }); }}>
          <Icon name="check" />Mark reviewed
        </button>
      ) : <span className="pi-muted-sm"><Icon name="check" /> Reviewed</span>}
    >
      <Section title="Description"><p>{t.description}</p></Section>
      <Section title="Details">
        <div className="pi-form-row">
          <div className="pi-field">
            <label htmlFor={`${sid}-s`}>Status</label>
            <select id={`${sid}-s`} className="pi-input" value={t.status} onChange={(e) => { const s = e.target.value as TaskStatus; dispatch({ type: 'moveTask', id: t.id, status: s, ...stamp() }); toast({ title: `Moved to ${statusLabel[s]}`, body: t.title, tone: 'info' }); }}>
              {(Object.keys(statusLabel) as TaskStatus[]).map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
            </select>
          </div>
          <div className="pi-field">
            <label htmlFor={`${sid}-o`}>Owner institution</label>
            <select id={`${sid}-o`} className="pi-input" value={t.ownerId} onChange={(e) => { dispatch({ type: 'assignTask', id: t.id, ownerId: e.target.value, ...stamp() }); toast({ title: `Assigned to ${instName(e.target.value)}`, body: t.title, tone: 'info' }); }}>
              {S.institutions.map((i) => <option key={i.id} value={i.id}>{i.short}</option>)}
            </select>
          </div>
        </div>
        <dl className="pi-kv">
          <div><dt>Start</dt><dd>{fmtDate(t.start)}</dd></div>
          <div><dt>Due</dt><dd>{fmtDate(t.due)}</dd></div>
        </dl>
      </Section>
      <Section title={`Notes (${t.notes.length})`}>
        {t.notes.length > 0 && (
          <ul className="pi-notes">
            {t.notes.map((n) => (
              <li key={n.id}>
                <span className={`pi-feed-avatar${n.author === 'You' ? ' is-me' : ''}`} aria-hidden="true">{n.author === 'You' ? S.DEMO_USER.initials : initials(n.author)}</span>
                <div><div className="pi-note-head"><strong>{n.author}</strong><time dateTime={n.at}>{relTime(n.at, now)}</time></div><p>{n.text}</p></div>
              </li>
            ))}
          </ul>
        )}
        <form className="pi-note-form" onSubmit={addNote}>
          <label htmlFor={`${sid}-n`} className="pi-sr">Add a note</label>
          <textarea id={`${sid}-n`} className="pi-input" rows={2} placeholder="Add a note…" value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addNote(e); }} />
          <button type="submit" className="pi-btn pi-btn-sm" disabled={!note.trim()}>Add note</button>
        </form>
      </Section>
      <Section title="History">
        <ol className="pi-history">
          {t.history.slice().reverse().map((h, i) => <li key={i}><span>{h.text}</span><time dateTime={h.at}>{fmtDateTime(h.at)}</time></li>)}
        </ol>
      </Section>
    </Drawer>
  );
}

// --- Option -----------------------------------------------------------------

function OptionDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const { state } = useDemo();
  const [rec, setRec] = useState(false);
  const o = S.options.find((x) => `opt-${x.id}` === id);
  if (!o) return null;
  const r = rankOptions(state.weights).find((x) => x.option.id === o.id)!;
  return (
    <Drawer
      title={o.title}
      onClose={onClose}
      eyebrow={<><span className={`pi-opt-badge pi-opt-${o.id}`}>{o.id}</span>Policy option</>}
      meta={<><span className="pi-tag">Score {r.score}</span><span className="pi-tag">Rank #{r.rank}</span>{state.decision?.optionId === o.id && <span className="pi-status pi-status-reviewed"><i aria-hidden="true" />Recommended</span>}</>}
      footer={<button type="button" className="pi-btn pi-btn-primary" onClick={() => setRec(true)}><Icon name="flag" />Recommend this option</button>}
    >
      <Section title="Mechanism"><p>{o.mechanism}</p></Section>
      <dl className="pi-kv pi-kv-boxed">
        <div><dt>Indicative cost</dt><dd className="pi-num">{o.costIndicative}</dd></div>
        <div><dt>Timeline</dt><dd>{o.timeline}</dd></div>
      </dl>
      <Section title="Criteria scores">
        {S.criteria.map((c) => <Meter key={c.id} label={c.label} value={o.scores[c.id] * 2} />)}
        <p className="pi-muted-xs">Shown on a 10-point scale (score × 2). Weighted score uses your current weights.</p>
      </Section>
      <Section title="Advantages"><ul className="pi-bullets">{o.advantages.map((x) => <li key={x}>{x}</li>)}</ul></Section>
      <Section title="Trade-offs"><ul className="pi-bullets">{o.tradeoffs.map((x) => <li key={x}>{x}</li>)}</ul></Section>
      <Section title="Risks"><ul className="pi-bullets pi-bullets-risk">{o.risks.map((x) => <li key={x}>{x}</li>)}</ul></Section>
      <Section title="Legal basis"><p>{o.legalBasis}</p></Section>
      <Section title="Supporting evidence"><EvidenceLinks ids={o.evidence} /></Section>
      {rec && <RecommendModal initial={o.id as OptionId} onClose={() => setRec(false)} />}
    </Drawer>
  );
}

export function DetailDrawer({ item }: { item: string }) {
  const nav = useNav();
  const close = () => nav.close();
  if (item.startsWith('q-')) return <QuestionDrawer key={item} id={item} onClose={close} />;
  if (item.startsWith('ev-')) return <EvidenceDrawer key={item} id={item} onClose={close} />;
  if (item.startsWith('sh-')) return <StakeholderDrawer key={item} id={item} onClose={close} />;
  if (item.startsWith('t-')) return <TaskDrawer key={item} id={item} onClose={close} />;
  if (item.startsWith('opt-')) return <OptionDrawer key={item} id={item} onClose={close} />;
  return null;
}
