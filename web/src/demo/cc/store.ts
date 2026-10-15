// Demo state: user actions (acknowledge, assign, notes, follow-ups...) are kept
// as overrides on top of the stub data, persisted in sessionStorage, and can be
// cleared with "Reset demo data". The provider lives in DemoProvider.tsx.

import { createContext, useContext } from 'react';
import type {
  Alert, AlertStatus, CaseRecord, CaseStatus, Comment, ContactEntry, Notification, RiskLevel,
} from '../careContinuityScenario';

export const STORAGE_KEY = 'cc-demo-state-v1';

export interface AlertOverride {
  status?: AlertStatus;
  assignee?: string | null;
  comments?: Comment[];
  actionsDone?: number[];
}

export interface CaseOverride {
  status?: CaseStatus;
  risk?: RiskLevel;
  contacts?: ContactEntry[];
  nextFollowUp?: string | null;
  followUpType?: string;
  lastContact?: string;
  escalated?: boolean;
}

export interface DemoState {
  v: 1;
  alerts: Record<string, AlertOverride>;
  cases: Record<string, CaseOverride>;
  readNotifications: string[];
  extraNotifications: Notification[];
  bannerDismissed: boolean;
  seq: number; // for unique ids of user-created entries
}

export const emptyState = (): DemoState => ({
  v: 1, alerts: {}, cases: {}, readNotifications: [], extraNotifications: [], bannerDismissed: false, seq: 0,
});

export function loadState(): DemoState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as DemoState;
    return parsed && parsed.v === 1 ? { ...emptyState(), ...parsed } : emptyState();
  } catch {
    return emptyState();
  }
}

export function saveState(s: DemoState) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* private mode: keep in memory */ }
}

export interface CaseView extends CaseRecord {
  addedContacts: ContactEntry[];
  escalated: boolean;
  followUpType?: string;
}

export interface AlertView extends Alert {
  actionsDone: number[];
}

export interface DemoApi {
  state: DemoState;
  alerts: AlertView[];
  cases: CaseView[];
  getAlert: (id: string) => AlertView | undefined;
  getCase: (id: string) => CaseView | undefined;
  notifications: (Notification & { read: boolean })[];
  unread: number;
  updateAlert: (id: string, patch: Pick<AlertOverride, 'status' | 'assignee'>, comment?: { author: string; text: string }) => void;
  addAlertComment: (id: string, text: string) => void;
  toggleAlertAction: (id: string, index: number) => void;
  updateCase: (id: string, patch: Omit<CaseOverride, 'contacts'>, entry?: Omit<ContactEntry, 'id'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  pushNotification: (n: Omit<Notification, 'id'>) => void;
  dismissBanner: () => void;
  reset: () => void;
}

export const DemoContext = createContext<DemoApi | null>(null);

export function useDemo(): DemoApi {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used inside DemoProvider');
  return ctx;
}

// ── Toasts ──
export interface Toast { id: number; text: string; tone: 'success' | 'info' | 'warn'; }
export const ToastContext = createContext<(text: string, tone?: Toast['tone']) => void>(() => {});
export const useToast = () => useContext(ToastContext);

// ── Portal target for modals (inside .cc-app so theme tokens apply) ──
export const portalTarget = () => document.getElementById('cc-layer') ?? document.body;
