import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function focusables(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null || el === document.activeElement);
}

/**
 * Traps Tab focus inside `ref` while mounted, focuses the first element marked
 * data-autofocus (or the container), and returns focus to whatever was focused
 * before on unmount.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    if (root) {
      const target = root.querySelector<HTMLElement>('[data-autofocus]') ?? root;
      requestAnimationFrame(() => target.focus({ preventScroll: true }));
    }
    return () => {
      if (previous && document.contains(previous)) previous.focus({ preventScroll: true });
    };
  }, [ref]);

  return useCallback((e: ReactKeyboardEvent) => {
    if (e.key !== 'Tab' || !ref.current) return;
    const items = focusables(ref.current);
    if (!items.length) { e.preventDefault(); return; }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === ref.current)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
  }, [ref]);
}

/** Calls onClose on a pointer-down outside any of the given elements. */
export function useOutsideClose(refs: RefObject<HTMLElement | null>[], open: boolean, onClose: () => void) {
  const cb = useRef(onClose);
  useEffect(() => { cb.current = onClose; });
  useEffect(() => {
    if (!open) return;
    const handler = (e: PointerEvent) => {
      const t = e.target as Node;
      if (refs.some((r) => r.current?.contains(t))) return;
      cb.current();
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
}

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (fn) => {
      const m = window.matchMedia(query);
      m.addEventListener('change', fn);
      return () => m.removeEventListener('change', fn);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
