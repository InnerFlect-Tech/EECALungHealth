import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { meta } from '../careContinuityScenario';
import { DemoProvider, ToastProvider } from './DemoProvider';
import { ItemDrawer } from './drawers/ItemDrawer';
import { Icon } from './icons';
import { viewLabel } from './model';
import { useNav } from './nav';
import { Sidebar, Topbar } from './Shell';
import { useDemo } from './store';
import { Alerts } from './views/Alerts';
import { Caseload } from './views/Caseload';
import { Impact } from './views/Impact';
import { Journey } from './views/Journey';
import { Overview } from './views/Overview';
import { Regions } from './views/Regions';
import { ServiceMap } from './views/ServiceMap';
import './cc.css';

const PAGE_URL = 'https://eecalunghealth.com/demo/care-continuity';
const MOBILE_QUERY = '(max-width: 899px)';

function useIsMobile() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(MOBILE_QUERY);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}

function Banner() {
  const { state, dismissBanner } = useDemo();
  if (state.bannerDismissed) return null;
  return (
    <div className="cc-banner" role="note">
      <span className="cc-banner-icon" aria-hidden="true"><Icon name="info" size={16} /></span>
      <p><strong>Demo with synthetic data.</strong> No real patients, figures or alerts. Every number, district and case on these screens is illustrative.</p>
      <button type="button" className="cc-icon-btn" aria-label="Dismiss demo notice" onClick={dismissBanner}>
        <Icon name="x" size={16} />
      </button>
    </div>
  );
}

function AppInner() {
  const { view, item, close } = useNav();
  const mobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // Title + canonical link.
  useEffect(() => {
    const prevTitle = document.title;
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const created = !link;
    const prevHref = link?.href;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = PAGE_URL;
    return () => {
      document.title = prevTitle;
      if (created) link?.remove();
      else if (link && prevHref) link.href = prevHref;
    };
  }, []);

  useEffect(() => {
    document.title = `${viewLabel(view)} · Care Continuity demo · EECA Lung Health Hub`;
  }, [view]);

  // New module: start at the top.
  useEffect(() => { mainRef.current?.scrollTo({ top: 0 }); }, [view]);

  const sidebarOpen = mobile && menuOpen;

  return (
    <div className={`cc-app ${sidebarOpen ? 'is-nav-open' : ''}`}>
      <a href="#cc-main" className="cc-skip">Skip to content</a>
      <Sidebar open={sidebarOpen} mobile={mobile} onClose={() => setMenuOpen(false)} />
      {sidebarOpen && <div className="cc-scrim cc-scrim-nav" onClick={() => setMenuOpen(false)} aria-hidden="true" />}
      <div className="cc-col">
        <Topbar onMenu={() => setMenuOpen(true)} menuOpen={sidebarOpen} mobile={mobile} />
        <div className="cc-demo-strip" role="note"><span className="cc-demo-dot" aria-hidden="true" />Demo · stub data · synthetic, no real patients</div>
        <main id="cc-main" ref={mainRef} className="cc-main" tabIndex={-1} aria-label={viewLabel(view)}>
          <div className="cc-main-inner">
            <Banner />
            {view === 'overview' && <Overview />}
            {view === 'regions' && <Regions />}
            {view === 'journey' && <Journey />}
            {view === 'caseload' && <Caseload />}
            {view === 'alerts' && <Alerts />}
            {view === 'map' && <ServiceMap />}
            {view === 'impact' && <Impact />}
            <footer className="cc-main-foot">
              <span>{meta.title} · synthetic demo · as of {meta.asOfLabel}</span>
              <span>Built by the EECA Lung Health Hub. Not a live system.</span>
            </footer>
          </div>
        </main>
      </div>
      {item && <ItemDrawer item={item} onClose={close} />}
      <div id="cc-layer" />
    </div>
  );
}

export function CareContinuityApp() {
  return (
    <DemoProvider>
      <ToastProvider>
        <AppInner />
      </ToastProvider>
    </DemoProvider>
  );
}
