// State, persistence and navigation for the Parliamentary Intelligence demo.
// Mutations live in React state and are mirrored to sessionStorage so a demo
// survives reloads; "Reset demo data" restores the seed from the scenario file.

import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import * as S from '../kazakhstanScenario';
import type {
  Activity, CriterionId, EvidenceType, Notification, OptionId, Question, Ref, Task, TaskStatus, View,
} from '../kazakhstanScenario';

export interface Decision { optionId: OptionId; rationale: string; at: string; taskId: string }

export interface DemoState {
  v: 2;
  questions: Question[];
  tasks: Task[];
  activity: Activity[];
  notifications: Notification[];
  inBrief: string[];
  weights: Record<CriterionId, number>;
  decision: Decision | null;
  bannerDismissed: boolean;
}

const STORAGE_KEY = 'pi-demo-state-v2';

export const defaultWeights = (): Record<CriterionId, number> =>
  Object.fromEntries(S.criteria.map((c) => [c.id, c.defaultWeight])) as Record<CriterionId, number>;

export function seedState(): DemoState {
  const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x)) as T;
  return {
    v: 2,
    questions: clone(S.questions),
    tasks: clone(S.tasks),
    activity: clone(S.activity),
    notifications: clone(S.notifications),
    inBrief: S.evidence.filter((e) => e.inBrief).map((e) => e.id),
    weights: defaultWeights(),
    decision: null,
    bannerDismissed: false,
  };
}

export function loadState(): DemoState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DemoState;
      if (parsed && parsed.v === 2) return parsed;
    }
  } catch { /* storage unavailable: fall back to seed */ }
  return seedState();
}

export function saveState(state: DemoState) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

// ---------------------------------------------------------------------------

type Stamp = { at: string; uid: string };

export type Action =
  | ({ type: 'answer'; id: string; answer: string } & Stamp)
  | ({ type: 'reopen'; id: string } & Stamp)
  | ({ type: 'reassign'; id: string; ownerId: string } & Stamp)
  | ({ type: 'toggleBrief'; id: string } & Stamp)
  | ({ type: 'createTask'; task: Omit<Task, 'history' | 'notes' | 'id'>; source?: string } & Stamp)
  | ({ type: 'moveTask'; id: string; status: TaskStatus } & Stamp)
  | ({ type: 'assignTask'; id: string; ownerId: string } & Stamp)
  | ({ type: 'addNote'; id: string; text: string } & Stamp)
  | ({ type: 'recommend'; optionId: OptionId; rationale: string } & Stamp)
  | { type: 'setWeight'; id: CriterionId; value: number }
  | { type: 'resetWeights' }
  | { type: 'readNotification'; id: string }
  | { type: 'readAll' }
  | { type: 'dismissBanner' }
  | { type: 'reset' };

export const statusLabel: Record<TaskStatus, string> = {
  reviewed: 'Reviewed',
  'in-progress': 'In progress',
  awaiting: 'Awaiting action',
  blocked: 'Blocked',
};

export const typeLabel: Record<EvidenceType, string> = {
  research: 'Research', legislation: 'Legislation', financing: 'Financing', stakeholder: 'Stakeholder', gap: 'Gap',
};

const STOP = new Set(['of', 'and', '&', 'the', 'for', 'on', 'e.g.']);
/** Two-letter initials, skipping small words: "Ministry of Health" -> "MH". */
export function initials(name: string) {
  const words = name.replace(/\(.*?\)/g, '').split(/\s+/).filter((w) => w && !STOP.has(w.toLowerCase()) && /[A-Za-z]/.test(w[0]));
  return words.slice(0, 2).map((w) => w[0].toUpperCase()).join('') || name.slice(0, 1).toUpperCase();
}

export const instName = (id: string) => S.institutions.find((i) => i.id === id)?.short ?? id;

const ME = 'You';

function log(state: DemoState, a: Stamp, text: string, ref?: Ref): Activity[] {
  return [{ id: `a-${a.uid}`, at: a.at, actor: ME, text, ref }, ...state.activity].slice(0, 40);
}

function updateTask(state: DemoState, id: string, fn: (t: Task) => Task): Task[] {
  return state.tasks.map((t) => (t.id === id ? fn(t) : t));
}

