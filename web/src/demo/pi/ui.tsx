import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { useFocusTrap, useOutsideClose } from './hooks';
import { initials, instName, statusLabel, typeLabel } from './store';
import type { Confidence, EvidenceType, Priority, Stance, TaskStatus } from '../kazakhstanScenario';

function overlayRoot() {
  return document.getElementById('pi-overlay-root') ?? document.body;
}

// --- Drawer ----------------------------------------------------------------

export function Drawer({ title, eyebrow, meta, onClose, children, footer }: {
  title: string; eyebrow?: ReactNode; meta?: ReactNode; onClose: () => void; children: ReactNode; footer?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const trap = useFocusTrap(ref);
  const id = useId();
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
    trap(e);
  };
  return (
    <div className="pi-drawer-layer">
      <div className="pi-drawer-scrim" onClick={onClose} aria-hidden="true" />
      <div className="pi-drawer" role="dialog" aria-modal="true" aria-labelledby={id} ref={ref} tabIndex={-1} onKeyDown={onKey}>
        <header className="pi-drawer-head">
          <div className="pi-drawer-titles">
            {eyebrow && <div className="pi-drawer-eyebrow">{eyebrow}</div>}
            <h2 id={id}>{title}</h2>
            {meta && <div className="pi-drawer-meta">{meta}</div>}
          </div>
          <button type="button" className="pi-icon-btn" onClick={onClose} aria-label="Close panel" data-autofocus>
            <Icon name="x" size={18} />
          </button>
        </header>
        <div className="pi-drawer-body">{children}</div>
        {footer && <footer className="pi-drawer-foot">{footer}</footer>}
      </div>
    </div>
  );
}

export function Section({ title, children, aside }: { title: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="pi-dsec">
      <div className="pi-dsec-head"><h3>{title}</h3>{aside}</div>
      {children}
    </section>
  );
}

// --- Modal -----------------------------------------------------------------

export function Modal({ title, description, onClose, children, footer, size = 'md' }: {
  title: string; description?: ReactNode; onClose: () => void; children: ReactNode; footer: ReactNode; size?: 'md' | 'lg';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const trap = useFocusTrap(ref);
  const id = useId();
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
    trap(e);
  };
  return createPortal(
    <div className="pi-modal-layer" onKeyDown={onKey}>
      <div className="pi-modal-scrim" onClick={onClose} aria-hidden="true" />
      <div className={`pi-modal pi-modal-${size}`} role="dialog" aria-modal="true" aria-labelledby={id} ref={ref} tabIndex={-1}>
        <header className="pi-modal-head">
          <div>
            <h2 id={id}>{title}</h2>
            {description && <p className="pi-modal-desc">{description}</p>}
          </div>
          <button type="button" className="pi-icon-btn" onClick={onClose} aria-label="Close dialog"><Icon name="x" size={18} /></button>
        </header>
        <div className="pi-modal-body">{children}</div>
        <footer className="pi-modal-foot">{footer}</footer>
      </div>
    </div>,
    overlayRoot(),
  );
}

// --- Menu ------------------------------------------------------------------

export interface MenuItem { id: string; label: string; icon?: IconName; onSelect: () => void; checked?: boolean; disabled?: boolean; danger?: boolean; hint?: string }

