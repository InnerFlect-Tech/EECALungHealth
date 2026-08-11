import { Link } from 'react-router-dom';
import { StepWizard } from '../components/form/StepWizard';
import { SiteLayout } from '../components/Layout';
import { scrollToElement } from '../lib/scrollToTarget';
import { useI18n } from '../i18n/I18nProvider';
import { tr } from '../i18n/formRu';

function ConsultHero() {
  const { lang } = useI18n();
  return (
    <div className="consult-hero">
      <div className="consult-hero-inner">
        <div className="consult-eyebrow">
          {tr('Regional Stakeholder Insights', lang)}
        </div>
        <h1>
          {tr('Your input will shape', lang)}
          <br />
          <em>{tr('what gets built first.', lang)}</em>
        </h1>
        <p className="consult-hero-sub">
          {tr(
            'Across Eastern Europe and Central Asia, health systems are under pressure — from geopolitical disruption, funding transitions, displacement of populations, and strained supply chains. When treatment continuity breaks down, the consequences are clinical, political, and irreversible.',
            lang,
          )}
        </p>
        <p className="consult-hero-sub">
          {tr(
            'The EECA Lung Health Sovereignty Hub is a proposed regional platform designed to help parliamentarians, community organizations, and partners coordinate faster, legislate smarter, and protect care continuity — especially for the most vulnerable populations.',
            lang,
          )}
        </p>
        <div className="consult-meta">
          <span className="consult-pill">{tr('7–10 minutes', lang)}</span>
          <span className="consult-pill">{tr('No individual patient data collected', lang)}</span>
          <span className="consult-pill">{tr('All responses inform product decisions', lang)}</span>
          <span className="consult-pill">{tr('Your perspective, not your budget', lang)}</span>
        </div>
        <div className="consult-cta-row">
          <a
            href="#consultation-form"
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              scrollToElement('consultation-form', true);
            }}
          >
            {tr('Ready to Participate', lang)}
          </a>
          <Link to="/" className="btn btn-secondary">{tr('Learn more about the Hub', lang)}</Link>
        </div>
        <div className="consult-privacy">
          <strong>{tr('Privacy and consent:', lang)}</strong>{' '}
          {tr(
            'Your responses are collected for internal strategic planning and product design purposes only. No individual patient data is requested or collected at any point. Aggregated, anonymized findings may be shared with core project partners. By completing this form, you consent to this use. Contact details, if provided, are used only for follow-up related to this initiative.',
            lang,
          )}
        </div>
      </div>
    </div>
  );
}

export function ConsultationPage() {
  return (
    <SiteLayout current="consultation">
      <StepWizard hero={<ConsultHero />} />
    </SiteLayout>
  );
}
