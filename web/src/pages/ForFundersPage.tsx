import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from '../components/Layout';
import { BriefingCTA } from '../components/BriefingCTA';
import { UseOfFundsChart } from '../components/UseOfFundsChart';
import { T, useI18n } from '../i18n/I18nProvider';

/* The delivery phases, with the timeframe each one runs on — mirrors the
   Investment Thesis timeline, shown here alongside the funding ask. */
const ROADMAP = [
  { n: '1', when: 'tier-founding-when' },
  { n: '2', when: 'tier-regional-when' },
  { n: '3', when: 'tier-platform-when' },
  { n: '4', when: null },
] as const;

export function ForFundersPage() {
  const { t } = useI18n();
  useEffect(() => {
    const prev = document.title;
    document.title = `${t('funders-hero-title')} • EECA Lung Health Sovereignty Hub`;
    return () => {
      document.title = prev;
    };
  }, [t]);

  return (
    <SiteLayout>
      <section className="page-hero funders-hero">
        <div className="page-hero-inner container">
          <p className="page-hero-eyebrow"><T k="funders-hero-eyebrow" /></p>
          <h1><T k="funders-hero-title" /></h1>
          <p className="page-hero-lead"><T k="funders-hero-lead" /></p>
          <div className="funders-hero-cta">
            <BriefingCTA variant="primary" />
            <Link to="/concept-note" className="btn btn-secondary"><T k="briefing-secondary" /></Link>
          </div>
          <p className="funders-fit-hint">
            <T k="ff-hint" />{' '}
            <Link to="/consultation/funder" className="link-arrow"><T k="ff-take-check" /></Link>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow"><T k="funders-impact-eyebrow" /></p>
          <h2 className="funders-impact-title"><T k="funders-impact-title" /></h2>
          <p className="section-lead"><T k="funders-impact-lead" /></p>
          <div className="funders-impact-grid">
            {(['a', 'b', 'c'] as const).map((k) => (
              <article className="funders-impact-card" key={k}>
                <strong className="funders-impact-value"><T k={`funders-impact-${k}-val`} /></strong>
                <p className="funders-impact-desc"><T k={`funders-impact-${k}-desc`} /></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <UseOfFundsChart />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow"><T k="fund-road-eyebrow" /></p>
          <h2><T k="fund-road-title" /></h2>
          <p className="section-lead"><T k="fund-road-lead" /></p>
          <ol className="roadmap">
            {ROADMAP.map((r) => (
              <li className="roadmap-row" key={r.n}>
                <span className="roadmap-num" aria-hidden="true">0{r.n}</span>
                <div className="roadmap-head">
                  {r.when && <span className="roadmap-when"><T k={r.when} /></span>}
                  <strong><T k={`phase${r.n}-tag`} /></strong>
                  <span className="roadmap-scope"><T k={`phase${r.n}-when`} /></span>
                </div>
                <div className="roadmap-body">
                  <p><T k={`phase${r.n}-desc`} /></p>
                </div>
              </li>
            ))}
          </ol>
          <p className="roadmap-note"><T k="approach-confidential" /></p>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container">
          <h2><T k="funders-cta-title" /></h2>
          <p className="cta-lead"><T k="funders-cta-lead" /></p>
          <div className="cta-buttons">
            <BriefingCTA variant="primary" />
            <Link to="/concept-note" className="btn btn-secondary"><T k="briefing-secondary" /></Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