export function Menu({ label, items, triggerClass = 'pi-icon-btn', triggerContent, align = 'end', header }: {
  label: string; items: MenuItem[]; triggerClass?: string; triggerContent: ReactNode; align?: 'start' | 'end'; header?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const id = useId();
  useOutsideClose([wrap], open, () => setOpen(false));

  useEffect(() => {
    if (open) list.current?.querySelector<HTMLElement>('[role="menuitem"]:not([disabled]), [role="menuitemradio"]:not([disabled])')?.focus();
  }, [open]);

  const move = (dir: 1 | -1 | 'first' | 'last') => {
    const els = [...(list.current?.querySelectorAll<HTMLElement>('[role^="menuitem"]:not([disabled])') ?? [])];
    if (!els.length) return;
    const i = els.indexOf(document.activeElement as HTMLElement);
    const next = dir === 'first' ? 0 : dir === 'last' ? els.length - 1 : (i + dir + els.length) % els.length;
    els[next].focus();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Home') { e.preventDefault(); move('first'); }
    else if (e.key === 'End') { e.preventDefault(); move('last'); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setOpen(false); trigger.current?.focus(); }
    else if (e.key === 'Tab') setOpen(false);
  };

  return (
    <div className="pi-menu-wrap" ref={wrap} onClick={(e) => e.stopPropagation()}>
      <button
        ref={trigger}
        type="button"
        className={triggerClass}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => { if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); } }}
      >
        {triggerContent}
      </button>
      {open && (
        <div className={`pi-menu pi-menu-${align}`} role="menu" id={id} aria-label={label} ref={list} onKeyDown={onKey}>
          {header}
          {items.map((it) => (
            <button
              key={it.id}
              type="button"
              role={it.checked === undefined ? 'menuitem' : 'menuitemradio'}
              aria-checked={it.checked}
              disabled={it.disabled}
              tabIndex={-1}
              className={`pi-menu-item${it.danger ? ' is-danger' : ''}`}
              onClick={() => { setOpen(false); trigger.current?.focus(); it.onSelect(); }}
            >
              {it.icon && <Icon name={it.icon} />}
              <span>{it.label}</span>
              {it.hint && <span className="pi-menu-hint">{it.hint}</span>}
              {it.checked && <Icon name="check" className="pi-menu-check" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Small display pieces ----------------------------------------------------

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <span className={`pi-status pi-status-${status}`}><i aria-hidden="true" />{statusLabel[status]}</span>;
}

export function PriorityBadge({ p }: { p: Priority }) {
  return <span className={`pi-prio pi-prio-${p}`}>{p === 'high' ? 'High' : p === 'medium' ? 'Medium' : 'Low'}</span>;
}

export function TypeBadge({ type }: { type: EvidenceType }) {
  return <span className={`pi-type pi-type-${type}`}>{typeLabel[type]}</span>;
}

export function ConfidenceMeter({ level, label = true }: { level: Confidence; label?: boolean }) {
  const n = level === 'high' ? 3 : level === 'medium' ? 2 : 1;
  return (
    <span className={`pi-conf pi-conf-${level}`} title={`${level} confidence`}>
      <span className="pi-conf-bars" aria-hidden="true">{[1, 2, 3].map((i) => <i key={i} className={i <= n ? 'on' : ''} />)}</span>
      {label ? <span className="pi-conf-label">{level[0].toUpperCase() + level.slice(1)}</span> : <span className="pi-sr">{level} confidence</span>}
    </span>
  );
}

export function StanceBadge({ stance }: { stance: Stance }) {
  return <span className={`pi-stance pi-stance-${stance.replace(' ', '-')}`}>{stance[0].toUpperCase() + stance.slice(1)}</span>;
}

export function OwnerChip({ id }: { id: string }) {
  const name = instName(id);
  return (
    <span className="pi-owner">
      <span className="pi-owner-dot" aria-hidden="true">{initials(name)}</span>
      {name}
    </span>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} className="pi-switch" onClick={onChange}>
      <span className="pi-switch-track" aria-hidden="true"><span className="pi-switch-thumb" /></span>
      <span>{label}</span>
    </button>
  );
}

export function Empty({ icon = 'inbox', title, children }: { icon?: IconName; title: string; children?: ReactNode }) {
  return (
    <div className="pi-empty">
      <span className="pi-empty-icon"><Icon name={icon} size={20} /></span>
      <strong>{title}</strong>
      {children && <p>{children}</p>}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions, eyebrow }: { title: string; subtitle?: ReactNode; actions?: ReactNode; eyebrow?: ReactNode }) {
  return (
    <div className="pi-page-head">
      <div>
        {eyebrow && <div className="pi-eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {subtitle && <p className="pi-page-sub">{subtitle}</p>}
      </div>
      {actions && <div className="pi-page-actions">{actions}</div>}
    </div>
  );
}

export function Segmented<T extends string>({ value, options, onChange, label }: {
  value: T; options: { id: T; label: string; icon?: IconName }[]; onChange: (v: T) => void; label: string;
}) {
  return (
    <div className="pi-seg" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          tabIndex={value === o.id ? 0 : -1}
          onClick={() => onChange(o.id)}
          onKeyDown={(e) => {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
            e.preventDefault();
            const i = options.findIndex((x) => x.id === value);
            const next = options[(i + (e.key === 'ArrowRight' ? 1 : -1) + options.length) % options.length];
            const group = e.currentTarget.parentElement;
            onChange(next.id);
            requestAnimationFrame(() => group?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus());
          }}
        >
          {o.icon && <Icon name={o.icon} />}{o.label}
        </button>
      ))}
    </div>
  );
}
