import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { alerts as baseAlerts, caseRecords, notifications as baseNotifications } from '../careContinuityScenario';
import {
  DemoContext, ToastContext, emptyState, loadState, saveState,
  type AlertView, type CaseView, type DemoApi, type DemoState, type Toast,
} from './store';
import { Icon } from './icons';

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => (typeof window === 'undefined' ? emptyState() : loadState()));

  useEffect(() => { saveState(state); }, [state]);

  const api = useMemo<DemoApi>(() => {
    const alerts: AlertView[] = baseAlerts.map((a) => {
      const o = state.alerts[a.id] ?? {};
      return {
        ...a,
        status: o.status ?? a.status,
        assignee: o.assignee !== undefined ? o.assignee : a.assignee,
        comments: [...a.comments, ...(o.comments ?? [])],
        actionsDone: o.actionsDone ?? [],
      };
    });
    const cases: CaseView[] = caseRecords.map((c) => {
      const o = state.cases[c.id] ?? {};
      return {
        ...c,
        status: o.status ?? c.status,
        risk: o.risk ?? c.risk,
        lastContact: o.lastContact ?? c.lastContact,
        nextFollowUp: o.nextFollowUp !== undefined ? o.nextFollowUp : c.nextFollowUp,
        followUpType: o.followUpType,
        addedContacts: o.contacts ?? [],
        escalated: !!o.escalated,
      };
    });
    const all = [...state.extraNotifications, ...baseNotifications];
    const notifications = all.map((n) => ({ ...n, read: state.readNotifications.includes(n.id) }));

    const nextId = (s: DemoState) => `u${s.seq + 1}`;

    return {
      state,
      alerts,
      cases,
      getAlert: (id) => alerts.find((a) => a.id === id),
      getCase: (id) => cases.find((c) => c.id === id),
      notifications,
      unread: notifications.filter((n) => !n.read).length,
      updateAlert: (id, patch, comment) => setState((s) => {
        const prev = s.alerts[id] ?? {};
        const comments = comment ? [...(prev.comments ?? []), { id: nextId(s), author: comment.author, ago: 'Just now', text: comment.text }] : prev.comments;
        return { ...s, seq: s.seq + 1, alerts: { ...s.alerts, [id]: { ...prev, ...patch, comments } } };
      }),
      addAlertComment: (id, text) => setState((s) => {
        const prev = s.alerts[id] ?? {};
        const c = { id: nextId(s), author: 'Programme coordinator (you)', ago: 'Just now', text };
        return { ...s, seq: s.seq + 1, alerts: { ...s.alerts, [id]: { ...prev, comments: [...(prev.comments ?? []), c] } } };
      }),
      toggleAlertAction: (id, index) => setState((s) => {
        const prev = s.alerts[id] ?? {};
        const done = prev.actionsDone ?? [];
        const next = done.includes(index) ? done.filter((i) => i !== index) : [...done, index];
        return { ...s, alerts: { ...s.alerts, [id]: { ...prev, actionsDone: next } } };
      }),
      updateCase: (id, patch, entry) => setState((s) => {
        const prev = s.cases[id] ?? {};
        const contacts = entry ? [{ ...entry, id: nextId(s) }, ...(prev.contacts ?? [])] : prev.contacts;
        return { ...s, seq: s.seq + 1, cases: { ...s.cases, [id]: { ...prev, ...patch, contacts } } };
      }),
      markRead: (id) => setState((s) => (s.readNotifications.includes(id) ? s : { ...s, readNotifications: [...s.readNotifications, id] })),
      markAllRead: () => setState((s) => ({ ...s, readNotifications: all.map((n) => n.id) })),
      pushNotification: (n) => setState((s) => ({ ...s, seq: s.seq + 1, extraNotifications: [{ ...n, id: `n-${nextId(s)}` }, ...s.extraNotifications] })),
      dismissBanner: () => setState((s) => ({ ...s, bannerDismissed: true })),
      reset: () => setState(emptyState()),
    };
  }, [state]);

  return <DemoContext.Provider value={api}>{children}</DemoContext.Provider>;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);
  const timers = useRef(new Map<number, number>());

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    const h = timers.current.get(id);
    if (h) window.clearTimeout(h);
    timers.current.delete(id);
  }, []);

  const push = useCallback((text: string, tone: Toast['tone'] = 'success') => {
    seq.current += 1;
    const id = seq.current;
    setToasts((t) => [...t.slice(-3), { id, text, tone }]);
    timers.current.set(id, window.setTimeout(() => dismiss(id), 4200));
  }, [dismiss]);

  useEffect(() => {
    const map = timers.current;
    return () => { map.forEach((h) => window.clearTimeout(h)); };
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="cc-toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`cc-toast cc-toast-${t.tone}`}>
            <span className="cc-toast-icon" aria-hidden="true"><Icon name={t.tone === 'warn' ? 'alert' : t.tone === 'info' ? 'info' : 'check'} size={14} /></span>
            <span className="cc-toast-text">{t.text}</span>
            <button type="button" className="cc-icon-btn cc-toast-close" aria-label="Dismiss notification" onClick={() => dismiss(t.id)}>
              <Icon name="x" size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
