import { useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, RefObject } from 'react';
import { Link } from 'react-router-dom';
import * as S from '../kazakhstanScenario';
import type { View } from '../kazakhstanScenario';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { focusables, useOutsideClose } from './hooks';
import { Menu } from './ui';
import { VIEWS, useDemo, useNav, useToast } from './store';
import { buildIndex, search } from './search';
import { relTime, useNow } from './format';

const NAV_ICON: Record<View, IconName> = {
  dashboard: 'dashboard', evidence: 'evidence', brief: 'brief', stakeholders: 'stakeholders', tracker: 'tracker',
};

// --- Sidebar ----------------------------------------------------------------

export function Sidebar({ open, mobile, onClose, asideRef }: {
  open: boolean; mobile: boolean; onClose: () => void; asideRef: RefObject<HTMLElement | null>;
}) {
  const { state } = useDemo();
  const nav = useNav();
  const counts: Partial<Record<View, number>> = {
    dashboard: state.questions.filter((q) => q.status === 'open').length,
    evidence: S.evidence.length,
    stakeholders: S.stakeholderProfiles.length,
    tracker: state.tasks.filter((t) => t.status !== 'reviewed').length,
  };
  const onKey = (e: KeyboardEvent) => {
    if (!mobile || !open) return;
    if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
    if (e.key === 'Tab' && asideRef.current) {
      const items = focusables(asideRef.current);
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
  return (
    <>
      {mobile && open && <div className="pi-nav-scrim" onClick={onClose} aria-hidden="true" />}
      <aside
        className={`pi-sidebar${open ? ' is-open' : ''}`}
        ref={asideRef}
        inert={mobile && !open}
        aria-label="Demo navigation"
        role={mobile && open ? 'dialog' : undefined}
        aria-modal={mobile && open ? true : undefined}
        onKeyDown={onKey}
      >
        <div className="pi-brand">
          <img src="/assets/images/brand/logo-mark-color.png" alt="" width={32} height={32} />
          <div>
            <span className="pi-brand-name">EECA Hub</span>
            <span className="pi-brand-product">Parliamentary Intelligence</span>
          </div>
          {mobile && (
            <button type="button" className="pi-icon-btn pi-on-dark" onClick={onClose} aria-label="Close navigation"><Icon name="x" size={18} /></button>
          )}
        </div>

        <div className="pi-side-issue">
          <span className="pi-side-label">Active issue</span>
          <button type="button" className="pi-side-issue-card" onClick={() => { nav.go({ view: 'dashboard' }); onClose(); }}>
            <span className="pi-side-issue-ref">{S.issue.ref}</span>
            <span className="pi-side-issue-title">TB patient-support financing</span>
          </button>
        </div>

        <nav className="pi-nav" aria-label="Modules">
          <span className="pi-side-label">Workspace</span>
          <ul>
            {VIEWS.map((v) => (
              <li key={v.id}>
                <a
                  href={`?view=${v.id}`}
                  className={nav.view === v.id ? 'is-active' : ''}
                  aria-current={nav.view === v.id ? 'page' : undefined}
                  onClick={(e) => { e.preventDefault(); nav.go({ view: v.id }); onClose(); }}
                >
                  <Icon name={NAV_ICON[v.id]} size={18} />
                  <span>{v.label}</span>
                  {counts[v.id] !== undefined && <span className="pi-nav-count">{counts[v.id]}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pi-side-foot">
          <span className="pi-demo-pill" title="Figures, dates, documents and stakeholder positions are illustrative">
            <i aria-hidden="true" />Demo · stub data
          </span>
          <Link to="/" className="pi-exit"><Icon name="exit" size={16} />Exit demo</Link>
        </div>
      </aside>
    </>
  );
}

// --- Search -----------------------------------------------------------------

function SearchBox({ compact, onDone }: { compact?: boolean; onDone?: () => void }) {
  const { state } = useDemo();
  const nav = useNav();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();
  const index = useMemo(() => buildIndex(state), [state]);
  const results = useMemo(() => search(index, q), [index, q]);
  useOutsideClose([wrap], open, () => setOpen(false));

  const choose = (i: number) => {
    const r = results[i];
    if (!r) return;
    nav.go(r.ref);
    setQ(''); setOpen(false); setActive(0);
    input.current?.blur();
    onDone?.();
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(active); }
    else if (e.key === 'Escape') { e.stopPropagation(); if (q) setQ(''); else { setOpen(false); onDone?.(); } }
  };
  const showList = open && q.trim().length > 0;
  return (
    <div className={`pi-search${compact ? ' is-compact' : ''}`} ref={wrap}>
      <Icon name="search" className="pi-search-icon" />
      <input
        ref={input}
        type="search"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && results[active] ? `${listId}-${active}` : undefined}
        aria-label="Search evidence, questions, stakeholders and tasks"
        placeholder="Search evidence, questions, stakeholders…"
        value={q}
        autoFocus={compact}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
      />
      {!compact && <kbd className="pi-kbd" aria-hidden="true">/</kbd>}
      {showList && (
        <div className="pi-search-pop">
          {results.length ? (
            <ul role="listbox" id={listId} aria-label="Search results">
              {results.map((r, i) => (
                <li
                  key={r.id}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  className={i === active ? 'is-active' : ''}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(i)}
                >
                  <span className="pi-search-ico"><Icon name={r.icon} /></span>
                  <span className="pi-search-text">
                    <span className="pi-search-title">{r.title}</span>
                    <span className="pi-search-sub">{r.sub}</span>
                  </span>
                  <span className="pi-search-kind">{r.kind}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="pi-search-empty" id={listId}>No matches for “{q}”. Try “costing”, “akimat” or “insurance”.</p>
          )}
          <div className="pi-search-foot"><span><kbd>↑</kbd><kbd>↓</kbd> to move</span><span><kbd>↵</kbd> to open</span><span><kbd>esc</kbd> to close</span></div>
        </div>
      )}
    </div>
  );
}

// --- Notifications ------------------------------------------------------------

function Notifications() {
  const { state, dispatch } = useDemo();
  const nav = useNav();
  const now = useNow();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const id = useId();
  useOutsideClose([wrap], open, () => setOpen(false));
  const unread = state.notifications.filter((n) => !n.read).length;
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); btn.current?.focus(); }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const els = [...(wrap.current?.querySelectorAll<HTMLElement>('.pi-notif-item') ?? [])];
      const i = els.indexOf(document.activeElement as HTMLElement);
      els[(i + (e.key === 'ArrowDown' ? 1 : -1) + els.length) % els.length]?.focus();
    }
  };
  return (
    <div className="pi-menu-wrap" ref={wrap} onKeyDown={onKey}>
      <button
        ref={btn}
        type="button"
        className="pi-icon-btn pi-bell"
        aria-label={`Notifications, ${unread} unread`}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="bell" size={18} />
        {unread > 0 && <span className="pi-badge-count" aria-hidden="true">{unread}</span>}
      </button>
      {open && (
        <div className="pi-pop pi-notif" id={id} role="region" aria-label="Notifications">
          <div className="pi-pop-head">
            <strong>Notifications</strong>
            <button type="button" className="pi-link-btn" onClick={() => dispatch({ type: 'readAll' })} disabled={!unread}>Mark all read</button>
          </div>
          <ul>
            {state.notifications.slice(0, 8).map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  className={`pi-notif-item${n.read ? '' : ' is-unread'}`}
                  onClick={() => { dispatch({ type: 'readNotification', id: n.id }); setOpen(false); nav.go(n.ref); }}
                >
                  <span className="pi-notif-dot" aria-hidden="true" />
                  <span className="pi-notif-text">
                    <strong>{n.title}</strong>
                    <span>{n.body}</span>
                    <time dateTime={n.at}>{relTime(n.at, now)}</time>
                  </span>
                  {!n.read && <span className="pi-sr">Unread</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// --- Top bar ------------------------------------------------------------------

export function Topbar({ onMenu, mobile, crumb }: { onMenu: () => void; mobile: boolean; crumb: string | null }) {
  const { dispatch } = useDemo();
  const nav = useNav();
  const toast = useToast();
  const [searching, setSearching] = useState(false);
  const label = VIEWS.find((v) => v.id === nav.view)?.label ?? '';

  if (mobile && searching) {
    return (
      <header className="pi-topbar is-searching">
        <SearchBox compact onDone={() => setSearching(false)} />
        <button type="button" className="pi-btn pi-btn-ghost" onClick={() => setSearching(false)}>Cancel</button>
      </header>
    );
  }

  return (
    <header className="pi-topbar">
      {mobile && (
        <button type="button" className="pi-icon-btn" onClick={onMenu} aria-label="Open navigation"><Icon name="menu" size={20} /></button>
      )}
      <nav className="pi-crumbs" aria-label="Breadcrumb">
        <ol>
          {!mobile && <li><span className="pi-crumb-root">Parliamentary Intelligence</span></li>}
          <li>
            {crumb ? (
              <a href={`?view=${nav.view}`} onClick={(e) => { e.preventDefault(); nav.close(); }}>{label}</a>
            ) : <span aria-current="page">{label}</span>}
          </li>
          {crumb && <li><span aria-current="page" className="pi-crumb-item">{crumb}</span></li>}
        </ol>
      </nav>
      <div className="pi-top-right">
        {mobile && <span className="pi-demo-pill pi-demo-pill-top"><i aria-hidden="true" />Demo · stub data</span>}
        {mobile ? (
          <button type="button" className="pi-icon-btn" onClick={() => setSearching(true)} aria-label="Search"><Icon name="search" size={18} /></button>
        ) : <SearchBox />}
        <span className="pi-scenario-chip" title="Active scenario (illustrative)">
          <span className="pi-flag" aria-hidden="true" />Kazakhstan · TB patient-support financing
        </span>
        <Notifications />
        <Menu
          label="Account menu"
          triggerClass="pi-avatar-btn"
          triggerContent={<span className="pi-avatar" aria-hidden="true">{S.DEMO_USER.initials}</span>}
          header={(
            <div className="pi-menu-header">
              <span className="pi-avatar pi-avatar-lg" aria-hidden="true">{S.DEMO_USER.initials}</span>
              <span><strong>{S.DEMO_USER.name}</strong><span>{S.DEMO_USER.role}</span></span>
            </div>
          )}
          items={[
            { id: 'brief', label: 'Open decision brief', icon: 'brief', onSelect: () => nav.go({ view: 'brief' }) },
            {
              id: 'reset', label: 'Reset demo data', icon: 'refresh', onSelect: () => {
                dispatch({ type: 'reset' });
                toast({ title: 'Demo data reset', body: 'All changes in this session were cleared.', tone: 'info' });
              },
            },
            { id: 'exit', label: 'Exit demo', icon: 'exit', onSelect: () => { window.location.href = '/'; } },
          ]}
        />
      </div>
    </header>
  );
}
