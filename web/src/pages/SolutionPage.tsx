import { Link } from 'react-router-dom';
import { SiteLayout } from '../components/Layout';
import { BriefingCTA } from '../components/BriefingCTA';
import { T } from '../i18n/I18nProvider';

const svg = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
const SOL_ICONS = {
  eng: (
    <svg {...svg}><rect x="6.5" y="6.5" width="11" height="11" rx="2" /><path d="M9.5 2.5v3M14.5 2.5v3M9.5 18.5v3M14.5 18.5v3M2.5 9.5h3M2.5 14.5h3M18.5 9.5h3M18.5 14.5h3" /><path d="M10.5 10.5h3v3h-3z" /></svg>
  ),
  bri: (
    <svg {...svg}><path d="M3 17v-2a9 9 0 0 1 18 0v2" /><path d="M2.5 17h19" /><path d="M7.5 17v-3.5M16.5 17v-3.5M12 17v-5" /></svg>
  ),
  shi: (
    <svg {...svg}><path d="M12 2.75l7 2.75v5.25c0 4.4-3 7.4-7 8.9-4-1.5-7-4.5-7-8.9V5.5l7-2.75z" /><path d="M9 11.5l2 2 4-4" /></svg>
  ),
};

function BrowserFrame({ src, alt, url }: { src: string; alt: string; url: string }) {
  return (
    <div className="browser-frame">
      <div className="browser-bar" aria-hidden="true">
        <span className="browser-dots"><i /><i /><i /></span>
        <span className="browser-url">{url}</span>
      </div>
      <div className="browser-frame-media">
        <img src={src} alt={alt} loading="lazy" />
        <span className="ai-badge ai-badge-mockup" role="note" aria-label="Illustrative product mockup">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
            <path d="M19 15l0.7 1.9L21.6 17.6l-1.9 0.7L19 20.2l-0.7-1.9L16.4 17.6l1.9-0.7L19 15z" />
          </svg>
          <T k="ai-badge-mockup" />
        </span>
      </div>
    </div>
  );
}

const COMPONENTS = [
  { k: 'eng', role: 'eng-role', name: 'loop-eng', img: 'eeca-overview-dashboard.png', cap: 'solp-eng-cap', url: 'app.eecalunghealth.com/budget' },
  { k: 'bri', role: 'bri-role', name: 'loop-bri', img: 'program-pipeline-investment.png', cap: 'solp-bri-cap', url: 'app.eecalunghealth.com/pipeline' },
  { k: 'shi', role: 'shi-role', name: 'loop-shi', img: 'burden-vs-spending-analysis.png', cap: 'solp-shi-cap', url: 'app.eecalunghealth.com/overview' },
] as const;

const STANDARDS = ['1', '2', '3', '4'] as const;

