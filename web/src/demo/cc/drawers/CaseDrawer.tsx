import { useMemo, useState, type FormEvent } from 'react';
import {
  addDays, adherenceDays, contactHistory, meta, workerRoles, type CaseStatus, type ContactChannel, type ContactEntry,
} from '../../careContinuityScenario';
import { Icon } from '../icons';
import {
  CASE_STATUS_LABEL, PHASE_LABEL, SERVICE_COLOR, baseCaseById, districtLabel, fmtDate, relDay, serviceById, type IconName,
} from '../model';
import { Drawer, Modal } from '../overlay';
import { useNav } from '../nav';
import { useDemo, useToast } from '../store';
import { CaseStatusBadge, Field, RiskBadge, Tag } from '../ui';

const CHANNEL_ICON: Record<ContactChannel, IconName> = {
  'Home visit': 'home', 'Phone call': 'phone', 'VOT check-in': 'sparkle', 'Dispensary visit': 'pin', 'Peer group': 'users', Note: 'message',
};
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Heatmap({ days }: { days: { date: string; state: 'taken' | 'missed' | 'none' }[] }) {
  // Align columns to weeks starting Monday.
  const first = new Date(`${days[0].date}T12:00:00Z`).getUTCDay(); // 0 = Sun
  const lead = (first + 6) % 7;
  const cells = [...Array.from({ length: lead }, () => null), ...days];
  const weeks: (typeof cells)[] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  const taken = days.filter((d) => d.state === 'taken').length;
  const missed = days.filter((d) => d.state === 'missed').length;
  return (
    <div className="cc-heat">
      <div className="cc-heat-grid" role="img" aria-label={`Adherence calendar, last 8 weeks (synthetic): ${taken} doses taken, ${missed} missed.`}>
        <div className="cc-heat-days" aria-hidden="true">
          {WEEKDAYS.map((d, i) => <span key={d}>{i % 2 === 0 ? d : ''}</span>)}
        </div>
        {weeks.map((w, wi) => (
          <div key={wi} className="cc-heat-col" aria-hidden="true">
            {Array.from({ length: 7 }, (_, di) => {
              const c = w[di];
              if (!c) return <span key={di} className="cc-heat-cell is-empty" />;
              return <span key={di} className={`cc-heat-cell is-${c.state}`} title={`${fmtDate(c.date)}: ${c.state === 'none' ? 'no dose recorded' : c.state === 'taken' ? 'dose taken' : 'dose missed'}`} />;
            })}
          </div>
        ))}
      </div>
      <div className="cc-heat-legend">
        <span><i className="is-taken" /> Taken <strong className="cc-num">{taken}</strong></span>
        <span><i className="is-missed" /> Missed <strong className="cc-num">{missed}</strong></span>
        <span><i className="is-none" /> No dose recorded</span>
      </div>
    </div>
  );
}

type ModalKind = 'contact' | 'followup' | 'escalate' | null;

