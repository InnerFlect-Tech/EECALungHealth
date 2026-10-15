import type { ReactNode } from 'react';
import { evidence, options, questions, tasks } from '../../kazakhstanScenario';
import { Mark, Stamp } from './marks';
import {
  KIND_LABEL,
  TODAY,
  itemRef,
  optionRef,
  papersOf,
  refOf,
  sittings,
  type AgendaItem,
  type Sitting,
  type StampKind,
} from './sittings';
import { daysFromToday, fmtDate, fmtLong, instName, instShort, plural } from './format';

/** Paper reference → every agenda item (CS-04/3 …) it appears on, in calendar order. */
const TRAIL = new Map<string, string[]>();
for (const s of sittings) {
  s.items.forEach((it, i) => {
    for (const p of papersOf(it)) TRAIL.set(p, [...(TRAIL.get(p) ?? []), itemRef(s, i + 1)]);
  });
}

const awaitedBy = (it: AgendaItem) => it.awaitingId ?? it.ownerId;

function matchesFilter(it: AgendaItem, filter: string | null) {
  if (!filter) return true;
  if (filter === 'ready' || filter === 'blocked') return it.readiness === filter;
  if (filter.startsWith('awaiting:')) return it.readiness === 'awaiting' && awaitedBy(it) === filter.slice(9);
  if (filter.startsWith('stamp:')) return it.stamp === filter.slice(6);
  return true;
}

interface Props {
  sitting: Sitting;
  index: number;
  filter: string | null;
  onFilter: (f: string | null) => void;
  expanded: Set<string>;
  onToggle: (key: string) => void;
  onJump: (ref: string) => void;
}

export function Agenda({ sitting, index, filter, onFilter, expanded, onToggle, onJump }: Props) {
  const past = sitting.date < TODAY;
  const firstFuture = sittings.findIndex((s) => s.date >= TODAY);
  const days = daysFromToday(sitting.date);
  const deadline = sitting.kind === 'budget' || sitting.kind === 'decision';
  const shown = sitting.items.map((it, i) => ({ it, n: i + 1 })).filter(({ it }) => matchesFilter(it, filter));

  const eyebrow = past
    ? `Held · ${plural(-days, 'day')} ago`
    : index === firstFuture
      ? `Before the next sitting · in ${plural(days, 'day')}`
      : `${deadline ? 'Forthcoming deadline' : 'Forthcoming'} · in ${plural(days, 'day')}`;

  return (
    <section
      className="db-agenda"
      id="db-agenda"
      role="tabpanel"
      aria-labelledby={`db-tab-${sitting.ref}`}
      tabIndex={-1}
    >
      <header className="db-agenda-head">
        <p className="db-eyebrow">{eyebrow}</p>
        <div className="db-agenda-titlerow">
          <h2 className="db-agenda-title">{deadline ? 'Business due' : past ? 'Business taken' : 'Order of business'}</h2>
          <span className="db-ref db-ref--big">{sitting.ref}</span>
        </div>
        <p className="db-agenda-meta">
          <strong>{KIND_LABEL[sitting.kind]}</strong>
          <span>{fmtLong(sitting.date)} at {sitting.time}</span>
          <span>{sitting.place}</span>
        </p>
      </header>

      <Gauge sitting={sitting} past={past} filter={filter} onFilter={onFilter} onJump={onJump} />

      {filter && (
        <p className="db-filtered" role="status">
          Showing {shown.length} of {plural(sitting.items.length, 'item')}. Numbering is that of the order paper.
          <button type="button" className="db-textbtn" onClick={() => onFilter(null)}>Show all items</button>
        </p>
      )}

      <ol className="db-items">
        {shown.map(({ it, n }) => (
          <Item
            key={itemRef(sitting, n)}
            sitting={sitting}
            item={it}
            n={n}
            past={past}
            open={expanded.has(itemRef(sitting, n))}
            onToggle={onToggle}
            onJump={onJump}
          />
        ))}
      </ol>
      <p className="db-endrule" aria-hidden="true">— End of business —</p>
    </section>
  );
}

// ---------------------------------------------------------------------------

