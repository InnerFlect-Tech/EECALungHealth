import { useId, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import * as S from '../kazakhstanScenario';
import type { OptionId, TaskStatus } from '../kazakhstanScenario';
import { Modal } from './ui';
import { instName, stamp, statusLabel, useDemo, useToast } from './store';
import { isoToday, useNow } from './format';
import { rankOptions } from './scoring';

const plusDays = (now: number, d: number) => isoToday(now + d * 86400000);

function Field({ label, children, hint }: { label: string; children: (id: string) => ReactNode; hint?: string }) {
  const id = useId();
  return (
    <div className="pi-field">
      <label htmlFor={id}>{label}</label>
      {children(id)}
      {hint && <span className="pi-field-hint">{hint}</span>}
    </div>
  );
}

function OwnerSelect({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  return (
    <select id={id} className="pi-input" value={value} onChange={(e) => onChange(e.target.value)}>
      {S.sectors.map((s) => (
        <optgroup key={s.id} label={s.label}>
          {S.institutions.filter((i) => i.sector === s.id).map((i) => <option key={i.id} value={i.id}>{i.short}</option>)}
        </optgroup>
      ))}
    </select>
  );
}

function Actions({ onClose, submit, form }: { onClose: () => void; submit: string; form: string }) {
  return (
    <>
      <button type="button" className="pi-btn" onClick={onClose}>Cancel</button>
      <button type="submit" form={form} className="pi-btn pi-btn-primary">{submit}</button>
    </>
  );
}

export function AnswerModal({ questionId, onClose }: { questionId: string; onClose: () => void }) {
  const { state, dispatch } = useDemo();
  const toast = useToast();
  const q = state.questions.find((x) => x.id === questionId)!;
  const [answer, setAnswer] = useState('');
  const form = useId();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'answer', id: q.id, answer: answer.trim() || 'Marked answered during the demo.', ...stamp() });
    toast({ title: 'Question marked answered', body: q.text });
    onClose();
  };
  return (
    <Modal title="Mark question answered" description={q.text} onClose={onClose} footer={<Actions onClose={onClose} submit="Mark answered" form={form} />}>
      <form id={form} onSubmit={submit} className="pi-form">
        <Field label="Answer summary" hint="Optional. Shown on the question and in the activity feed.">
          {(id) => <textarea id={id} className="pi-input" rows={4} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="e.g. Ministry of Health confirmed the costing will be shared by 1 December." data-autofocus />}
        </Field>
      </form>
    </Modal>
  );
}

export function ReassignModal({ questionId, onClose }: { questionId: string; onClose: () => void }) {
  const { state, dispatch } = useDemo();
  const toast = useToast();
  const q = state.questions.find((x) => x.id === questionId)!;
  const [owner, setOwner] = useState(q.ownerId);
  const form = useId();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (owner !== q.ownerId) {
      dispatch({ type: 'reassign', id: q.id, ownerId: owner, ...stamp() });
      toast({ title: `Reassigned to ${instName(owner)}`, body: q.text });
    }
    onClose();
  };
  return (
    <Modal title="Reassign question" description={q.text} onClose={onClose} footer={<Actions onClose={onClose} submit="Reassign" form={form} />}>
      <form id={form} onSubmit={submit} className="pi-form">
        <Field label="Responsible institution">{(id) => <OwnerSelect id={id} value={owner} onChange={setOwner} />}</Field>
      </form>
    </Modal>
  );
}