export function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case 'answer': {
      const q = state.questions.find((x) => x.id === action.id);
      return {
        ...state,
        questions: state.questions.map((x) => (x.id === action.id ? { ...x, status: 'answered', answer: action.answer } : x)),
        activity: log(state, action, `marked “${q?.text ?? action.id}” as answered`, { view: 'dashboard', item: action.id }),
      };
    }
    case 'reopen':
      return {
        ...state,
        questions: state.questions.map((x) => (x.id === action.id ? { ...x, status: 'open', answer: undefined } : x)),
        activity: log(state, action, 'reopened a question', { view: 'dashboard', item: action.id }),
      };
    case 'reassign': {
      const q = state.questions.find((x) => x.id === action.id);
      return {
        ...state,
        questions: state.questions.map((x) => (x.id === action.id ? { ...x, ownerId: action.ownerId } : x)),
        activity: log(state, action, `reassigned “${q?.text ?? ''}” to ${instName(action.ownerId)}`, { view: 'dashboard', item: action.id }),
      };
    }
    case 'toggleBrief': {
      const on = state.inBrief.includes(action.id);
      const item = S.evidence.find((e) => e.id === action.id);
      return {
        ...state,
        inBrief: on ? state.inBrief.filter((x) => x !== action.id) : [...state.inBrief, action.id],
        activity: log(state, action, `${on ? 'removed' : 'added'} “${item?.title ?? ''}” ${on ? 'from' : 'to'} the decision brief`, { view: 'evidence', item: action.id }),
      };
    }
    case 'createTask': {
      const id = `t-${action.uid}`;
      const task: Task = {
        ...action.task,
        id,
        history: [{ at: action.at, text: action.source ? `Created from ${action.source}` : 'Created' }],
        notes: [],
      };
      const verb = task.kind === 'evidence-request' ? `requested evidence: “${task.title}”` : `created task “${task.title}”`;
      return {
        ...state,
        tasks: [task, ...state.tasks],
        activity: log(state, action, verb, { view: 'tracker', item: id }),
        notifications: [
          { id: `n-${action.uid}`, at: action.at, title: task.kind === 'evidence-request' ? 'Evidence requested' : 'Task created', body: `${task.title} · ${instName(task.ownerId)}`, ref: { view: 'tracker', item: id }, read: false },
          ...state.notifications,
        ],
      };
    }
    case 'moveTask': {
      const t = state.tasks.find((x) => x.id === action.id);
      if (!t || t.status === action.status) return state;
      return {
        ...state,
        tasks: updateTask(state, action.id, (x) => ({ ...x, status: action.status, history: [...x.history, { at: action.at, text: `Moved to ${statusLabel[action.status]}` }] })),
        activity: log(state, action, `moved “${t.title}” to ${statusLabel[action.status]}`, { view: 'tracker', item: action.id }),
      };
    }
    case 'assignTask': {
      const t = state.tasks.find((x) => x.id === action.id);
      if (!t || t.ownerId === action.ownerId) return state;
      return {
        ...state,
        tasks: updateTask(state, action.id, (x) => ({ ...x, ownerId: action.ownerId, history: [...x.history, { at: action.at, text: `Owner changed to ${instName(action.ownerId)}` }] })),
        activity: log(state, action, `assigned “${t.title}” to ${instName(action.ownerId)}`, { view: 'tracker', item: action.id }),
      };
    }
    case 'addNote': {
      const t = state.tasks.find((x) => x.id === action.id);
      return {
        ...state,
        tasks: updateTask(state, action.id, (x) => ({ ...x, notes: [...x.notes, { id: `n-${action.uid}`, at: action.at, author: ME, text: action.text }] })),
        activity: log(state, action, `commented on “${t?.title ?? ''}”`, { view: 'tracker', item: action.id }),
      };
    }
    case 'recommend': {
      const opt = S.options.find((o) => o.id === action.optionId);
      const taskId = `t-${action.uid}`;
      const task: Task = {
        id: taskId,
        kind: 'decision',
        title: `Decision recorded: recommend Option ${action.optionId} (${opt?.short ?? ''})`,
        description: action.rationale || 'Recommendation recorded from the decision brief.',
        ownerId: S.DEMO_USER.unitId,
        status: 'reviewed',
        start: action.at.slice(0, 10),
        due: action.at.slice(0, 10),
        history: [{ at: action.at, text: 'Recorded from the decision brief' }],
        notes: [],
      };
      const followUp: Task = {
        id: `t-${action.uid}f`,
        kind: 'task',
        title: `Schedule: ${S.recommendedStep.title}`,
        description: S.recommendedStep.text,
        ownerId: S.recommendedStep.ownerId,
        status: 'awaiting',
        start: action.at.slice(0, 10),
        due: S.recommendedStep.date,
        history: [{ at: action.at, text: `Created after recommending Option ${action.optionId}` }],
        notes: [],
      };
      return {
        ...state,
        decision: { optionId: action.optionId, rationale: action.rationale, at: action.at, taskId },
        tasks: [task, followUp, ...state.tasks.filter((t) => !t.title.startsWith('Decision recorded') && !t.title.startsWith('Schedule: '))],
        activity: log(state, action, `recommended Option ${action.optionId}: ${opt?.title ?? ''}`, { view: 'tracker', item: taskId }),
        notifications: [
          { id: `n-${action.uid}`, at: action.at, title: 'Decision recorded', body: `Option ${action.optionId} recommended. Next step added to the tracker.`, ref: { view: 'tracker', item: taskId }, read: false },
          ...state.notifications,
        ],
      };
    }
    case 'setWeight':
      return { ...state, weights: { ...state.weights, [action.id]: action.value } };
    case 'resetWeights':
      return { ...state, weights: defaultWeights() };
    case 'readNotification':
      return { ...state, notifications: state.notifications.map((n) => (n.id === action.id ? { ...n, read: true } : n)) };
    case 'readAll':
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) };
    case 'dismissBanner':
      return { ...state, bannerDismissed: true };
    case 'reset':
      return seedState();
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------

