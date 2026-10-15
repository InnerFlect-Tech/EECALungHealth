import { useState } from 'react';
import type { DragEvent } from 'react';
import * as S from '../../kazakhstanScenario';
import type { Task, TaskStatus } from '../../kazakhstanScenario';
import { Icon } from '../Icon';
import { NewTaskModal } from '../modals';
import { Menu, OwnerChip, PageHeader, Segmented, StatusBadge } from '../ui';
import { instName, stamp, statusLabel, useDemo, useNav, useToast } from '../store';
import { daysUntil, fmtDate, isoToday, useNow } from '../format';

const COLS: TaskStatus[] = ['reviewed', 'in-progress', 'awaiting', 'blocked'];
const KIND: Record<Task['kind'], string> = { task: 'Task', 'evidence-request': 'Evidence request', decision: 'Decision', milestone: 'Milestone' };

function Due({ date, now, done }: { date: string; now: number; done: boolean }) {
  const d = daysUntil(date, now);
  const cls = done ? '' : d < 0 ? ' is-over' : d <= 14 ? ' is-soon' : '';
  return <span className={`pi-due${cls}`}><Icon name="calendar" size={13} />{fmtDate(date, { year: false })}{!done && d < 0 ? ' · overdue' : ''}</span>;
}

function Card({ t, now, onDragStart }: { t: Task; now: number; onDragStart: (e: DragEvent, id: string) => void }) {
  const { dispatch } = useDemo();
  const nav = useNav();
  const toast = useToast();
  const move = (s: TaskStatus) => {
    dispatch({ type: 'moveTask', id: t.id, status: s, ...stamp() });
    toast({ title: `Moved to ${statusLabel[s]}`, body: t.title, tone: 'info' });
  };
  return (
    <li
      className={`pi-kcard${nav.item === t.id ? ' is-selected' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, t.id)}
      onClick={() => nav.open(t.id)}
    >
      <div className="pi-kcard-top">
        <span className={`pi-kind pi-kind-${t.kind}`}>{KIND[t.kind]}</span>
        <Menu
          label={`Move “${t.title}” to`}
          triggerClass="pi-icon-btn pi-icon-btn-sm"
          triggerContent={<Icon name="more" size={16} />}
          header={<div className="pi-menu-title">Move to</div>}
          items={COLS.map((s) => ({ id: s, label: statusLabel[s], checked: t.status === s, onSelect: () => move(s) }))}
        />
      </div>
      <button type="button" className="pi-kcard-title" onClick={(e) => { e.stopPropagation(); nav.open(t.id); }}>{t.title}</button>
      <div className="pi-kcard-meta">
        <OwnerChip id={t.ownerId} />
      </div>
      <div className="pi-kcard-foot">
        <Due date={t.due} now={now} done={t.status === 'reviewed'} />
        {t.notes.length > 0 && <span className="pi-kcard-notes" aria-label={`${t.notes.length} notes`}><Icon name="message" size={13} />{t.notes.length}</span>}
      </div>
    </li>
  );
}

function Board({ tasks }: { tasks: Task[] }) {
  const { dispatch } = useDemo();
  const toast = useToast();
  const now = useNow();
  const [over, setOver] = useState<TaskStatus | null>(null);
  const onDragStart = (e: DragEvent, id: string) => { e.dataTransfer.setData('text/plain', id); e.dataTransfer.effectAllowed = 'move'; };
  const onDrop = (e: DragEvent, s: TaskStatus) => {
    e.preventDefault();
    setOver(null);
    const id = e.dataTransfer.getData('text/plain');
    const t = tasks.find((x) => x.id === id);
    if (t && t.status !== s) {
      dispatch({ type: 'moveTask', id, status: s, ...stamp() });
      toast({ title: `Moved to ${statusLabel[s]}`, body: t.title, tone: 'info' });
    }
  };
  return (
    <div className="pi-board">
      {COLS.map((s) => {
        const items = tasks.filter((t) => t.status === s).sort((a, b) => a.due.localeCompare(b.due));
        return (
          <section
            key={s}
            className={`pi-kcol pi-kcol-${s}${over === s ? ' is-over' : ''}`}
            aria-labelledby={`pi-col-${s}`}
            onDragOver={(e) => { e.preventDefault(); setOver(s); }}
            onDragLeave={() => setOver((o) => (o === s ? null : o))}
            onDrop={(e) => onDrop(e, s)}
          >
            <header>
              <h2 id={`pi-col-${s}`}><StatusBadge status={s} /></h2>
              <span className="pi-count">{items.length}</span>
            </header>
            {items.length ? (
              <ul>{items.map((t) => <Card key={t.id} t={t} now={now} onDragStart={onDragStart} />)}</ul>
            ) : <p className="pi-kcol-empty">Drop tasks here</p>}
          </section>
        );
      })}
    </div>
  );
}

function Timeline({ tasks }: { tasks: Task[] }) {
  const nav = useNav();
  const now = useNow();
  const [hover, setHover] = useState<string | null>(null);
  const start = new Date('2026-08-15T00:00:00+05:00').getTime();
  const end = new Date('2027-04-15T00:00:00+05:00').getTime();
  const pct = (iso: string) => Math.min(100, Math.max(0, ((new Date(`${iso.slice(0, 10)}T12:00:00+05:00`).getTime() - start) / (end - start)) * 100));
  const months: { label: string; left: number }[] = [];
  for (let m = 0; m < 8; m++) {
    const d = new Date(Date.UTC(2026, 8 + m, 1));
    months.push({ label: d.toLocaleDateString('en-GB', { month: 'short', year: m === 0 || d.getUTCMonth() === 0 ? '2-digit' : undefined, timeZone: 'UTC' }), left: pct(d.toISOString()) });
  }
  const today = pct(isoToday(now));
  const deadline = pct(S.issue.deadline.slice(0, 10));
  const sorted = tasks.slice().sort((a, b) => a.start.localeCompare(b.start));
  return (
    <div className="pi-card pi-timeline-card">
      <div className="pi-timeline-scroll">
        <div className="pi-timeline" role="table" aria-label="Task timeline">
          <div className="pi-tl-head" role="row">
            <div className="pi-tl-name" role="columnheader">Task</div>
            <div className="pi-tl-track" role="columnheader" aria-label="Schedule">
              {months.map((m) => <span key={m.label} className="pi-tl-month" style={{ left: `${m.left}%` }}>{m.label}</span>)}
            </div>
          </div>
          <div className="pi-tl-body">
            <div className="pi-tl-lines" aria-hidden="true">
              {months.map((m) => <i key={m.label} style={{ left: `${m.left}%` }} />)}
              <b className="pi-tl-today" style={{ left: `${today}%` }}><span>Today</span></b>
              <b className="pi-tl-deadline" style={{ left: `${deadline}%` }}><span>Deadline</span></b>
            </div>
            {sorted.map((t) => {
              const l = pct(t.start), r = pct(t.due);
              const w = Math.max(r - l, 1.2);
              return (
                <div className="pi-tl-row" role="row" key={t.id}>
                  <div className="pi-tl-name" role="cell">
                    <button type="button" onClick={() => nav.open(t.id)}>{t.title}</button>
                    <span>{instName(t.ownerId)}</span>
                  </div>
                  <div className="pi-tl-track" role="cell">
                    <button
                      type="button"
                      className={`pi-tl-bar pi-tl-${t.status}${t.kind === 'milestone' || t.kind === 'decision' ? ' is-milestone' : ''}`}
                      style={{ left: `${l}%`, width: `${w}%` }}
                      onClick={() => nav.open(t.id)}
                      onMouseEnter={() => setHover(t.id)} onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover(t.id)} onBlur={() => setHover(null)}
                      aria-label={`${t.title}: ${statusLabel[t.status]}, ${fmtDate(t.start)} to ${fmtDate(t.due)}`}
                    />
                    {hover === t.id && (
                      <div className="pi-tip pi-tip-tl" style={{ left: `${Math.min(l + w / 2, 80)}%` }} role="status">
                        <strong>{t.title}</strong>
                        <span>{fmtDate(t.start, { year: false })} → {fmtDate(t.due)}</span>
                        <span>{statusLabel[t.status]} · {instName(t.ownerId)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="pi-map-foot">
        <span className="pi-legend">{COLS.map((s) => <span key={s}><i className={`pi-key pi-tl-${s}`} />{statusLabel[s]}</span>)}</span>
        <span className="pi-muted-xs">Dates are illustrative</span>
      </div>
    </div>
  );
}

export function Tracker() {
  const { state } = useDemo();
  const nav = useNav();
  const [owner, setOwner] = useState('all');
  const [creating, setCreating] = useState(false);
  const mode = nav.mode === 'timeline' ? 'timeline' : 'board';
  const owners = S.institutions.filter((i) => state.tasks.some((t) => t.ownerId === i.id));
  const tasks = state.tasks.filter((t) => owner === 'all' || t.ownerId === owner);
  const counts = COLS.map((s) => ({ s, n: tasks.filter((t) => t.status === s).length }));
  return (
    <div className="pi-view">
      <PageHeader
        eyebrow="Decision tracker"
        title="Actions and decisions"
        subtitle="Every request, task and decision on the issue, with the institution responsible. Drag cards between columns or use the ⋯ menu."
        actions={<button type="button" className="pi-btn pi-btn-primary" onClick={() => setCreating(true)}><Icon name="plus" />New task</button>}
      />
      <div className="pi-toolbar pi-toolbar-bare">
        <Segmented
          label="Tracker view"
          value={mode}
          onChange={(v) => nav.setMode(v === 'timeline' ? 'timeline' : null)}
          options={[{ id: 'board', label: 'Board', icon: 'board' }, { id: 'timeline', label: 'Timeline', icon: 'timeline' }]}
        />
        <div className="pi-toolbar-selects">
          <label className="pi-inline-label" htmlFor="pi-owner-filter">Owner</label>
          <select id="pi-owner-filter" className="pi-input pi-select-sm" value={owner} onChange={(e) => setOwner(e.target.value)}>
            <option value="all">All institutions</option>
            {owners.map((o) => <option key={o.id} value={o.id}>{o.short}</option>)}
          </select>
        </div>
        <div className="pi-mini-stats" aria-label="Task counts">
          {counts.map(({ s, n }) => <span key={s}><i className={`pi-key pi-tl-${s}`} />{n} {statusLabel[s].toLowerCase()}</span>)}
        </div>
      </div>
      {mode === 'timeline' ? <Timeline tasks={tasks} /> : <Board tasks={tasks} />}
      {creating && <NewTaskModal onClose={() => setCreating(false)} ownerId={owner === 'all' ? undefined : owner} />}
    </div>
  );
}
