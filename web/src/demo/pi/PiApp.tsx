import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import * as S from '../kazakhstanScenario';
import { Icon } from './Icon';
import { Sidebar, Topbar } from './Shell';
import { DetailDrawer } from './DetailDrawer';
import { Dashboard } from './views/Dashboard';
import { Evidence } from './views/Evidence';
import { Brief } from './views/Brief';
import { Stakeholders } from './views/Stakeholders';
import { Tracker } from './views/Tracker';
import { DemoContext, ToastContext, loadState, reducer, saveState, useDemo, useNav } from './store';
import type { ToastInput } from './store';
import { useMediaQuery } from './hooks';

interface ToastItem extends ToastInput { id: number }

function Toaster({ toasts, dismiss }: { toasts: ToastItem[]; dismiss: (id: number) => void }) {
  const nav = useNav();
  return (
    <div className="pi-toasts" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`pi-toast pi-toast-${t.tone ?? 'success'}`}>
          <span className="pi-toast-icon" aria-hidden="true"><Icon name={t.tone === 'info' ? 'info' : 'check'} size={16} /></span>
          <div className="pi-toast-body">
            <strong>{t.title}</strong>
            {t.body && <span>{t.body}</span>}
          </div>
          {t.action && (
            <button type="button" className="pi-toast-action" onClick={() => { nav.go(t.action!.ref); dismiss(t.id); }}>{t.action.label}</button>
          )}
          <button type="button" className="pi-icon-btn pi-icon-btn-sm" onClick={() => dismiss(t.id)} aria-label="Dismiss"><Icon name="x" size={14} /></button>
        </div>
      ))}
    </div>
  );
}

function Banner() {
  const { dispatch } = useDemo();
  return (
    <div className="pi-banner" role="note">
      <Icon name="info" size={18} />
      <p><strong>Demo with stub data.</strong> Figures, dates, documents and stakeholder positions are illustrative, not official data.</p>
      <button type="button" className="pi-icon-btn pi-icon-btn-sm" onClick={() => dispatch({ type: 'dismissBanner' })} aria-label="Dismiss notice"><Icon name="x" size={16} /></button>
    </div>
  );
}

function crumbFor(item: string | null, state: ReturnType<typeof loadState>): string | null {
  if (!item) return null;
  if (item.startsWith('q-')) return state.questions.find((q) => q.id === item)?.text ?? null;
  if (item.startsWith('ev-')) return S.evidence.find((e) => e.id === item)?.title ?? null;
  if (item.startsWith('sh-')) return S.institutions.find((i) => i.id === item.slice(3))?.short ?? null;
  if (item.startsWith('t-')) return state.tasks.find((t) => t.id === item)?.title ?? null;
  if (item.startsWith('opt-')) return `Option ${item.slice(4)}`;
  return null;
}

export function PiApp() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const nav = useNav();
  const mobile = useMediaQuery('(max-width: 899px)');
  const [navOpen, setNavOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const mainRef = useRef<HTMLElement>(null);
  const asideRef = useRef<HTMLElement>(null);
  const menuBtnFocus = useRef<HTMLElement | null>(null);
  const drawerReturn = useRef<HTMLElement | null>(null);
  const toastId = useRef(0);

  useEffect(() => { saveState(state); }, [state]);

  // Reset the main scroll position when switching modules.
  useEffect(() => { mainRef.current?.scrollTo({ top: 0 }); }, [nav.view]);

  // Remember what opened the drawer and return focus there once it closes.
  const hasItem = !!nav.item;
  useEffect(() => {
    if (hasItem) {
      if (!drawerReturn.current) drawerReturn.current = document.activeElement as HTMLElement | null;
    } else if (drawerReturn.current) {
      const el = drawerReturn.current;
      drawerReturn.current = null;
      if (document.contains(el)) el.focus({ preventScroll: true });
    }
  }, [hasItem]);

  // "/" focuses search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey) return;
      const t = e.target as HTMLElement;
      if (t.closest('input, textarea, select, [contenteditable="true"]')) return;
      const input = document.querySelector<HTMLInputElement>('.pi-search input');
      if (input) { e.preventDefault(); input.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const dismiss = useCallback((id: number) => setToasts((ts) => ts.filter((t) => t.id !== id)), []);
  const push = useCallback((t: ToastInput) => {
    toastId.current += 1;
    const id = toastId.current;
    setToasts((ts) => [...ts.slice(-2), { ...t, id }]);
    window.setTimeout(() => dismiss(id), 5000);
  }, [dismiss]);

  const openNav = () => {
    menuBtnFocus.current = document.activeElement as HTMLElement | null;
    setNavOpen(true);
    requestAnimationFrame(() => asideRef.current?.querySelector<HTMLElement>('.pi-nav a')?.focus());
  };
  const closeNav = () => {
    if (!navOpen) return;
    setNavOpen(false);
    menuBtnFocus.current?.focus();
  };

  return (
    <DemoContext.Provider value={{ state, dispatch }}>
      <ToastContext.Provider value={push}>
        <div className={`pi-app${navOpen && mobile ? ' is-nav-open' : ''}`}>
          <a href="#pi-main" className="pi-skip" onClick={(e) => { e.preventDefault(); mainRef.current?.focus(); }}>Skip to content</a>
          <Sidebar open={navOpen} mobile={mobile} onClose={closeNav} asideRef={asideRef} />
          <div className="pi-frame">
            <Topbar onMenu={openNav} mobile={mobile} crumb={crumbFor(nav.item, state)} />
            <main className="pi-main" id="pi-main" ref={mainRef} tabIndex={-1}>
              {!state.bannerDismissed && <Banner />}
              {nav.view === 'dashboard' && <Dashboard />}
              {nav.view === 'evidence' && <Evidence />}
              {nav.view === 'brief' && <Brief />}
              {nav.view === 'stakeholders' && <Stakeholders />}
              {nav.view === 'tracker' && <Tracker />}
            </main>
          </div>
          {nav.item && <DetailDrawer item={nav.item} />}
          <Toaster toasts={toasts} dismiss={dismiss} />
          <div id="pi-overlay-root" />
        </div>
      </ToastContext.Provider>
    </DemoContext.Provider>
  );
}
