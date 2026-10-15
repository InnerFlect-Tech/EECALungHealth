import { useState } from 'react';
import { assigneeOptions } from '../../careContinuityScenario';
import { BarList, LineChart } from '../charts';
import { Icon } from '../icons';
import { TYPE_LABEL, agoLabel, districtLabel } from '../model';
import { Drawer, Modal } from '../overlay';
import { useNav } from '../nav';
import { useDemo, useToast } from '../store';
import { AlertStatusBadge, Field, SeverityBadge, Tag } from '../ui';

export function AlertDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const { getAlert, updateAlert, addAlertComment, toggleAlertAction } = useDemo();
  const { go } = useNav();
  const toast = useToast();
  const a = getAlert(id)!;
  const [modal, setModal] = useState<'assign' | 'resolve' | null>(null);
  const [comment, setComment] = useState('');
  const s = a.signal;
  const vals = [...s.values, s.threshold];
  const lo = Math.floor(Math.min(...vals) * 0.85);
  const hi = Math.ceil(Math.max(...vals) * 1.12);
  const span = hi - lo;
  const stepRaw = span / 4;
  const step = stepRaw <= 1 ? 1 : stepRaw <= 2 ? 2 : stepRaw <= 5 ? 5 : 10;
  const ticks: number[] = [];
  for (let t = Math.ceil(lo / step) * step; t <= hi; t += step) ticks.push(t);
  const resolved = a.status === 'resolved';

  return (
    <Drawer
      itemKey={id}
      eyebrow={<span>{a.id.toUpperCase()} · {TYPE_LABEL[a.type]} · detected {agoLabel(a.detectedDaysAgo).toLowerCase()}</span>}
      title={a.title}
      meta={<><SeverityBadge severity={a.severity} /><AlertStatusBadge status={a.status} /><Tag icon="user">{a.assignee ?? 'Unassigned'}</Tag></>}
      onClose={onClose}
      footer={resolved ? (
        <button type="button" className="cc-btn" onClick={() => { updateAlert(id, { status: 'acknowledged' }, { author: 'Programme coordinator (you)', text: 'Reopened.' }); toast(`${a.id.toUpperCase()} reopened`, 'info'); }}>
          <Icon name="reset" size={15} /> Reopen
        </button>
      ) : (
        <>
          <button
            type="button"
            className="cc-btn"
            disabled={a.status !== 'new'}
            onClick={() => { updateAlert(id, { status: 'acknowledged' }, { author: 'Programme coordinator (you)', text: 'Acknowledged.' }); toast(`${a.id.toUpperCase()} acknowledged`); }}
          >
            <Icon name="check" size={15} /> {a.status === 'new' ? 'Acknowledge' : 'Acknowledged'}
          </button>
          <button type="button" className="cc-btn" onClick={() => setModal('assign')}><Icon name="user" size={15} /> Assign</button>
          <button type="button" className="cc-btn cc-btn-primary" onClick={() => setModal('resolve')}><Icon name="check" size={15} /> Resolve</button>
        </>
      )}
    >
      <p className="cc-drawer-lead">{a.summary}</p>
      <div className="cc-scope-row">
        <Icon name="pin" size={14} />
        {a.districtIds.length ? a.districtIds.map((d, i) => (
          <span key={d}>
            {i > 0 && ', '}
            <button type="button" className="cc-link-btn" onClick={() => go('regions', { item: d })}>{districtLabel(d)}</button>
          </span>
        )) : <span>{a.scope}</span>}
      </div>

      <h3 className="cc-h3">Signal <span className="cc-muted-inline">· {s.label.toLowerCase()}</span></h3>
      <LineChart
        labels={s.points}
        series={[{ id: 'sig', name: s.label, values: s.values, color: a.severity === 'high' ? 'var(--cc-high)' : a.severity === 'medium' ? 'var(--cc-med)' : 'var(--cc-low)', area: true }]}
        min={lo} max={hi} ticks={ticks} height={190}
        format={(v) => `${Number.isInteger(v) ? v : v.toFixed(1)}${s.unit}`}
        threshold={{ value: s.threshold, label: `Threshold ${s.threshold}${s.unit}` }}
        ariaLabel={`${s.label}: from ${s.values[0]}${s.unit} to ${s.values[s.values.length - 1]}${s.unit}; threshold ${s.threshold}${s.unit}.`}
        legend={false}
      />

      <h3 className="cc-h3">Affected cohort <span className="cc-muted-inline">· aggregated</span></h3>
      <div className="cc-affected">
        <div className="cc-affected-num"><strong className="cc-num">{a.affected.people}</strong><span>people</span></div>
        <p>{a.affected.note}.</p>
      </div>
      <BarList items={a.affected.breakdown.map((b) => ({ id: b.label, label: b.label, value: b.value, color: 'var(--cc-accent-2)' }))} format={(v) => `${v}`} />
      <p className="cc-fine">Counts only. Individual records stay in the caseload and are not shown in alerts.</p>

      <h3 className="cc-h3">Suggested actions <span className="cc-muted-inline">· suggested owner: {a.suggestedOwner}</span></h3>
      <ul className="cc-checklist">
        {a.actions.map((t, i) => {
          const done = a.actionsDone.includes(i);
          return (
            <li key={t}>
              <label className={done ? 'is-done' : ''}>
                <input type="checkbox" checked={done} onChange={() => toggleAlertAction(id, i)} />
                <span>{t}</span>
              </label>
            </li>
          );
        })}
      </ul>

      <h3 className="cc-h3">Discussion <span className="cc-count">{a.comments.length}</span></h3>
      <ol className="cc-comments">
        {a.comments.map((c) => (
          <li key={c.id}>
            <span className="cc-avatar cc-avatar-sm" aria-hidden="true">{c.author.split(' ').map((w) => w[0]).slice(0, 2).join('')}</span>
            <div>
              <div className="cc-comment-top"><strong>{c.author}</strong><span>{c.ago}</span></div>
              <p>{c.text}</p>
            </div>
          </li>
        ))}
        {a.comments.length === 0 && <li className="cc-comments-empty">No comments yet.</li>}
      </ol>
      <form
        className="cc-comment-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!comment.trim()) return;
          addAlertComment(id, comment.trim());
          setComment('');
          toast('Comment added');
        }}
      >
        <label htmlFor={`cm-${id}`} className="cc-sr">Add a comment</label>
        <textarea id={`cm-${id}`} rows={2} placeholder="Add a comment… (synthetic, visible to the team)" value={comment} onChange={(e) => setComment(e.target.value)} />
        <button type="submit" className="cc-btn cc-btn-sm" disabled={!comment.trim()}>Comment</button>
      </form>

      {modal === 'assign' && (
        <AssignModal
          current={a.assignee ?? a.suggestedOwner}
          onClose={() => setModal(null)}
          onSave={(who, note) => {
            updateAlert(id, { status: 'assigned', assignee: who }, { author: 'Programme coordinator (you)', text: `Assigned to ${who}.${note ? ` ${note}` : ''}` });
            setModal(null);
            toast(`${a.id.toUpperCase()} assigned to ${who}`);
          }}
        />
      )}
      {modal === 'resolve' && (
        <ResolveModal
          onClose={() => setModal(null)}
          onSave={(how, note) => {
            updateAlert(id, { status: 'resolved' }, { author: 'Programme coordinator (you)', text: `Resolved: ${how}.${note ? ` ${note}` : ''}` });
            setModal(null);
            toast(`${a.id.toUpperCase()} resolved`);
          }}
        />
      )}
    </Drawer>
  );
}

