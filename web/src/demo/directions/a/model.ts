// Direction A, "Committee Paper": shared state, context and small helpers.
// Everything here is UI state over the stub scenario; nothing is persisted.

import { createContext, useContext } from 'react';
import { institutions, questions, tasks, evidence } from '../../kazakhstanScenario';
import type { OptionId, TaskStatus } from '../../kazakhstanScenario';

export type ChangeStatus = 'pending' | 'accepted' | 'rejected';

/** A tracked change since v0.2. Illustrative wording, invented for the demo. */
export interface TrackedChange {
  id: string;
  del?: string;
  ins?: string;
  by: string; // institution id
  at: string; // ISO date-time
}

export const CHANGES: Record<string, TrackedChange> = {
  c1: { id: 'c1', del: 'the end of the spring session', ins: '31 March 2027 (illustrative)', by: 'secretariat', at: '2026-10-13T10:42:00+05:00' },
  c2: { id: 'c2', ins: ', taken from a demo costing model and not an official estimate', by: 'mof', at: '2026-10-14T09:15:00+05:00' },
  c3: { id: 'c3', ins: ' Until these gaps are filled, every figure in this paper should be read as indicative.', by: 'research', at: '2026-10-14T16:05:00+05:00' },
  c4: {
    id: 'c4',
    del: 'Option B is the preferred option.',
    ins: 'Option B offers the fastest route to continuity, subject to regional capacity; Option C is the most durable but the slowest.',
    by: 'research',
    at: '2026-10-12T10:20:00+05:00',
  },
  c5: { id: 'c5', ins: ' and a legal opinion on social contracting', by: 'legal', at: '2026-10-08T14:10:00+05:00' },
  c6: { id: 'c6', del: 'in the spring session', ins: 'before the budget planning window closes', by: 'mof', at: '2026-10-14T09:20:00+05:00' },
  c7: { id: 'c7', ins: ' Scope the insurance pathway as a medium-term option.', by: 'shif', at: '2026-10-13T11:30:00+05:00' },
};
export const CHANGE_IDS = Object.keys(CHANGES);

export interface LogEntry { id: string; at: string; actor: string; text: string; fresh?: boolean }

export interface PaperState {
  showChanges: boolean;
  changes: Record<string, ChangeStatus>;
  open: Record<string, boolean>;
  qStatus: Record<string, 'open' | 'answered'>;
  qOwner: Record<string, string>;
  tStatus: Record<string, TaskStatus>;
  tOwner: Record<string, string>;
  requested: Record<string, boolean>;
  inBrief: Record<string, boolean>;
  preference: OptionId | null;
  hot: string | null;
  log: LogEntry[];
}

export function initialState(): PaperState {
  return {
    showChanges: false,
    changes: Object.fromEntries(CHANGE_IDS.map((id) => [id, 'pending' as ChangeStatus])),
    open: {},
    qStatus: Object.fromEntries(questions.map((q) => [q.id, q.status])),
    qOwner: Object.fromEntries(questions.map((q) => [q.id, q.ownerId])),
    tStatus: Object.fromEntries(tasks.map((t) => [t.id, t.status])),
    tOwner: Object.fromEntries(tasks.map((t) => [t.id, t.ownerId])),
    requested: {},
    inBrief: Object.fromEntries(evidence.map((e) => [e.id, e.inBrief])),
    preference: null,
    hot: null,
    log: [],
  };
}

export interface PaperApi {
  s: PaperState;
  toggleNote: (id: string) => void;
  jumpTo: (id: string) => void;
  setHot: (id: string | null) => void;
  resolveChange: (id: string, to: 'accepted' | 'rejected') => void;
  setQuestion: (id: string, status: 'open' | 'answered') => void;
  assignQuestion: (id: string, owner: string) => void;
  setTask: (id: string, status: TaskStatus) => void;
  assignTask: (id: string, owner: string) => void;
  requestGap: (id: string) => void;
  toggleBrief: (id: string) => void;
  setPreference: (id: OptionId) => void;
}

export const PaperContext = createContext<PaperApi | null>(null);

export function usePaper(): PaperApi {
  const api = useContext(PaperContext);
  if (!api) throw new Error('usePaper outside PaperContext');
  return api;
}

// ---------------------------------------------------------------------------

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function fmtDate(iso: string, opts: { year?: boolean; long?: boolean } = {}): string {
  const [y, m, d] = iso.slice(0, 10).split('-');
  const month = (opts.long ? MONTHS_LONG : MONTHS)[Number(m) - 1];
  return `${Number(d)} ${month}${opts.year === false ? '' : ` ${y}`}`;
}

export const fmtTime = (iso: string) => iso.slice(11, 16);

export const instShort = (id: string) => institutions.find((i) => i.id === id)?.short ?? id;

export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');

/** Short reference used in the text and the margin: Q1, E10, T5. */
export function refOf(id: string): string {
  if (id.startsWith('q-')) return `Q${questions.findIndex((q) => q.id === id) + 1}`;
  if (id.startsWith('ev-')) return `E${id.slice(3)}`;
  if (id.startsWith('t-')) return `T${id.slice(2)}`;
  return id;
}

export const STATUS_LABEL: Record<TaskStatus, string> = {
  reviewed: 'Done',
  'in-progress': 'In progress',
  awaiting: 'Awaiting',
  blocked: 'Blocked',
};
