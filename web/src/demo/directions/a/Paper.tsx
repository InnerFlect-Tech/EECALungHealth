// Direction A building blocks: numbered sections and paragraphs, in-text
// callouts, tracked changes, and the live margin (notes and change balloons).

import { useState, type ReactNode } from 'react';
import { evidence, institutions, questions, tasks } from '../../kazakhstanScenario';
import { CHANGES, STATUS_LABEL, cx, fmtDate, fmtTime, instShort, refOf, usePaper } from './model';

// ---------------------------------------------------------------------------
// Layout

export function Section({ num, id, title, children }: { num: string; id: string; title: string; children: ReactNode }) {
  return (
    <section className="da-section" aria-labelledby={id}>
      <div className="da-row da-row--head">
        <span className="da-pnum da-snum" aria-hidden="true">{num}</span>
        <h2 id={id} className="da-h2">
          <span className="da-visually-hidden">{num} </span>
          {title}
        </h2>
        <div className="da-margin" />
      </div>
      {children}
    </section>
  );
}

export function Para({
  num,
  notes = [],
  changes = [],
  wide,
  children,
}: {
  num: string;
  notes?: string[];
  changes?: string[];
  wide?: boolean;
  children: ReactNode;
}) {
  const { s } = usePaper();
  const pending = changes.filter((c) => s.changes[c] === 'pending');
  const marked = s.showChanges && pending.length > 0;
  const hasMargin = notes.length > 0 || marked;
  return (
    <div className={cx('da-row', wide && 'da-row--wide', marked && 'is-changed')} id={`da-p-${num}`}>
      <span className="da-pnum">{num}</span>
      <div className="da-ptext">{children}</div>
      <aside className={cx('da-margin', hasMargin && 'has-notes')} aria-label={hasMargin ? `Margin notes for paragraph ${num}` : undefined}>
        {marked && pending.map((c) => <Balloon key={c} id={c} />)}
        {notes.map((n) => <Note key={n} id={n} />)}
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
// In-text callout: a small reference (Q1, E10, T5) that opens its margin note.

export function Cite({ id }: { id: string }) {
  const { s, toggleNote, setHot } = usePaper();
  const open = !!s.open[id];
  return (
    <button
      type="button"
      className={cx('da-call', open && 'is-open', s.hot === id && 'is-hot')}
      aria-expanded={open}
      aria-controls={`da-note-${id}`}
      aria-label={`${refOf(id)}: ${open ? 'close' : 'open'} margin note`}
      onClick={() => toggleNote(id)}
      onMouseEnter={() => setHot(id)}
      onMouseLeave={() => setHot(null)}
      onFocus={() => setHot(id)}
      onBlur={() => setHot(null)}
    >
      {refOf(id)}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Tracked change in the running text.

export function Chg({ id }: { id: string }) {
  const { s, setHot } = usePaper();
  const c = CHANGES[id];
  const st = s.changes[id];
  if (st === 'accepted' || (st === 'pending' && !s.showChanges)) return <>{c.ins ?? ''}</>;
  if (st === 'rejected') return <>{c.del ?? ''}</>;
  const who = instShort(c.by);
  const what = c.del && c.ins ? 'Replacement' : c.ins ? 'Insertion' : 'Deletion';
  return (
    <span
      className={cx('da-chg', s.hot === id && 'is-hot')}
      tabIndex={0}
      aria-label={`${what} by ${who}, ${fmtDate(c.at)} ${fmtTime(c.at)}. Accept or reject in the margin.`}
      aria-describedby={`da-bal-${id}`}
      onMouseEnter={() => setHot(id)}
      onMouseLeave={() => setHot(null)}
      onFocus={() => setHot(id)}
      onBlur={() => setHot(null)}
    >
      {c.del && <del className="da-del" dateTime={c.at}>{c.del}</del>}
      {c.ins && <ins className="da-ins" dateTime={c.at}>{c.ins}</ins>}
    </span>
  );
}

function Balloon({ id }: { id: string }) {
  const { s, setHot, resolveChange } = usePaper();
  const c = CHANGES[id];
  const what = c.del && c.ins ? 'Replaced' : c.ins ? 'Inserted' : 'Deleted';
  return (
    <div
      id={`da-bal-${id}`}
      className={cx('da-bal', s.hot === id && 'is-hot')}
      onMouseEnter={() => setHot(id)}
      onMouseLeave={() => setHot(null)}
    >
      <p className="da-bal-head">
        <span className="da-sc da-acc">{what}</span>
        <span className="da-bal-who">{instShort(c.by)}</span>
        <time className="da-mono da-bal-at" dateTime={c.at}>
          {fmtDate(c.at, { year: false })}, {fmtTime(c.at)}
        </time>
      </p>
      <p className="da-bal-quote">“{(c.ins ?? c.del ?? '').replace(/^[ ,]+/, '')}”</p>
      <div className="da-bal-actions" role="group" aria-label={`${what} by ${instShort(c.by)}`}>
        <button type="button" className="da-act da-act--primary" onClick={() => resolveChange(id, 'accepted')}>
          Accept
        </button>
        <button type="button" className="da-act" onClick={() => resolveChange(id, 'rejected')}>
          Reject
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Margin note: question, evidence (or gap), or action. Expands in place.

export function Note({ id }: { id: string }) {
  const api = usePaper();
  const { s, toggleNote, setHot } = api;
  const open = !!s.open[id];
  const [assigning, setAssigning] = useState(false);

  let kind = '';
  let title = '';
  let meta: ReactNode = null;
  let body: ReactNode = null;
  let actions: ReactNode = null;
  let settled = false;

  if (id.startsWith('q-')) {
    const q = questions.find((x) => x.id === id)!;
    const answered = s.qStatus[id] === 'answered';
    settled = answered;
    kind = answered ? 'Answered' : 'Open question';
    meta = (
      <>
        {instShort(s.qOwner[id])} · due {fmtDate(q.due, { year: false })}
        {!answered && ` · ${q.priority} priority`}
      </>
    );
    body = (
      <>
        <p className="da-note-links">
          <span className="da-sc">Evidence</span>{' '}
          {q.linkedEvidence.map((e) => (
            <a key={e} href={`#da-note-${e}`} className="da-mono da-xref" onClick={(ev) => { ev.preventDefault(); api.jumpTo(e); }}>
              {refOf(e)}
            </a>
          ))}
        </p>
        <p className="da-note-dim">Raised {fmtDate(q.raised)}</p>
      </>
    );
    actions = (
      <>
        <button type="button" className="da-act da-act--primary" onClick={() => api.setQuestion(id, answered ? 'open' : 'answered')}>
          {answered ? 'Reopen' : 'Mark answered'}
        </button>
        <button type="button" className="da-act" aria-expanded={assigning} onClick={() => setAssigning((v) => !v)}>
          Assign
        </button>
      </>
    );
  } else if (id.startsWith('ev-')) {
    const e = evidence.find((x) => x.id === id)!;
    const gap = e.type === 'gap';
    const requested = !!s.requested[id];
    settled = gap && requested;
    kind = gap ? (requested ? 'Gap · requested' : 'Evidence gap') : '';
    title = e.title;
    meta = gap ? (
      <>Held by {instShort(e.suggestedOwnerId ?? 'moh')}</>
    ) : (
      <>
        {e.sourceCategory} · {e.confidence} confidence
      </>
    );
    body = (
      <>
        <p>{e.summary}</p>
        <ul className="da-findings">
          {e.keyFindings.map((k) => (
            <li key={k}>{k}</li>
          ))}
        </ul>
        <p className="da-note-dim">
          {e.source} · filed {fmtDate(e.date)}
        </p>
        {e.link && (
          <p>
            <a className="da-link" href={e.link.href}>{e.link.label} ↗</a>
          </p>
        )}
      </>
    );
    actions = gap ? (
      <button type="button" className="da-act da-act--primary" disabled={requested} onClick={() => api.requestGap(id)}>
        {requested ? `Requested from ${instShort(e.suggestedOwnerId ?? 'moh')}` : `Request from ${instShort(e.suggestedOwnerId ?? 'moh')}`}
      </button>
    ) : (
      <button type="button" className="da-act" aria-pressed={!!s.inBrief[id]} onClick={() => api.toggleBrief(id)}>
        {s.inBrief[id] ? 'In members’ brief ✓' : 'Add to members’ brief'}
      </button>
    );
  } else if (id.startsWith('t-')) {
    const t = tasks.find((x) => x.id === id)!;
    const status = s.tStatus[id];
    settled = status === 'reviewed';
    kind = `Action · ${STATUS_LABEL[status]}`;
    title = t.title;
    meta = (
      <>
        {instShort(s.tOwner[id])} · due {fmtDate(t.due, { year: false })}
      </>
    );
    const last = t.history[t.history.length - 1];
    body = (
      <>
        <p>{t.description}</p>
        <p className="da-note-dim">
          <span className="da-mono">{fmtDate(last.at, { year: false })}</span> {last.text}
        </p>
      </>
    );
    actions = (
      <>
        <button type="button" className="da-act da-act--primary" onClick={() => api.setTask(id, settled ? 'in-progress' : 'reviewed')}>
          {settled ? 'Reopen' : 'Mark done'}
        </button>
        <button type="button" className="da-act" aria-expanded={assigning} onClick={() => setAssigning((v) => !v)}>
          Assign
        </button>
      </>
    );
  }

  const owner = id.startsWith('q-') ? s.qOwner[id] : s.tOwner[id];

  return (
    <div
      id={`da-note-${id}`}
      className={cx('da-note', open && 'is-open', settled && 'is-settled', s.hot === id && 'is-hot')}
      onMouseEnter={() => setHot(id)}
      onMouseLeave={() => setHot(null)}
    >
      <button
        type="button"
        className="da-note-head"
        aria-expanded={open}
        aria-controls={`da-note-body-${id}`}
        onClick={() => toggleNote(id)}
      >
        <span className="da-note-ref da-mono">{refOf(id)}</span>
        <span className="da-note-kind da-sc">{kind}</span>
        <span className="da-note-title">{title}</span>
        <span className="da-note-meta">{meta}</span>
      </button>
      {open && (
        <div className="da-note-body" id={`da-note-body-${id}`}>
          {body}
          <div className="da-note-actions">{actions}</div>
          {assigning && (
            <label className="da-assign">
              <span className="da-sc">Assign to</span>
              <select
                value={owner}
                onChange={(ev) => {
                  if (id.startsWith('q-')) api.assignQuestion(id, ev.target.value);
                  else api.assignTask(id, ev.target.value);
                  setAssigning(false);
                }}
              >
                {institutions.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.short}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}
    </div>
  );
}
