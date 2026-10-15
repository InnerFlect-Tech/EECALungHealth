import { useState } from 'react';
import * as S from '../../kazakhstanScenario';
import { Icon } from '../Icon';
import { TransitionChart } from '../charts';
import { NewTaskModal } from '../modals';
import { OwnerChip, PageHeader, PriorityBadge, StanceBadge, StatusBadge } from '../ui';
import { initials, instName, stamp, useDemo, useNav, useToast } from '../store';
import { daysUntil, fmtDate, relTime, useNow } from '../format';
import { rankOptions } from '../scoring';

function Countdown() {
  const now = useNow();
  const end = new Date(S.issue.deadline).getTime();
  const start = new Date(`${S.issue.stages[0].date}T09:00:00+05:00`).getTime();
  const ms = Math.max(0, end - now);
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const pct = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
  return (
    <div className="pi-countdown" aria-label={`${days} days and ${hours} hours until the decision deadline`}>
      <span className="pi-countdown-label"><Icon name="clock" /> Decision deadline</span>
      <div className="pi-countdown-num">
        <span><b>{days}</b> days</span>
        <span><b>{hours}</b> h</span>
      </div>
      <div className="pi-progress" aria-hidden="true"><i style={{ width: `${pct}%` }} /></div>
      <span className="pi-countdown-date">{S.issue.deadlineLabel}</span>
    </div>
  );
}

