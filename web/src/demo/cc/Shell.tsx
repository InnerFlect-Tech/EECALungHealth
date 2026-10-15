import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { meta, regions, services, type ViewId } from '../careContinuityScenario';
import { Icon } from './icons';
import {
  PHASE_LABEL, SEVERITY_LABEL, TYPE_LABEL, VIEWS, actorById, districtById, districtLabel, regionById, viewLabel,
  type IconName,
} from './model';
import { useNav } from './nav';
import { useDemo, useToast } from './store';

// ───────────────────────── Sidebar ─────────────────────────

export function Sidebar({ open, mobile, onClose }: { open: boolean; mobile: boolean; onClose: () => void }) {
  const { view, go } = useNav();
  const { alerts, cases } = useDemo();
  const openAlerts = alerts.filter((a) => a.status !== 'resolved').length;
  const followUps = cases.filter((c) => c.status === 'follow-up').length;
  const badge: Partial<Record<ViewId, number>> = { alerts: openAlerts, caseload: followUps };
  const firstLink = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (mobile && open) firstLink.current?.focus();
  }, [mobile, open]);

  return (
    <aside
      id="cc-sidebar"
      className={`cc-sidebar ${open ? 'is-open' : ''}`}
      aria-label="Care Continuity navigation"
      inert={mobile && !open}
      onKeyDown={(e) => { if (mobile && e.key === 'Escape') onClose(); }}
    >
      <div className="cc-brand">
        <img src="/assets/images/brand/logo-mark-color.png" alt="" width={32} height={32} />
        <div className="cc-brand-text">
          <span className="cc-brand-hub">{meta.hub}</span>
          <span className="cc-brand-product">{meta.product}</span>
        </div>
        <button type="button" className="cc-icon-btn cc-icon-btn-dark cc-only-mobile" aria-label="Close navigation" onClick={onClose}>
          <Icon name="x" />
        </button>
      </div>

      <div className="cc-workspace">
        <span className="cc-workspace-dot" aria-hidden="true" />
        <span>{meta.scenario}</span>
      </div>

      <nav className="cc-nav" aria-label="Modules">
        <p className="cc-nav-label">Modules</p>
        <ul>
          {VIEWS.map((v, i) => (
            <li key={v.id}>
              <button
                ref={i === 0 ? firstLink : undefined}
                type="button"
                className={`cc-nav-item ${view === v.id ? 'is-active' : ''}`}
                aria-current={view === v.id ? 'page' : undefined}
                onClick={() => { go(v.id); onClose(); }}
              >
                <Icon name={v.icon} size={18} />
                <span className="cc-nav-text">{v.label}</span>
                {badge[v.id] ? <span className="cc-nav-badge cc-num" aria-label={`${badge[v.id]} open`}>{badge[v.id]}</span> : null}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="cc-sidebar-foot">
        <div className="cc-demo-pill" title={meta.banner}>
          <span className="cc-demo-dot" aria-hidden="true" />
          Demo · stub data
        </div>
        <Link to="/" className="cc-exit">
          <Icon name="logout" size={16} />
          Exit demo
        </Link>
      </div>
    </aside>
  );
}

// ───────────────────────── Search ─────────────────────────

interface SearchHit {
  key: string;
  kind: 'Region' | 'District' | 'Alert' | 'Case' | 'Service';
  icon: IconName;
  label: string;
  sub: string;
  hay: string;
  view: ViewId;
  extra: Record<string, string>;
}

function useSearchIndex(): SearchHit[] {
  const { alerts, cases } = useDemo();
  return useMemo(() => {
    const hits: SearchHit[] = [];
    regions.forEach((r) => hits.push({ key: r.id, kind: 'Region', icon: 'map', label: r.name, sub: r.setting, hay: `${r.name} ${r.short} region`, view: 'regions', extra: { item: r.id } }));
    districtById.forEach((d) => {
      const label = districtLabel(d.id);
      hits.push({ key: d.id, kind: 'District', icon: 'pin', label, sub: `${d.setting} · ${d.cohort} people`, hay: `${label} district ${d.letter} ${d.setting}`, view: 'regions', extra: { item: d.id } });
    });
    alerts.forEach((a) => hits.push({ key: a.id, kind: 'Alert', icon: 'alert', label: a.title, sub: `${SEVERITY_LABEL[a.severity]} · ${a.scope}`, hay: `${a.title} ${a.scope} ${TYPE_LABEL[a.type]} ${a.id} ${a.severity}`, view: 'alerts', extra: { item: a.id } }));
    cases.forEach((c) => hits.push({ key: c.id, kind: 'Case', icon: 'user', label: c.id, sub: `${districtLabel(c.districtId)} · ${PHASE_LABEL[c.phase]} · ${c.worker}`, hay: `${c.id} ${districtLabel(c.districtId)} ${c.worker} ${c.phase} ${c.flags.join(' ')} synthetic case`, view: 'caseload', extra: { item: c.id } }));
    services.forEach((s) => hits.push({ key: s.id, kind: 'Service', icon: 'sparkle', label: s.name, sub: s.what, hay: `${s.name} ${s.short} ${s.what} service`, view: 'journey', extra: { service: s.id } }));
    return hits;
  }, [alerts, cases]);
}

function filterHits(index: SearchHit[], q: string) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const matched = index.filter((h) => terms.every((t) => h.hay.toLowerCase().includes(t) || h.label.toLowerCase().includes(t)));
  const perKind = new Map<string, number>();
  return matched.filter((h) => {
    const n = perKind.get(h.kind) ?? 0;
    perKind.set(h.kind, n + 1);
    return n < 4;
  }).slice(0, 14);
}

function Search({ compact, onDone }: { compact: boolean; onDone?: () => void }) {
  const { go } = useNav();
  const index = useSearchIndex();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const hits = useMemo(() => filterHits(index, q), [index, q]);
  const showList = open && q.trim().length > 0;

  useEffect(() => {
    if (compact) inputRef.current?.focus();
  }, [compact]);

  useEffect(() => {
    if (compact) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable;
      if ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey))) {
        if (document.querySelector('.cc-modal-layer')) return;
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [compact]);

  useEffect(() => {
    if (!showList) return;
    const onDown = (e: PointerEvent) => { if (!wrapRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [showList]);

  const choose = (h: SearchHit) => {
    go(h.view, h.extra);
    setQ('');
    setOpen(false);
    inputRef.current?.blur();
    onDone?.();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, hits.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter' && hits[active]) { e.preventDefault(); choose(hits[active]); }
    else if (e.key === 'Escape') {
      e.stopPropagation();
      if (q) { setQ(''); } else { inputRef.current?.blur(); onDone?.(); }
      setOpen(false);
    }
  };

  return (
    <div className={`cc-search ${compact ? 'is-compact' : ''}`} ref={wrapRef}>
      <Icon name="search" size={16} className="cc-search-icon" />
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && hits[active] ? `${listId}-${hits[active].key}` : undefined}
        aria-label="Search regions, districts, alerts, cases and services"
        placeholder="Search districts, alerts, cases…"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {!compact && !q && <kbd className="cc-kbd" aria-hidden="true">/</kbd>}
      {compact && (
        <button type="button" className="cc-icon-btn" aria-label="Close search" onClick={() => onDone?.()}>
          <Icon name="x" size={16} />
        </button>
      )}
      {showList && (
        <div className="cc-search-pop">
          <ul id={listId} role="listbox" aria-label="Search results">
            {hits.map((h, i) => {
              const header = i === 0 || hits[i - 1].kind !== h.kind;
              return (
                <li key={h.key} role="presentation">
                  {header && <div className="cc-search-group" role="presentation">{h.kind === 'Case' ? 'Synthetic cases' : `${h.kind === 'Alert' ? 'Alerts' : h.kind + 's'}`}</div>}
                  <div
                    id={`${listId}-${h.key}`}
                    role="option"
                    aria-selected={i === active}
                    className={`cc-search-hit ${i === active ? 'is-active' : ''}`}
                    onPointerDown={(e) => e.preventDefault()}
                    onClick={() => choose(h)}
                    onPointerEnter={() => setActive(i)}
                  >
                    <span className="cc-search-hit-icon"><Icon name={h.icon} size={15} /></span>
                    <span className="cc-search-hit-text">
                      <span className="cc-search-hit-label">{h.label}</span>
                      <span className="cc-search-hit-sub">{h.sub}</span>
                    </span>
                    <Icon name="arrow-right" size={14} className="cc-search-hit-go" />
                  </div>
                </li>
              );
            })}
          </ul>
          {hits.length === 0 && <p className="cc-search-empty">No matches for “{q}”. Try “South”, “SYN-01” or “vouchers”.</p>}
        </div>
      )}
    </div>
  );
}

// ───────────────────────── Menus ─────────────────────────

function useMenu() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const first = menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]');
    first?.focus();
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !btnRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const onMenuKey = (e: KeyboardEvent) => {
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length]?.focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length]?.focus(); }
    else if (e.key === 'Home') { e.preventDefault(); items[0]?.focus(); }
    else if (e.key === 'End') { e.preventDefault(); items[items.length - 1]?.focus(); }
    else if (e.key === 'Escape' || e.key === 'Tab') {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); btnRef.current?.focus(); }
      setOpen(false);
    }
  };
  const close = (refocus = true) => { setOpen(false); if (refocus) btnRef.current?.focus(); };
  return { open, setOpen, btnRef, menuRef, onMenuKey, close };
}