export function NewTaskModal({ onClose, ownerId, title: initialTitle, kind = 'task', status: initialStatus = 'in-progress', heading = 'New task', description: initialDesc = '', source }: {
  onClose: () => void; ownerId?: string; title?: string; kind?: 'task' | 'evidence-request'; status?: TaskStatus; heading?: string; description?: string; source?: string;
}) {
  const { dispatch } = useDemo();
  const toast = useToast();
  const now = useNow();
  const [title, setTitle] = useState(initialTitle ?? '');
  const [owner, setOwner] = useState(ownerId ?? S.DEMO_USER.unitId);
  const [due, setDue] = useState(plusDays(now, kind === 'evidence-request' ? 30 : 14));
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [desc, setDesc] = useState(initialDesc);
  const [error, setError] = useState('');
  const form = useId();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Give the task a title.'); return; }
    const st = stamp();
    dispatch({
      type: 'createTask', ...st, source,
      task: { title: title.trim(), description: desc.trim() || (kind === 'evidence-request' ? `Evidence requested from ${instName(owner)}.` : 'Created during the demo.'), ownerId: owner, status, start: st.at.slice(0, 10), due, kind },
    });
    toast({
      title: kind === 'evidence-request' ? 'Evidence request created' : 'Task created',
      body: `${title.trim()} · ${instName(owner)}`,
      action: { label: 'View in tracker', ref: { view: 'tracker', item: `t-${st.uid}` } },
    });
    onClose();
  };
  return (
    <Modal
      title={heading}
      description={kind === 'evidence-request' ? 'Creates an evidence request in the decision tracker and notifies the owner (simulated).' : 'Adds a task to the decision tracker.'}
      onClose={onClose}
      footer={<Actions onClose={onClose} submit={kind === 'evidence-request' ? 'Send request' : 'Create task'} form={form} />}
    >
      <form id={form} onSubmit={submit} className="pi-form" noValidate>
        <Field label={kind === 'evidence-request' ? 'What evidence is needed?' : 'Title'}>
          {(id) => (
            <>
              <input id={id} className="pi-input" value={title} onChange={(e) => { setTitle(e.target.value); setError(''); }} data-autofocus aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} />
              {error && <span className="pi-field-error" id={`${id}-err`}>{error}</span>}
            </>
          )}
        </Field>
        <div className="pi-form-row">
          <Field label={kind === 'evidence-request' ? 'Request from' : 'Owner'}>{(id) => <OwnerSelect id={id} value={owner} onChange={setOwner} />}</Field>
          <Field label="Due date">{(id) => <input id={id} type="date" className="pi-input" value={due} onChange={(e) => setDue(e.target.value)} />}</Field>
        </div>
        {kind === 'task' && (
          <Field label="Status">
            {(id) => (
              <select id={id} className="pi-input" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
                {(Object.keys(statusLabel) as TaskStatus[]).map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
              </select>
            )}
          </Field>
        )}
        <Field label="Note" hint="Optional">
          {(id) => <textarea id={id} className="pi-input" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />}
        </Field>
      </form>
    </Modal>
  );
}

export function RecommendModal({ onClose, initial }: { onClose: () => void; initial?: OptionId }) {
  const { state, dispatch } = useDemo();
  const toast = useToast();
  const ranked = rankOptions(state.weights);
  const [choice, setChoice] = useState<OptionId>(initial ?? state.decision?.optionId ?? ranked[0].option.id);
  const [why, setWhy] = useState('');
  const form = useId();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const st = stamp();
    dispatch({ type: 'recommend', optionId: choice, rationale: why.trim(), ...st });
    toast({ title: `Option ${choice} recommended`, body: 'Decision recorded in the tracker with the next procedural step.', action: { label: 'View in tracker', ref: { view: 'tracker', item: `t-${st.uid}` } } });
    onClose();
  };
  return (
    <Modal size="lg" title="Recommend an option" description="Records the committee secretariat’s recommendation in the decision tracker and adds the next procedural step." onClose={onClose} footer={<Actions onClose={onClose} submit={`Recommend Option ${choice}`} form={form} />}>
      <form id={form} onSubmit={submit} className="pi-form">
        <fieldset className="pi-radio-cards">
          <legend>Option</legend>
          {ranked.map((r) => (
            <label key={r.option.id} className={`pi-radio-card${choice === r.option.id ? ' is-checked' : ''}`}>
              <input type="radio" name="opt" value={r.option.id} checked={choice === r.option.id} onChange={() => setChoice(r.option.id)} data-autofocus={choice === r.option.id ? true : undefined} />
              <span className={`pi-opt-badge pi-opt-${r.option.id}`}>{r.option.id}</span>
              <span className="pi-radio-main">
                <strong>{r.option.title}</strong>
                <span>{r.option.costIndicative} · {r.option.timeline}</span>
              </span>
              <span className="pi-radio-score"><b>{r.score}</b><small>#{r.rank}</small></span>
            </label>
          ))}
        </fieldset>
        <Field label="Rationale" hint="Optional. Saved with the decision record.">
          {(id) => <textarea id={id} className="pi-input" rows={3} value={why} onChange={(e) => setWhy(e.target.value)} placeholder="e.g. Fastest route that uses an existing legal mechanism; pair with national standards." />}
        </Field>
      </form>
    </Modal>
  );
}