export function CaseDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const { getCase, updateCase, pushNotification } = useDemo();
  const { go } = useNav();
  const toast = useToast();
  const c = getCase(id)!;
  const base = baseCaseById.get(id)!;
  const [modal, setModal] = useState<ModalKind>(null);
  const days = useMemo(() => adherenceDays(base), [base]);
  const history = useMemo(() => contactHistory(base), [base]);
  const timeline: ContactEntry[] = [...c.addedContacts, ...history];

  const setStatus = (s: CaseStatus) => {
    updateCase(id, { status: s }, { date: meta.asOf, channel: 'Note', by: 'Programme coordinator (you)', text: `Status changed to “${CASE_STATUS_LABEL[s]}”.` });
    toast(`${id} status set to ${CASE_STATUS_LABEL[s]}`);
  };

  return (
    <Drawer
      itemKey={id}
      eyebrow={<span className="cc-synthetic-eyebrow"><Icon name="info" size={12} /> Synthetic record · no real patient</span>}
      title={<span className="cc-mono">{id}</span>}
      meta={<><RiskBadge risk={c.risk} /><CaseStatusBadge status={c.status} />{c.escalated && <Tag tone="bad" icon="flag">Escalated</Tag>}</>}
      onClose={onClose}
      footer={(
        <>
          <button type="button" className="cc-btn" onClick={() => setModal('contact')}><Icon name="phone" size={15} /> Log contact</button>
          <button type="button" className="cc-btn" onClick={() => setModal('followup')}><Icon name="calendar" size={15} /> Schedule follow-up</button>
          <button type="button" className="cc-btn cc-btn-danger" onClick={() => setModal('escalate')} disabled={c.escalated}><Icon name="flag" size={15} /> {c.escalated ? 'Escalated' : 'Escalate'}</button>
        </>
      )}
    >
      <dl className="cc-facts">
        <div><dt>Age band</dt><dd>{c.ageBand}</dd></div>
        <div><dt>District</dt><dd><button type="button" className="cc-link-btn" onClick={() => go('regions', { item: c.districtId })}>{districtLabel(c.districtId)}</button></dd></div>
        <div><dt>Phase</dt><dd>{PHASE_LABEL[c.phase]} · month {c.month}</dd></div>
        <div><dt>Regimen</dt><dd>{c.regimen}</dd></div>
        <div><dt>Assigned to</dt><dd>{c.worker}</dd></div>
        <div><dt>Doses taken</dt><dd className="cc-num">{c.adherence}% (8 weeks)</dd></div>
        <div><dt>Last contact</dt><dd>{fmtDate(c.lastContact)} · {relDay(c.lastContact)}</dd></div>
        <div><dt>Next follow-up</dt><dd>{c.nextFollowUp ? `${fmtDate(c.nextFollowUp)} · ${relDay(c.nextFollowUp)}${c.followUpType ? ` · ${c.followUpType}` : ''}` : 'None scheduled'}</dd></div>
      </dl>

      <div className="cc-inline-field">
        <label htmlFor={`st-${id}`}>Case status</label>
        <select id={`st-${id}`} value={c.status} onChange={(e) => setStatus(e.target.value as CaseStatus)}>
          {(Object.keys(CASE_STATUS_LABEL) as CaseStatus[]).map((s) => <option key={s} value={s}>{CASE_STATUS_LABEL[s]}</option>)}
        </select>
      </div>

      {c.flags.length > 0 && (
        <div className="cc-flags">
          {c.flags.map((f) => <Tag key={f} tone="warn" icon="alert">{f}</Tag>)}
        </div>
      )}

      <h3 className="cc-h3">Adherence calendar <span className="cc-muted-inline">· last 8 weeks, synthetic</span></h3>
      <Heatmap days={days} />

      <h3 className="cc-h3">Support services</h3>
      <ul className="cc-svc-chips">
        {c.services.map((s) => (
          <li key={s}><i style={{ background: SERVICE_COLOR[s] }} />{serviceById.get(s)?.name}</li>
        ))}
      </ul>

      <h3 className="cc-h3">Contact timeline</h3>
      <ol className="cc-timeline">
        {timeline.map((t) => (
          <li key={t.id} className={`${t.outcome === 'not-reached' ? 'is-miss' : ''} ${t.outcome === 'escalated' ? 'is-esc' : ''}`}>
            <span className="cc-timeline-icon" aria-hidden="true"><Icon name={CHANNEL_ICON[t.channel]} size={14} /></span>
            <div className="cc-timeline-body">
              <div className="cc-timeline-top">
                <strong>{t.channel}</strong>
                <span>{fmtDate(t.date)} · {t.by}</span>
              </div>
              <p>{t.text}</p>
            </div>
          </li>
        ))}
      </ol>

      {modal === 'contact' && (
        <LogContactModal
          caseId={id}
          defaultBy={c.worker}
          onClose={() => setModal(null)}
          onSave={(entry) => {
            updateCase(id, entry.outcome === 'reached' ? { lastContact: meta.asOf } : {}, entry);
            setModal(null);
            toast(`Contact logged for ${id}`);
          }}
        />
      )}
      {modal === 'followup' && (
        <FollowUpModal
          caseId={id}
          defaultWorker={c.worker}
          onClose={() => setModal(null)}
          onSave={(date, type, who) => {
            updateCase(id, { nextFollowUp: date, followUpType: type, status: c.status === 'active' ? 'follow-up' : c.status }, {
              date: meta.asOf, channel: 'Note', by: 'Programme coordinator (you)', text: `Follow-up scheduled: ${type.toLowerCase()} on ${fmtDate(date)} with ${who}.`,
            });
            setModal(null);
            toast(`Follow-up scheduled for ${fmtDate(date)}`);
          }}
        />
      )}
      {modal === 'escalate' && (
        <EscalateModal
          caseId={id}
          onClose={() => setModal(null)}
          onSave={(to, reason, raise) => {
            updateCase(id, { escalated: true, status: 'follow-up', ...(raise ? { risk: 'high' } : {}) }, {
              date: meta.asOf, channel: 'Note', by: 'Programme coordinator (you)', text: `Escalated to ${to}: ${reason}`, outcome: 'escalated',
            });
            pushNotification({ text: `${id} escalated to ${to}`, ago: 'Just now', view: 'caseload', item: id, tone: 'case' });
            setModal(null);
            toast(`${id} escalated to ${to}`, 'warn');
          }}
        />
      )}
    </Drawer>
  );
}