function Stepper() {
  const idx = S.issue.stageIndex;
  return (
    <ol className="pi-stepper" aria-label="Decision stages">
      {S.issue.stages.map((s, i) => {
        const state = i < idx ? 'done' : i === idx ? 'current' : 'todo';
        return (
          <li key={s.label} className={`is-${state}`} aria-current={i === idx ? 'step' : undefined} title={s.note}>
            <span className="pi-step-dot" aria-hidden="true">{state === 'done' ? <Icon name="check" size={12} /> : i + 1}</span>
            <span className="pi-step-text">
              <span className="pi-step-label">{s.label}</span>
              <span className="pi-step-date">{state === 'done' ? 'Done' : state === 'current' ? 'In progress' : 'Planned'} · {fmtDate(s.date, { year: false })}</span>
            </span>
            <span className="pi-sr">{state === 'done' ? '(completed)' : state === 'current' ? '(current stage)' : '(upcoming)'}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function Dashboard() {
  const { state, dispatch } = useDemo();
  const nav = useNav();
  const toast = useToast();
  const now = useNow();
  const [tab, setTab] = useState<'open' | 'answered'>('open');
  const [newTask, setNewTask] = useState(false);

  const open = state.questions.filter((q) => q.status === 'open');
  const answered = state.questions.filter((q) => q.status === 'answered');
  const list = (tab === 'open' ? open : answered).slice().sort((a, b) => a.due.localeCompare(b.due));
  const awaiting = state.tasks.filter((t) => t.status === 'awaiting' || t.status === 'blocked');
  const blocked = state.tasks.filter((t) => t.status === 'blocked').length;
  const gaps = S.evidence.filter((e) => e.type === 'gap').length;
  const ranked = rankOptions(state.weights);
  const leader = ranked[0];
  const mine = state.tasks
    .filter((t) => (t.ownerId === S.DEMO_USER.unitId || t.ownerId === 'research') && t.status !== 'reviewed')
    .sort((a, b) => a.due.localeCompare(b.due))
    .slice(0, 5);

  const kpis = [
    { label: 'Open questions', value: `${open.length}`, of: `/ ${state.questions.length}`, note: `${open.filter((q) => q.priority === 'high').length} high priority`, go: () => document.getElementById('pi-questions')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), icon: 'message' as const },
    { label: 'Evidence in brief', value: `${state.inBrief.length}`, of: `/ ${S.evidence.length}`, note: `${gaps} evidence gaps open`, go: () => nav.go({ view: 'evidence' }), icon: 'evidence' as const },
    { label: 'Actions awaiting', value: `${awaiting.length}`, of: '', note: blocked ? `${blocked} blocked` : 'None blocked', go: () => nav.go({ view: 'tracker' }), icon: 'tracker' as const },
    { label: 'Leading option', value: `Option ${state.decision?.optionId ?? leader.option.id}`, of: '', note: state.decision ? 'Recommendation recorded' : `Score ${leader.score} under current weights`, go: () => nav.go({ view: 'brief' }), icon: 'scale' as const },
  ];

  return (
    <div className="pi-view">
      <PageHeader
        eyebrow={<>Active policy issue · {S.issue.country} · {S.issue.ref}</>}
        title={S.issue.title}
        subtitle={S.issue.summary}
        actions={(
          <>
            <button type="button" className="pi-btn" onClick={() => setNewTask(true)}><Icon name="plus" />New task</button>
            <button type="button" className="pi-btn pi-btn-primary" onClick={() => nav.go({ view: 'brief' })}><Icon name="brief" />Open decision brief</button>
          </>
        )}
      />

      <section className="pi-card pi-issue-card" aria-label="Issue status">
        <div className="pi-issue-stages">
          <div className="pi-card-head"><h2>Decision stage</h2><span className="pi-muted-sm">Stage {S.issue.stageIndex + 1} of {S.issue.stages.length}: {S.issue.stages[S.issue.stageIndex].label}</span></div>
          <Stepper />
        </div>
        <Countdown />
      </section>

      <div className="pi-kpis">
        {kpis.map((k) => (
          <button type="button" key={k.label} className="pi-card pi-kpi" onClick={k.go}>
            <span className="pi-kpi-label"><Icon name={k.icon} />{k.label}</span>
            <span className="pi-kpi-value">{k.value}{k.of && <small>{k.of}</small>}</span>
            <span className="pi-kpi-note">{k.note}<Icon name="arrowRight" className="pi-kpi-go" /></span>
          </button>
        ))}
      </div>

      <div className="pi-dash-grid">
        <div className="pi-col-main">
          <section className="pi-card" id="pi-questions" aria-labelledby="pi-q-title">
            <div className="pi-card-head">
              <h2 id="pi-q-title">Outstanding questions</h2>
              <div className="pi-tabs" role="tablist" aria-label="Question status">
                {(['open', 'answered'] as const).map((t) => (
                  <button
                    key={t} type="button" role="tab" id={`pi-qtab-${t}`} aria-selected={tab === t} aria-controls="pi-qpanel" tabIndex={tab === t ? 0 : -1}
                    onClick={() => setTab(t)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                        const next = t === 'open' ? 'answered' : 'open';
                        setTab(next);
                        document.getElementById(`pi-qtab-${next}`)?.focus();
                      }
                    }}
                  >
                    {t === 'open' ? 'Open' : 'Answered'}<span className="pi-tab-count">{t === 'open' ? open.length : answered.length}</span>
                  </button>
                ))}
              </div>
            </div>
            <div role="tabpanel" id="pi-qpanel" aria-labelledby={`pi-qtab-${tab}`}>
              {list.length ? (
                <ul className="pi-qlist">
                  {list.map((q) => {
                    const d = daysUntil(q.due, now);
                    return (
                      <li key={q.id}>
                        <button type="button" className={`pi-qrow${nav.item === q.id ? ' is-selected' : ''}`} onClick={() => nav.open(q.id)}>
                          <span className={`pi-qrow-mark pi-prio-mark-${q.priority}`} aria-hidden="true" />
                          <span className="pi-qrow-main">
                            <span className="pi-qrow-text">{q.text}</span>
                            <span className="pi-qrow-meta">
                              <OwnerChip id={q.ownerId} />
                              <span className="pi-meta-sep" aria-hidden="true">·</span>
                              <span><Icon name="evidence" size={14} /> {q.linkedEvidence.length} evidence</span>
                            </span>
                          </span>
                          <span className="pi-qrow-side">
                            {q.status === 'open' ? <PriorityBadge p={q.priority} /> : <span className="pi-status pi-status-reviewed"><i aria-hidden="true" />Answered</span>}
                            {q.status === 'open' && <span className={`pi-due${d < 0 ? ' is-over' : d <= 30 ? ' is-soon' : ''}`}>{d < 0 ? `${-d} d overdue` : `Due ${fmtDate(q.due, { year: false })}`}</span>}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="pi-empty-inline">{tab === 'open' ? 'All questions answered. Nice work.' : 'No answered questions yet.'}</p>
              )}
            </div>
          </section>

          <section className="pi-card" aria-labelledby="pi-fin-title">
            <div className="pi-card-head">
              <div>
                <h2 id="pi-fin-title">Financing transition</h2>
                <p className="pi-muted-sm">Community TB support funding by source. Hover a year for details.</p>
              </div>
              <button type="button" className="pi-link-btn" onClick={() => nav.go({ view: 'evidence', item: 'ev-11' })}>Source <Icon name="arrowRight" /></button>
            </div>
            <TransitionChart data={S.financingTransition} need={1.8} />
          </section>
        </div>

        <div className="pi-col-side">
          <section className="pi-card" aria-labelledby="pi-next-title">
            <div className="pi-card-head">
              <h2 id="pi-next-title">My next actions</h2>
              <button type="button" className="pi-icon-btn pi-icon-btn-sm" aria-label="Create task" onClick={() => setNewTask(true)}><Icon name="plus" /></button>
            </div>
            {mine.length ? (
              <ul className="pi-checklist">
                {mine.map((t) => {
                  const d = daysUntil(t.due, now);
                  return (
                    <li key={t.id}>
                      <input
                        type="checkbox"
                        id={`pi-chk-${t.id}`}
                        aria-label={`Mark “${t.title}” as reviewed`}
                        onChange={() => {
                          dispatch({ type: 'moveTask', id: t.id, status: 'reviewed', ...stamp() });
                          toast({ title: 'Marked as reviewed', body: t.title, action: { label: 'View', ref: { view: 'tracker', item: t.id } } });
                        }}
                      />
                      <button type="button" className="pi-check-main" onClick={() => nav.go({ view: 'tracker', item: t.id })}>
                        <span>{t.title}</span>
                        <span className="pi-check-meta">
                          <StatusBadge status={t.status} />
                          <span className={`pi-due${d < 0 ? ' is-over' : d <= 14 ? ' is-soon' : ''}`}>{d < 0 ? `${-d} d overdue` : `Due ${fmtDate(t.due, { year: false })}`}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : <p className="pi-empty-inline">You are all caught up.</p>}
          </section>

          <section className="pi-card" aria-labelledby="pi-inst-title">
            <div className="pi-card-head"><h2 id="pi-inst-title">Responsible institutions</h2></div>
            <ul className="pi-inst-list">
              {S.issue.responsible.map((r) => {
                const prof = S.stakeholderProfiles.find((p) => p.institutionId === r.institutionId);
                const items = state.tasks.filter((t) => t.ownerId === r.institutionId && t.status !== 'reviewed').length
                  + state.questions.filter((q) => q.ownerId === r.institutionId && q.status === 'open').length;
                return (
                  <li key={r.institutionId}>
                    <button type="button" onClick={() => nav.go({ view: 'stakeholders', item: `sh-${r.institutionId}` })}>
                      <span className="pi-inst-icon" aria-hidden="true"><Icon name="building" /></span>
                      <span className="pi-inst-main">
                        <strong>{instName(r.institutionId)}</strong>
                        <span>{r.role}</span>
                      </span>
                      <span className="pi-inst-side">
                        {prof && <StanceBadge stance={prof.stance} />}
                        <span className="pi-muted-xs">{items} open</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="pi-card" aria-labelledby="pi-act-title">
            <div className="pi-card-head"><h2 id="pi-act-title">Recent activity</h2></div>
            <ol className="pi-feed">
              {state.activity.slice(0, 6).map((a) => (
                <li key={a.id}>
                  <span className={`pi-feed-avatar${a.actor === 'You' ? ' is-me' : ''}`} aria-hidden="true">{a.actor === 'You' ? S.DEMO_USER.initials : initials(a.actor)}</span>
                  <div>
                    <p>
                      <strong>{a.actor}</strong>{' '}
                      {a.ref ? <button type="button" className="pi-feed-link" onClick={() => nav.go(a.ref!)}>{a.text}</button> : a.text}
                    </p>
                    <time dateTime={a.at}>{relTime(a.at, now)}</time>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
      {newTask && <NewTaskModal onClose={() => setNewTask(false)} />}
    </div>
  );
}