function Notifications() {
  const { notifications, unread, markRead, markAllRead } = useDemo();
  const { go } = useNav();
  const { open, setOpen, btnRef, menuRef, onMenuKey, close } = useMenu();
  const menuId = useId();
  return (
    <div className="cc-popover-wrap">
      <button
        ref={btnRef}
        type="button"
        className="cc-icon-btn cc-bell"
        aria-label={`Notifications, ${unread} unread`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(!open)}
      >
        <Icon name="bell" />
        {unread > 0 && <span className="cc-bell-count cc-num" aria-hidden="true">{unread}</span>}
      </button>
      {open && (
        <div ref={menuRef} id={menuId} className="cc-popover cc-notif" role="menu" aria-label="Notifications" onKeyDown={onMenuKey}>
          <div className="cc-popover-head" role="presentation">
            <span>Notifications</span>
            <button type="button" role="menuitem" className="cc-link-btn" onClick={() => { markAllRead(); }}>Mark all as read</button>
          </div>
          <div className="cc-notif-list" role="presentation">
            {notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                role="menuitem"
                className={`cc-notif-item ${n.read ? '' : 'is-unread'}`}
                onClick={() => {
                  markRead(n.id);
                  close(false);
                  go(n.view, n.item ? { item: n.item } : {});
                }}
              >
                <span className={`cc-notif-icon cc-notif-${n.tone}`} aria-hidden="true">
                  <Icon name={n.tone === 'alert' ? 'alert' : n.tone === 'case' ? 'user' : 'info'} size={14} />
                </span>
                <span className="cc-notif-text">
                  <span>{n.text}</span>
                  <span className="cc-notif-ago">{n.ago}{n.read ? '' : ' · unread'}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AvatarMenu({ onReset }: { onReset: () => void }) {
  const { open, setOpen, btnRef, menuRef, onMenuKey, close } = useMenu();
  const menuId = useId();
  return (
    <div className="cc-popover-wrap">
      <button
        ref={btnRef}
        type="button"
        className="cc-avatar-btn"
        aria-label={`Account: ${meta.user.role}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(!open)}
      >
        <span className="cc-avatar" aria-hidden="true">{meta.user.initials}</span>
        <Icon name="chevron-down" size={14} className="cc-avatar-caret" />
      </button>
      {open && (
        <div ref={menuRef} id={menuId} className="cc-popover cc-account" role="menu" aria-label="Account" onKeyDown={onMenuKey}>
          <div className="cc-account-head" role="presentation">
            <span className="cc-avatar cc-avatar-lg" aria-hidden="true">{meta.user.initials}</span>
            <div>
              <div className="cc-account-role">{meta.user.role}</div>
              <div className="cc-account-org">{meta.user.org}</div>
            </div>
          </div>
          <div className="cc-menu-sep" role="separator" />
          <button type="button" role="menuitem" className="cc-menu-item" onClick={() => { close(); onReset(); }}>
            <Icon name="reset" size={16} /> Reset demo data
          </button>
          <Link to="/" role="menuitem" className="cc-menu-item">
            <Icon name="logout" size={16} /> Exit demo
          </Link>
        </div>
      )}
    </div>
  );
}

// ───────────────────────── Top bar ─────────────────────────

function itemLabel(item: string, getAlertTitle: (id: string) => string | undefined): string {
  if (item.startsWith('rg-')) return regionById.get(item as never)?.name ?? item;
  if (item.startsWith('ds-')) return districtLabel(item);
  if (item.startsWith('al-')) return `${item.toUpperCase()} · ${getAlertTitle(item) ?? ''}`;
  if (item.startsWith('ac-')) return actorById.get(item)?.name ?? item;
  return item;
}

export function Topbar({ onMenu, menuOpen, mobile }: { onMenu: () => void; menuOpen: boolean; mobile: boolean }) {
  const { view, item, close } = useNav();
  const { getAlert, reset } = useDemo();
  const toast = useToast();
  const [searchOpen, setSearchOpen] = useState(false);
  const crumb: ReactNode = item ? itemLabel(item, (id) => getAlert(id)?.title) : null;

  const onReset = () => {
    reset();
    close();
    toast('Demo data reset. All changes cleared.', 'info');
  };

  return (
    <header className={`cc-topbar ${searchOpen && mobile ? 'is-searching' : ''}`}>
      <button type="button" className="cc-icon-btn cc-only-mobile" aria-label="Open navigation" aria-expanded={menuOpen} aria-controls="cc-sidebar" onClick={onMenu}>
        <Icon name="menu" />
      </button>
      <nav className="cc-crumbs" aria-label="Breadcrumb">
        <ol>
          <li className="cc-crumb-root cc-only-desktop">{meta.product}</li>
          <li>
            {item ? (
              <button type="button" className="cc-crumb-link" onClick={() => close()}>{viewLabel(view)}</button>
            ) : (
              <span aria-current="page" className="cc-crumb-current">{viewLabel(view)}</span>
            )}
          </li>
          {crumb && <li className="cc-crumb-item-li"><span aria-current="page" className="cc-crumb-current cc-crumb-item">{crumb}</span></li>}
        </ol>
      </nav>

      <div className="cc-topbar-right">
        <div className="cc-only-desktop cc-search-slot"><Search compact={false} /></div>
        {mobile && searchOpen ? (
          <Search compact onDone={() => setSearchOpen(false)} />
        ) : (
          <button type="button" className="cc-icon-btn cc-only-mobile" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <Icon name="search" />
          </button>
        )}
        <span className="cc-scenario-chip cc-only-desktop" title="Scenario">
          <span className="cc-flag" aria-hidden="true" />
          {meta.scenario}
        </span>
        <Notifications />
        <AvatarMenu onReset={onReset} />
      </div>
    </header>
  );
}