function LogContactModal({ caseId, defaultBy, onClose, onSave }: { caseId: string; defaultBy: string; onClose: () => void; onSave: (e: Omit<ContactEntry, 'id'>) => void }) {
  const [channel, setChannel] = useState<ContactChannel>('Phone call');
  const [outcome, setOutcome] = useState<'reached' | 'not-reached'>('reached');
  const [text, setText] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ date: meta.asOf, channel, by: defaultBy, outcome, text: text.trim() || (outcome === 'reached' ? 'Contact made. No concerns raised.' : 'Could not reach the person. Will try again.') });
  };
  return (
    <Modal
      title={`Log contact · ${caseId}`}
      description="Record an outreach contact. Synthetic record; do not enter real personal details."
      onClose={onClose}
      footer={<><button type="button" className="cc-btn" onClick={onClose}>Cancel</button><button type="submit" form="cc-log-form" className="cc-btn cc-btn-primary">Save contact</button></>}
    >
      <form id="cc-log-form" className="cc-form" onSubmit={submit}>
        <Field label="Channel">
          <select value={channel} onChange={(e) => setChannel(e.target.value as ContactChannel)} data-autofocus>
            {(['Phone call', 'Home visit', 'VOT check-in', 'Dispensary visit', 'Peer group'] as ContactChannel[]).map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <fieldset className="cc-radio-group">
          <legend>Outcome</legend>
          <label><input type="radio" name="outcome" checked={outcome === 'reached'} onChange={() => setOutcome('reached')} /> Reached</label>
          <label><input type="radio" name="outcome" checked={outcome === 'not-reached'} onChange={() => setOutcome('not-reached')} /> Not reached</label>
        </fieldset>
        <Field label="Note" hint="Keep it short and non-identifying.">
          <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. Doses observed by video; side effects easing." />
        </Field>
      </form>
    </Modal>
  );
}

function FollowUpModal({ caseId, defaultWorker, onClose, onSave }: { caseId: string; defaultWorker: string; onClose: () => void; onSave: (date: string, type: string, who: string) => void }) {
  const [date, setDate] = useState(addDays(meta.asOf, 2));
  const [type, setType] = useState('Home visit');
  const [who, setWho] = useState(defaultWorker);
  const quick = [1, 2, 7].map((n) => addDays(meta.asOf, n));
  return (
    <Modal
      title={`Schedule follow-up · ${caseId}`}
      description="Plan the next contact. The assigned worker sees it in their list."
      onClose={onClose}
      footer={<><button type="button" className="cc-btn" onClick={onClose}>Cancel</button><button type="submit" form="cc-fu-form" className="cc-btn cc-btn-primary">Schedule</button></>}
    >
      <form id="cc-fu-form" className="cc-form" onSubmit={(e) => { e.preventDefault(); onSave(date, type, who); }}>
        <Field label="Date">
          <input type="date" value={date} min={meta.asOf} onChange={(e) => setDate(e.target.value || date)} data-autofocus />
        </Field>
        <div className="cc-quick-dates" role="group" aria-label="Quick dates">
          {quick.map((d, i) => (
            <button key={d} type="button" className={`cc-chip ${date === d ? 'is-on' : ''}`} aria-pressed={date === d} onClick={() => setDate(d)}>
              {['Tomorrow', 'In 2 days', 'Next week'][i]}
            </button>
          ))}
        </div>
        <Field label="Type">
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {['Home visit', 'Phone call', 'Dispensary visit with navigator', 'Peer group session', 'VOT review'].map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Assign to">
          <select value={who} onChange={(e) => setWho(e.target.value)}>
            {workerRoles.map((w) => <option key={w}>{w}</option>)}
          </select>
        </Field>
      </form>
    </Modal>
  );
}

function EscalateModal({ caseId, onClose, onSave }: { caseId: string; onClose: () => void; onSave: (to: string, reason: string, raise: boolean) => void }) {
  const [to, setTo] = useState('District TB coordinator');
  const [reason, setReason] = useState('');
  const [raise, setRaise] = useState(true);
  const [error, setError] = useState('');
  return (
    <Modal
      title={`Escalate · ${caseId}`}
      description="Escalation notifies the receiving role and marks the case for follow-up."
      onClose={onClose}
      footer={<><button type="button" className="cc-btn" onClick={onClose}>Cancel</button><button type="submit" form="cc-esc-form" className="cc-btn cc-btn-danger">Escalate case</button></>}
    >
      <form
        id="cc-esc-form"
        className="cc-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (reason.trim().length < 4) { setError('Add a short reason so the receiving team knows what to do.'); return; }
          onSave(to, reason.trim(), raise);
        }}
      >
        <Field label="Escalate to">
          <select value={to} onChange={(e) => setTo(e.target.value)} data-autofocus>
            {['District TB coordinator', 'Dispensary doctor', 'NGO case manager', 'Social worker (akimat)'].map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Reason">
          <textarea rows={3} value={reason} onChange={(e) => { setReason(e.target.value); setError(''); }} placeholder="e.g. 3+ missed doses and phone unreachable for a week." aria-invalid={!!error} />
        </Field>
        {error && <p className="cc-form-error" role="alert">{error}</p>}
        <label className="cc-check"><input type="checkbox" checked={raise} onChange={(e) => setRaise(e.target.checked)} /> Raise risk level to high</label>
      </form>
    </Modal>
  );
}
