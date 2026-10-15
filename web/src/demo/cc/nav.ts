// Navigation state lives in URL search params so every view and drill-down is
// deep-linkable and the browser back button works:
//   ?view=alerts&item=al-3      view + open drawer item
//   ?view=caseload&district=ds-south-c
//   ?view=journey&stage=intensive&service=vot
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ViewId } from '../careContinuityScenario';
import { VIEW_IDS } from './model';

/** Params that belong to one view and are dropped when switching views. */
const VIEW_PARAMS = ['item', 'district', 'stage', 'service', 'severity', 'type', 'status', 'q', 'pathway', 'region', 'phase', 'risk', 'worker'];

export interface GoOptions { replace?: boolean }

export function useNav() {
  const [params, setParams] = useSearchParams();
  const raw = params.get('view') as ViewId | null;
  const view: ViewId = raw && VIEW_IDS.includes(raw) ? raw : 'overview';
  const item = params.get('item');

  /** Navigate to a view (clearing that view's params) and optionally open an item. */
  const go = useCallback((next: ViewId, extra: Record<string, string | null | undefined> = {}, opts: GoOptions = {}) => {
    setParams((prev) => {
      const p = new URLSearchParams(prev);
      if (next !== (prev.get('view') ?? 'overview')) VIEW_PARAMS.forEach((k) => p.delete(k));
      if (next === 'overview') p.delete('view'); else p.set('view', next);
      Object.entries(extra).forEach(([k, v]) => (v == null || v === '' ? p.delete(k) : p.set(k, v)));
      return p;
    }, { replace: opts.replace });
  }, [setParams]);

  /** Set params on the current view without clearing the rest. */
  const set = useCallback((extra: Record<string, string | null | undefined>, opts: GoOptions = {}) => {
    setParams((prev) => {
      const p = new URLSearchParams(prev);
      Object.entries(extra).forEach(([k, v]) => (v == null || v === '' ? p.delete(k) : p.set(k, v)));
      return p;
    }, { replace: opts.replace });
  }, [setParams]);

  const open = useCallback((id: string) => set({ item: id }), [set]);
  const close = useCallback(() => set({ item: null }), [set]);

  return useMemo(() => ({ view, item, params, go, set, open, close }), [view, item, params, go, set, open, close]);
}
