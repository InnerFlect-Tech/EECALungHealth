import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './icons';
import { portalTarget } from './store';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function trapTab(e: KeyboardEvent, root: HTMLElement | null) {
  if (e.key !== 'Tab' || !root) return;
  const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null || el === document.activeElement);
  if (!items.length) { e.preventDefault(); return; }
  const first = items[0];
  const lastEl = items[items.length - 1];
  if (e.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) { e.preventDefault(); lastEl.focus(); }
  else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
}

/** Remembers the element focused before mount and restores it on unmount. */
function useReturnFocus() {
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    return () => {
      if (prev && prev.isConnected && typeof prev.focus === 'function') prev.focus({ preventScroll: true });
    };
  }, []);
}

interface DrawerProps {
  /** Changes when the drawer shows a different item, so focus moves to the new heading. */
  itemKey: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function Drawer({ itemKey, eyebrow, title, meta, onClose, children, footer }: DrawerProps) {
  const ref = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  useReturnFocus();

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    bodyRef.current?.scrollTo({ top: 0 });
  }, [itemKey]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
    trapTab(e, ref.current);
  };

  return (
    <div className="cc-drawer-layer">
      <div className="cc-scrim" onClick={onClose} aria-hidden="true" />
      <aside ref={ref} className="cc-drawer" role="dialog" aria-modal="true" aria-labelledby={labelId} onKeyDown={onKeyDown}>
        <header className="cc-drawer-head">
          <div className="cc-drawer-titles">
            {eyebrow && <div className="cc-drawer-eyebrow">{eyebrow}</div>}
            <h2 id={labelId} ref={headingRef} tabIndex={-1} className="cc-drawer-title">{title}</h2>
            {meta && <div className="cc-drawer-meta">{meta}</div>}
          </div>
          <button type="button" className="cc-icon-btn" onClick={onClose} aria-label="Close panel">
            <Icon name="x" />
          </button>
        </header>
        <div className="cc-drawer-body" ref={bodyRef}>{children}</div>
        {footer && <footer className="cc-drawer-foot">{footer}</footer>}
      </aside>
    </div>
  );
}

interface ModalProps {
  title: ReactNode;
  description?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ title, description, onClose, children, footer, size = 'sm' }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const descId = useId();
  useReturnFocus();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const auto = root.querySelector<HTMLElement>('[data-autofocus]') ?? root.querySelector<HTMLElement>(FOCUSABLE);
    (auto ?? root).focus({ preventScroll: true });
  }, []);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
    e.stopPropagation();
    trapTab(e, ref.current);
  };

  return createPortal(
    <div className="cc-modal-layer" onKeyDown={onKeyDown}>
      <div className="cc-scrim cc-scrim-strong" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        className={`cc-modal cc-modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
      >
        <header className="cc-modal-head">
          <div>
            <h2 id={labelId} className="cc-modal-title">{title}</h2>
            {description && <p id={descId} className="cc-modal-desc">{description}</p>}
          </div>
          <button type="button" className="cc-icon-btn" onClick={onClose} aria-label="Close dialog">
            <Icon name="x" />
          </button>
        </header>
        <div className="cc-modal-body">{children}</div>
        {footer && <footer className="cc-modal-foot">{footer}</footer>}
      </div>
    </div>,
    portalTarget(),
  );
}