export interface DemoCtx { state: DemoState; dispatch: (a: Action) => void }
export const DemoContext = createContext<DemoCtx | null>(null);

export function useDemo(): DemoCtx {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo outside provider');
  return ctx;
}

let counter = 0;
/** Timestamp and unique id for a mutation. Call from event handlers only. */
export function stamp(): Stamp {
  counter += 1;
  return { at: new Date().toISOString(), uid: `${Date.now().toString(36)}${counter}` };
}

export interface ToastInput { title: string; body?: string; action?: { label: string; ref: Ref }; tone?: 'success' | 'info' }
export const ToastContext = createContext<(t: ToastInput) => void>(() => {});
export const useToast = () => useContext(ToastContext);

// ---------------------------------------------------------------------------

export const VIEWS: { id: View; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'brief', label: 'Decision brief' },
  { id: 'stakeholders', label: 'Stakeholders' },
  { id: 'tracker', label: 'Decision tracker' },
];

export function viewForItem(item: string): View {
  if (item.startsWith('ev-')) return 'evidence';
  if (item.startsWith('sh-')) return 'stakeholders';
  if (item.startsWith('t-')) return 'tracker';
  if (item.startsWith('opt-')) return 'brief';
  return 'dashboard';
}

/** URL-backed navigation: ?view=…&item=…&mode=… */
export function useNav() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const raw = params.get('view');
  const view: View = VIEWS.some((v) => v.id === raw) ? (raw as View) : 'dashboard';
  const item = params.get('item');
  const mode = params.get('mode');

  const build = useCallback((next: Record<string, string | null>) => {
    const p = new URLSearchParams(location.search);
    for (const [k, v] of Object.entries(next)) {
      if (v === null) p.delete(k); else p.set(k, v);
    }
    const s = p.toString();
    return `${location.pathname}${s ? `?${s}` : ''}`;
  }, [location.pathname, location.search]);

  return useMemo(() => ({
    view, item, mode, params,
    go(ref: Ref) {
      const base = `${location.pathname}?view=${ref.view}`;
      if (!ref.item) { navigate(base); return; }
      // Push the bare view first so closing the drawer (history back) lands on it.
      if (ref.view !== view || item) navigate(base);
      navigate(`${base}&item=${encodeURIComponent(ref.item)}`, { state: { drawer: true } });
    },
    open(itemId: string) {
      navigate(build({ item: itemId }), { state: { drawer: true } });
    },
    close() {
      const st = location.state as { drawer?: boolean } | null;
      if (st?.drawer && window.history.length > 1) navigate(-1);
      else navigate(build({ item: null }), { replace: true });
    },
    setMode(m: string | null) {
      navigate(build({ mode: m, item: null }), { replace: true });
    },
  }), [view, item, mode, params, navigate, location.pathname, location.state, build]);
}
