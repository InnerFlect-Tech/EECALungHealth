import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from '../components/Layout';
import { BriefingCTA } from '../components/BriefingCTA';
import { T, useI18n } from '../i18n/I18nProvider';
import { submitConsultation } from '../lib/submitConsultation';
import type { FormAnswers } from '../lib/formSchema';

type FF = {
  org: string;
  orgType: string;
  budget: string;
  timeline: string;
  outcome: string;
};

const ORG_OPTIONS: Array<{ value: string; labelKey: string }> = [
  { value: 'national-foundation', labelKey: 'ff-q2-a' },
  { value: 'corporate', labelKey: 'ff-q2-b' },
  { value: 'multilateral', labelKey: 'ff-q2-c' },
  { value: 'bilateral', labelKey: 'ff-q2-d' },
  { value: 'family-office', labelKey: 'ff-q2-e' },
  { value: 'other', labelKey: 'ff-q2-f' },
];

const BUDGET_OPTIONS: Array<{ value: string; labelKey: string }> = [
  { value: 'up-to-60k', labelKey: 'ff-q3-a' },
  { value: '60k-250k', labelKey: 'ff-q3-b' },
  { value: '250k-1m', labelKey: 'ff-q3-c' },
  { value: 'over-1m', labelKey: 'ff-q3-d' },
  { value: 'undecided', labelKey: 'ff-q3-e' },
];

const TIMELINE_OPTIONS: Array<{ value: string; labelKey: string }> = [
  { value: '60-days', labelKey: 'ff-q4-a' },
  { value: 'q4-2026', labelKey: 'ff-q4-b' },
  { value: '2027-cycle', labelKey: 'ff-q4-c' },
  { value: 'longer', labelKey: 'ff-q4-d' },
];

export function FunderFitPage() {
  const { t } = useI18n();
  const [ff, setFf] = useState<FF>({ org: '', orgType: '', budget: '', timeline: '', outcome: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const prev = document.title;
    document.title = `${t('ff-title')} • EECA Lung Health Sovereignty Hub`;
    return () => {
      document.title = prev;
    };
  }, [t]);

  const valid = ff.org.trim() && ff.orgType && ff.budget && ff.timeline;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const answers: FormAnswers = {
        q0_type: 'C',
        q1_country: 'Multi-country / Regional',
        q2_role: `Funder fit – ${ff.orgType}`,
        q8_consent: 'yes',
        q8a_org: ff.org,
        ff_org_type: ff.orgType,
        ff_budget: ff.budget,
        ff_timeline: ff.timeline,
        ff_outcome: ff.outcome,
        _variant: 'funder-fit',
      } as FormAnswers;
      await submitConsultation(answers);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SiteLayout>
      <section className="page-hero">
        <div className="page-hero-inner container">
          <p className="page-hero-eyebrow"><T k="funders-hero-eyebrow" /></p>
          <h1><T k="ff-title" /></h1>
          <p className="page-hero-lead"><T k="ff-lead" /></p>
        </div>
      </section>

      <section className="section">
        <div className="container ff-container">
          {done ? (
            <div className="ff-done">
              <h2><T k="ff-done-title" /></h2>
              <p><T k="ff-done-lead" /></p>
              <div className="cta-buttons" style={{ marginTop: 'var(--space-xl)' }}>
                <BriefingCTA variant="primary" />
                <Link to="/for-funders" className="btn btn-secondary"><T k="ff-back" /></Link>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="ff-form">
              <label className="ff-field">
                <span className="ff-label"><T k="ff-q1-label" /> <em className="ff-req">*</em></span>
                <input
                  type="text"
                  className="ff-input"
                  value={ff.org}
                  onChange={(e) => setFf({ ...ff, org: e.target.value })}
                  placeholder={t('ff-q1-placeholder')}
                  required
                  autoComplete="organization"
                />
              </label>

              <fieldset className="ff-field">
                <legend className="ff-label"><T k="ff-q2-label" /> <em className="ff-req">*</em></legend>
                <div className="ff-radio-grid">
                  {ORG_OPTIONS.map((o) => (
                    <label key={o.value} className="ff-radio">
                      <input
                        type="radio"
                        name="ff-orgType"
                        value={o.value}
                        checked={ff.orgType === o.value}
                        onChange={() => setFf({ ...ff, orgType: o.value })}
                        required
                      />
                      <span><T k={o.labelKey} /></span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="ff-field">
                <legend className="ff-label"><T k="ff-q3-label" /> <em className="ff-req">*</em></legend>
                <div className="ff-radio-grid">
                  {BUDGET_OPTIONS.map((o) => (
                    <label key={o.value} className="ff-radio">
                      <input
                        type="radio"
                        name="ff-budget"
                        value={o.value}
                        checked={ff.budget === o.value}
                        onChange={() => setFf({ ...ff, budget: o.value })}
                        required
                      />
                      <span><T k={o.labelKey} /></span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="ff-field">
                <legend className="ff-label"><T k="ff-q4-label" /> <em className="ff-req">*</em></legend>
                <div className="ff-radio-grid">
                  {TIMELINE_OPTIONS.map((o) => (
                    <label key={o.value} className="ff-radio">
                      <input
                        type="radio"
                        name="ff-timeline"
                        value={o.value}
                        checked={ff.timeline === o.value}
                        onChange={() => setFf({ ...ff, timeline: o.value })}
                        required
                      />
                      <span><T k={o.labelKey} /></span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="ff-field">
                <span className="ff-label"><T k="ff-q5-label" /></span>
                <textarea
                  className="ff-textarea"
                  value={ff.outcome}
                  onChange={(e) => setFf({ ...ff, outcome: e.target.value })}
                  placeholder={t('ff-q5-placeholder')}
                  rows={4}
                  maxLength={600}
                />
              </label>

              {error && <p className="ff-error">{error}</p>}

              <div className="ff-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!valid || submitting}
                >
                  {submitting ? '…' : t('ff-submit')}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