function Gauge({ sitting, past, filter, onFilter, onJump }: { sitting: Sitting; past: boolean; filter: string | null; onFilter: (f: string | null) => void; onJump: (ref: string) => void }) {
  const items = sitting.items;
  const toggle = (f: string) => onFilter(filter === f ? null : f);

  type Part = { key: string; count: number; label: string; tone?: 'blocked' | 'muted' };
  const parts: Part[] = [];
  let lead: Part;

  if (past) {
    lead = { key: '', count: items.length, label: `${items.length === 1 ? 'item' : 'items'} taken` };
    const order: StampKind[] = ['AGREED', 'RECEIVED', 'LAID', 'DEFERRED'];
    for (const k of order) {
      const c = items.filter((it) => it.stamp === k).length;
      if (c) parts.push({ key: `stamp:${k}`, count: c, label: k.toLowerCase(), tone: k === 'DEFERRED' ? 'muted' : undefined });
    }
  } else {
    const ready = items.filter((it) => it.readiness === 'ready').length;
    lead = { key: 'ready', count: ready, label: `of ${plural(items.length, 'item')} ready` };
    const awaiting = new Map<string, number>();
    for (const it of items) if (it.readiness === 'awaiting') awaiting.set(awaitedBy(it), (awaiting.get(awaitedBy(it)) ?? 0) + 1);
    for (const [id, c] of awaiting) parts.push({ key: `awaiting:${id}`, count: c, label: `awaiting ${instShort(id)}`, tone: 'muted' });
    const blocked = items.filter((it) => it.readiness === 'blocked').length;
    if (blocked) parts.push({ key: 'blocked', count: blocked, label: 'blocked', tone: 'blocked' });
  }

  return (
    <div className="db-gauge">
      <h3 className="db-label">{past ? 'Disposal of business' : 'Readiness'}</h3>
      <p className="db-gauge-line">
        {lead.key ? (
          <button type="button" className="db-gauge-part db-gauge-part--lead" aria-pressed={filter === lead.key} onClick={() => toggle(lead.key)}>
            <b>{lead.count}</b> {lead.label}
          </button>
        ) : (
          <span className="db-gauge-part db-gauge-part--lead db-gauge-part--static"><b>{lead.count}</b> {lead.label}</span>
        )}
        {parts.map((p) => (
          <span key={p.key} className="db-gauge-seg">
            <span className="db-gauge-sep" aria-hidden="true">·</span>
            <button
              type="button"
              className={`db-gauge-part${p.tone ? ` db-gauge-part--${p.tone}` : ''}`}
              aria-pressed={filter === p.key}
              onClick={() => toggle(p.key)}
            >
              <b>{p.count}</b> {p.label}
            </button>
          </span>
        ))}
      </p>
      <ol className="db-tally" aria-label="Items by readiness">
        {items.map((it, i) => {
          const r = itemRef(sitting, i + 1);
          const state = past ? (it.stamp ?? 'held').toLowerCase() : it.readiness === 'awaiting' ? `awaiting ${instShort(awaitedBy(it))}` : it.readiness;
          return (
            <li key={r}>
              <button
                type="button"
                className={`db-tally-n db-tally-n--${past ? 'held' : it.readiness}${matchesFilter(it, filter) ? '' : ' db-tally-n--out'}`}
                onClick={() => onJump(r)}
                aria-label={`Item ${i + 1}, ${state}. Go to item.`}
                title={`${r} · ${state}`}
              >
                <Mark state={it.readiness} held={past} />
                <span>{i + 1}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ---------------------------------------------------------------------------

function Item({ sitting, item, n, past, open, onToggle, onJump }: { sitting: Sitting; item: AgendaItem; n: number; past: boolean; open: boolean; onToggle: (k: string) => void; onJump: (ref: string) => void }) {
  const ref = itemRef(sitting, n);
  const bodyId = `db-body-${sitting.ref}-${n}`;
  const counts = [
    item.questions?.length && plural(item.questions.length, 'question'),
    item.evidence?.length && `${item.evidence.length} evidence`,
    item.tasks?.length && plural(item.tasks.length, 'task'),
    item.options?.length && plural(item.options.length, 'option'),
  ].filter(Boolean);

  const readiness = past ? (
    <span className="db-ready db-ready--held">Taken</span>
  ) : item.readiness === 'ready' ? (
    <span className="db-ready db-ready--ready"><Mark state="ready" />Ready</span>
  ) : item.readiness === 'blocked' ? (
    <span className="db-ready db-ready--blocked"><Mark state="blocked" />Blocked</span>
  ) : (
    <span className="db-ready db-ready--awaiting"><Mark state="awaiting" />Awaiting<span className="db-ready-who">{instShort(awaitedBy(item))}</span></span>
  );

  return (
    <li className={`db-item db-item--${past ? 'held' : item.readiness}${open ? ' db-item--open' : ''}`} data-item={ref}>
      <h3 className="db-item-h">
        <button type="button" className="db-item-btn" aria-expanded={open} aria-controls={bodyId} onClick={() => onToggle(ref)}>
          <span className="db-item-num">{n}.</span>
          <span className="db-item-main">
            <span className="db-item-title">
              {item.title}
              {item.rubric && <span className="db-item-rubric"> — {item.rubric}</span>}
            </span>
            <span className="db-item-meta">
              <span className="db-ref">{ref}</span>
              <span>{instShort(item.ownerId)}</span>
              {counts.length > 0 && <span>{counts.join(' · ')}</span>}
            </span>
          </span>
          <span className="db-item-side">
            {item.stamp && <Stamp kind={item.stamp} tilt={n % 2 ? -1.5 : 1} />}
            {readiness}
          </span>
          <span className="db-item-chev" aria-hidden="true" />
        </button>
      </h3>
      <div className="db-item-body" id={bodyId} hidden={!open}>
        <p className="db-note"><span className="db-label">Clerk’s note</span>{item.note}</p>
        <p className="db-resp"><span className="db-label">Responsible</span>{instName(item.ownerId)}</p>
        {item.questions && item.questions.length > 0 && (
          <PaperGroup title="Questions">
            {item.questions.map((id) => {
              const q = questions.find((x) => x.id === id);
              if (!q) return null;
              return (
                <Paper key={id} ref_={refOf(id)} here={ref} onJump={onJump}
                  title={q.text}
                  sub={q.answer ?? q.context}
                  meta={[instShort(q.ownerId), `raised ${fmtDate(q.raised)}`, q.status === 'answered' ? 'answered' : `answer due ${fmtDate(q.due)}`, `${q.priority} priority`]}
                  stamp={q.status === 'answered' ? 'ANSWERED' : undefined}
                />
              );
            })}
          </PaperGroup>
        )}
        {item.evidence && item.evidence.length > 0 && (
          <PaperGroup title="Evidence">
            {item.evidence.map((id) => {
              const e = evidence.find((x) => x.id === id);
              if (!e) return null;
              const gap = e.type === 'gap';
              return (
                <Paper key={id} ref_={refOf(id)} here={ref} onJump={onJump}
                  title={e.title}
                  sub={e.summary}
                  meta={gap
                    ? ['Evidence gap', `normally held by ${instShort(e.suggestedOwnerId ?? '')}`, `noted ${fmtDate(e.date)}`]
                    : [e.source, `${e.confidence} confidence`, `received ${fmtDate(e.date)}`]}
                  stamp={gap ? undefined : e.inBrief ? 'LAID' : 'RECEIVED'}
                  gap={gap}
                />
              );
            })}
          </PaperGroup>
        )}
        {item.tasks && item.tasks.length > 0 && (
          <PaperGroup title="Tasks">
            {item.tasks.map((id) => {
              const t = tasks.find((x) => x.id === id);
              if (!t) return null;
              const status = { reviewed: 'reviewed', 'in-progress': 'in progress', awaiting: 'awaiting action', blocked: 'blocked' }[t.status];
              return (
                <Paper key={id} ref_={refOf(id)} here={ref} onJump={onJump}
                  title={t.title}
                  sub={t.description}
                  meta={[instShort(t.ownerId), status, `due ${fmtDate(t.due)}`]}
                  stamp={t.status === 'reviewed' ? 'AGREED' : t.status === 'blocked' ? 'BLOCKED' : undefined}
                />
              );
            })}
          </PaperGroup>
        )}
        {item.options && item.options.length > 0 && (
          <PaperGroup title="Options">
            {item.options.map((id) => {
              const o = options.find((x) => x.id === id);
              if (!o) return null;
              return (
                <Paper key={id} ref_={optionRef(id)} here={ref} onJump={onJump}
                  title={`${o.short}: ${o.title}`}
                  sub={o.mechanism}
                  meta={[o.costIndicative, o.timeline, o.legalBasis]}
                />
              );
            })}
          </PaperGroup>
        )}
      </div>
    </li>
  );
}

function PaperGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="db-papers">
      <h4 className="db-label">{title}</h4>
      <ul>{children}</ul>
    </div>
  );
}

function Paper({ ref_, here, title, sub, meta, stamp, gap, onJump }: { ref_: string; here: string; title: string; sub: string; meta: string[]; stamp?: StampKind; gap?: boolean; onJump: (ref: string) => void }) {
  const trail = (TRAIL.get(ref_) ?? []).filter((r) => r !== here);
  return (
    <li className={`db-paper${gap ? ' db-paper--gap' : ''}`} data-ref={ref_}>
      <span className="db-ref db-paper-ref">{ref_}</span>
      <div className="db-paper-body">
        <p className="db-paper-title">{title}</p>
        <p className="db-paper-sub">{sub}</p>
        <p className="db-paper-meta">{meta.filter(Boolean).join(' · ')}</p>
        {trail.length > 0 && (
          <p className="db-trail">
            <span>Also on the order paper at</span>
            {trail.map((r) => (
              <button key={r} type="button" className="db-ref db-reflink" onClick={() => onJump(r)}>{r}</button>
            ))}
          </p>
        )}
      </div>
      {stamp ? <Stamp kind={stamp} /> : <span />}
    </li>
  );
}