function AssignModal({ current, onClose, onSave }: { current: string; onClose: () => void; onSave: (who: string, note: string) => void }) {
  const [who, setWho] = useState(assigneeOptions.includes(current) ? current : assigneeOptions[0]);
  const [note, setNote] = useState('');
  return (
    <Modal
      title="Assign alert"
      description="The assignee owns the next step and gets a notification."
      onClose={onClose}
      footer={<><button type="button" className="cc-btn" onClick={onClose}>Cancel</button><button type="submit" form="cc-assign-form" className="cc-btn cc-btn-primary">Assign</button></>}
    >
      <form id="cc-assign-form" className="cc-form" onSubmit={(e) => { e.preventDefault(); onSave(who, note.trim()); }}>
        <fieldset className="cc-radio-list">
          <legend>Assign to (role)</legend>
          {assigneeOptions.map((o, i) => (
            <label key={o} className={who === o ? 'is-on' : ''}>
              <input type="radio" name="assignee" checked={who === o} onChange={() => setWho(o)} data-autofocus={i === 0 ? true : undefined} />
              <span>{o}</span>
            </label>
          ))}
        </fieldset>
        <Field label="Note (optional)">
          <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Please call the dispensary today." />
        </Field>
      </form>
    </Modal>
  );
}

function ResolveModal({ onClose, onSave }: { onClose: () => void; onSave: (how: string, note: string) => void }) {
  const [how, setHow] = useState('Action taken');
  const [note, setNote] = useState('');
  return (
    <Modal
      title="Resolve alert"
      description="Resolved alerts leave the open queue and count towards the quarterly report."
      onClose={onClose}
      footer={<><button type="button" className="cc-btn" onClick={onClose}>Cancel</button><button type="submit" form="cc-resolve-form" className="cc-btn cc-btn-primary">Resolve</button></>}
    >
      <form id="cc-resolve-form" className="cc-form" onSubmit={(e) => { e.preventDefault(); onSave(how.toLowerCase(), note.trim()); }}>
        <Field label="Resolution">
          <select value={how} onChange={(e) => setHow(e.target.value)} data-autofocus>
            {['Action taken', 'Signal returned to normal', 'Duplicate of another alert', 'False alarm'].map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="What was done">
          <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Temporary navigator day added; vouchers delivered." />
        </Field>
      </form>
    </Modal>
  );
}
