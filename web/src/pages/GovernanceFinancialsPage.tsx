import { Link } from 'react-router-dom';
import { SiteLayout } from '../components/Layout';
import { BriefingCTA } from '../components/BriefingCTA';
import { T, useI18n } from '../i18n/I18nProvider';

export function GovernanceFinancialsPage() {
  const { t } = useI18n();
  // Fully filled in W6; stub content works for the route to exist and pass checks.
  const title = t('gov-financials-title');
  if (typeof document !== 'undefined') {
    document.title = `${title} • EECA Lung Health Sovereignty Hub`;
  }

  return (
    <SiteLayout>
      <section className="page-hero">
        <div className="page-hero-inner container">
          <p className="page-hero-eyebrow"><T k="gov-financials-eyebrow" /></p>
          <h1><T k="gov-financials-title" /></h1>
          <p className="page-hero-lead"><T k="gov-financials-lead" /></p>
        </div>
      </section>

      <section className="section">
        <div className="container gov-financials-body">
          <div className="gov-fin-card">
            <h2><T k="gov-financials-roadmap-title" /></h2>
            <p><T k="gov-financials-roadmap-body" /></p>
          </div>

          <div className="gov-fin-card">
            <h2><T k="gov-financials-fiscal-title" /></h2>
            <p><T k="gov-financials-fiscal-body" /></p>
          </div>

          <div className="gov-fin-card">
            <h2><T k="gov-financials-transparency-title" /></h2>
            <p><T k="gov-financials-transparency-body" /></p>
          </div>

          <div className="cta-buttons" style={{ marginTop: 'var(--space-2xl)' }}>
            <Link to="/concept-note" className="btn btn-primary">
              <T k="briefing-secondary" />
            </Link>
            <BriefingCTA variant="secondary" />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
