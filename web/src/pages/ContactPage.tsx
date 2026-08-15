import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from '../components/Layout';
import { BriefingCTA } from '../components/BriefingCTA';
import { useI18n } from '../i18n/I18nProvider';
import { tr } from '../i18n/formRu';
import '../audience.css';

export function ContactPage() {
  const { lang } = useI18n();
  useEffect(() => {
    const prev = document.title;
    document.title = `${tr('Contact', lang)} • EECA Lung Health Sovereignty Hub`;
    return () => { document.title = prev; };
  }, [lang]);

  return (
    <SiteLayout>
      <section className="page-hero aud-hero">
        <div className="page-hero-inner container">
          <p className="page-hero-eyebrow">{tr('Contact', lang)}</p>
          <h1>{tr("Let's talk.", lang)}</h1>
          <p className="page-hero-lead">
            {tr('The fastest way to reach us is the consultation form – it routes your message to the right person on our team. Partner and funding discussions are handled in confidence.', lang)}
          </p>
          <div className="aud-hero-cta">
            <BriefingCTA variant="primary" />
          </div>
          <p className="aud-proof">
            {tr('Or email us directly:', lang)}{' '}
            <a href="mailto:alesia.matusevych@globaltbcaucus.org">alesia.matusevych@globaltbcaucus.org</a>
          </p>
        </div>
      </section>

      <section className="section section-alt contact-participate-section">
        <div className="container">
          <p className="eyebrow">{tr('Regional Stakeholder Insights', lang)}</p>
          <h2>{tr('Your input will shape what gets built first.', lang)}</h2>
          <p className="section-lead">{tr('A 7–10 minute survey that helps us to understand your situation.', lang)}</p>
          <p><Link to="/consultation" className="btn btn-secondary-onLight">{tr('Ready to Participate', lang)}</Link></p>
        </div>
      </section>
    </SiteLayout>
  );
}