export function SolutionPage() {
  return (
    <SiteLayout>
      <section className="page-hero">
        <div className="page-hero-inner container">
          <p className="page-hero-eyebrow"><T k="nav-approach" /></p>
          <h1><T k="solp-title" /></h1>
          <p className="page-hero-lead"><T k="solp-lead" /></p>
        </div>
      </section>

      {/* Product hero shot — a real country view inside the platform */}
      <div className="container sol-shot">
        <BrowserFrame
          src="/assets/images/platform/ukraine-country-dashboard.png"
          alt="Country lung-health dashboard inside the platform"
          url="app.eecalunghealth.com/ukraine"
        />
        <p className="sol-shot-cap"><T k="solp-shot-cap" /></p>
      </div>

      <section className="section">
        <div className="container">
          <div className="loop" role="img" aria-label="Decision to delivered care flows through the Engine, Bridge and Shield over a shared governed data layer.">
            <div className="loop-flow">
              <div className="loop-end">
                <span className="loop-dot" aria-hidden="true" />
                <span className="loop-end-label"><T k="loop-decision" /></span>
              </div>
              {([
                { k: 'eng', icon: SOL_ICONS.eng },
                { k: 'bri', icon: SOL_ICONS.bri },
                { k: 'shi', icon: SOL_ICONS.shi },
              ] as const).map((c) => (
                <div className="loop-node" key={c.k}>
                  <span className="loop-badge" aria-hidden="true">{c.icon}</span>
                  <strong><T k={`loop-${c.k}`} /></strong>
                  <span className="loop-role"><T k={`${c.k}-role`} /></span>
                </div>
              ))}
              <div className="loop-end loop-end-out">
                <span className="loop-dot" aria-hidden="true" />
                <span className="loop-end-label"><T k="loop-delivery" /></span>
              </div>
              <span className="loop-pulse" aria-hidden="true" />
            </div>
            <div className="loop-foundation">
              <span><T k="loop-foundation" /></span>
            </div>
          </div>

          {/* Three capabilities, each shown as a real screen in the product */}
          <div className="sol-showcase">
            {COMPONENTS.map((c, i) => (
              <article className={`sol-show${i % 2 === 1 ? ' is-alt' : ''}`} key={c.k}>
                <figure className="sol-show-media">
                  <BrowserFrame
                    src={`/assets/images/platform/${c.img}`}
                    alt={`${c.k} view inside the platform`}
                    url={c.url}
                  />
                  <figcaption className="sol-show-cap"><T k={c.cap} /></figcaption>
                </figure>
                <div className="sol-show-body">
                  <span className="sol-role"><T k={c.role} /></span>
                  <h3><T k={c.name} /></h3>
                  <p className="sol-show-fn"><T k={`solp-${c.k}-fn`} /></p>
                  <ul className="sol-list">
                    <li><T k={`solp-${c.k}-b1`} /></li>
                    <li><T k={`solp-${c.k}-b2`} /></li>
                    <li><T k={`solp-${c.k}-b3`} /></li>
                  </ul>
                  <p className="sol-show-foot"><T k={`solp-${c.k}-foot`} /></p>
                </div>
              </article>
            ))}
          </div>

          {/* In use — the platform in serious rooms */}
          <div className="sol-inuse">
            <p className="eyebrow"><T k="inuse-eyebrow" /></p>
            <h3 className="sol-inuse-title"><T k="inuse-title" /></h3>
            <div className="sol-inuse-grid">
              <figure className="sol-inuse-card">
                <div className="sol-inuse-media">
                  <img
                    src="/assets/images/platform/meeting-country-dashboard.png"
                    alt="Illustrative composite (AI-generated): a policy meeting reviewing the EECA Lung Health country dashboard on a wall display"
                    loading="lazy"
                  />
                  <span className="ai-badge" role="note" aria-label="AI-generated image">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
                      <path d="M19 15l0.7 1.9L21.6 17.6l-1.9 0.7L19 20.2l-0.7-1.9L16.4 17.6l1.9-0.7L19 15z" />
                    </svg>
                    <T k="ai-badge" />
                  </span>
                </div>
                <figcaption>
                  <strong><T k="inuse-people-t" /></strong>
                  <span><T k="inuse-people-d" /></span>
                </figcaption>
              </figure>
              <figure className="sol-inuse-card">
                <div className="sol-inuse-media">
                  <img
                    src="/assets/images/platform/budget-review-report.png"
                    alt="Illustrative composite (AI-generated): a printed Budget Review Report 2024 open on a desk beside a laptop"
                    loading="lazy"
                  />
                  <span className="ai-badge" role="note" aria-label="AI-generated image">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
                      <path d="M19 15l0.7 1.9L21.6 17.6l-1.9 0.7L19 20.2l-0.7-1.9L16.4 17.6l1.9-0.7L19 15z" />
                    </svg>
                    <T k="ai-badge" />
                  </span>
                </div>
                <figcaption>
                  <strong><T k="inuse-reports-t" /></strong>
                  <span><T k="inuse-reports-d" /></span>
                </figcaption>
              </figure>
            </div>
          </div>

          <p className="sol-trust"><T k="sol-trust" /></p>

          <div className="sol-std-grid">
            {STANDARDS.map((n) => (
              <div className="sol-std" key={n}>
                <strong><T k={`std${n}-t`} /></strong>
                <span><T k={`std${n}-s`} /></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container">
          <h2><T k="cta-title" /></h2>
          <p className="cta-lead"><T k="cta-lead" /></p>
          <p className="cta-sub"><T k="cta-sub" /></p>
          <div className="cta-buttons">
            <BriefingCTA variant="primary" />
            <Link to="/concept-note" className="btn btn-secondary"><T k="briefing-secondary" /></Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
