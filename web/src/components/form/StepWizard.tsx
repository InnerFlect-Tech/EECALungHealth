import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  buildStepSequence,
  resolveBranch,
  STEP_LABELS,
  validateStep,
  type FormAnswers,
} from '../../lib/formSchema';
import { submitConsultation } from '../../lib/submitConsultation';
import { scrollToElement } from '../../lib/scrollToTarget';
import { FieldRenderer } from './FieldRenderer';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';
import { localizeStep, localizeError, tr } from '../../i18n/formRu';

type Props = {
  hero?: React.ReactNode;
};

export function StepWizard({ hero }: Props) {
  const { lang } = useI18n();
  const [answers, setAnswers] = useState<FormAnswers>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Only re-resolve the branch (and thus the step count/progress bar) when the
  // user actually advances – otherwise merely clicking a track radio on step 1
  // (before Continue) jumps the "X of Y" total out from under them mid-step.
  const [committedAnswers, setCommittedAnswers] = useState<FormAnswers>({});

  const steps = useMemo(() => buildStepSequence(committedAnswers), [committedAnswers]);
  // Every track resolves to the same total step count, so before one is picked,
  // show that eventual total instead of the shared-steps-only placeholder –
  // otherwise the "X of Y" jumps the moment the user advances past step 1.
  const displayTotal = useMemo(() => {
    if (resolveBranch(committedAnswers)) return steps.length;
    return buildStepSequence({ ...committedAnswers, q0_type: 'A' }).length;
  }, [committedAnswers, steps.length]);

  useEffect(() => {
    if (stepIndex >= steps.length && steps.length > 0) {
      setStepIndex(steps.length - 1);
    }
  }, [steps.length, stepIndex]);

  const current = steps[stepIndex];
  const view = current ? localizeStep(current, lang) : null;
  const progress = displayTotal > 1 ? Math.round((stepIndex / (displayTotal - 1)) * 97) + 3 : 3;

  const onChange = useCallback((id: string, value: unknown) => {
    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      if (id === 'q0_type' && value !== 'D') {
        delete next.q0d_describe;
        delete next.q0d_nearest;
      }
      return next;
    });
    setError(null);
  }, []);

  const goNext = async () => {
    if (!current) return;
    const err = validateStep(current, answers);
    if (err) {
      setError(err);
      scrollToElement('consultation-form', true);
      return;
    }

    if (stepIndex >= steps.length - 1) {
      setSubmitting(true);
      setSubmitError(null);
      try {
        await submitConsultation(answers);
        setDone(true);
        scrollToElement('consultation-thanks', true);
      } catch (e) {
        setSubmitError(e instanceof Error ? e.message : 'Submission failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setCommittedAnswers(answers);
    setStepIndex((i) => i + 1);
    scrollToElement('consultation-form', true);
  };

  const goBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
    setError(null);
    scrollToElement('consultation-form', true);
  };

  if (done) {
    return (
      <>
        {hero}
        <section className="form-wrap">
          <div className="form-box">
            <div className="ty-wrap" id="consultation-thanks" style={{ display: 'block' }}>
              <div className="ty-icon" aria-hidden="true">✓</div>
              <h2>{tr('Thank you.', lang)}</h2>
              <p>
                {tr(
                  'Your input goes directly to the team designing the EECA Lung Health Sovereignty Hub. No response will be shared publicly without your consent. If you indicated willingness to be contacted, you will hear from us within two weeks.',
                  lang,
                )}
              </p>
              <div className="ty-box">
                <strong>{tr('Questions or direct contact:', lang)}</strong>
                <br />
                <a className="ty-email" href="mailto:alesia.matusevych@globaltbcaucus.org">
                  alesia.matusevych@globaltbcaucus.org
                </a>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {hero}
      <section className="form-wrap" id="consultation-form" aria-label="Stakeholder consultation form">
        <div className="form-box">
          <div className="prog-wrap">
            <div className="prog-top">
              <span className="prog-label">{tr(STEP_LABELS[current?.id ?? ''] ?? 'Consultation', lang)}</span>
              <span className="prog-count">
                {stepIndex + 1} {tr('of', lang)} {displayTotal}
              </span>
            </div>
            <div className="prog-track">
              <div className="prog-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="concept-access">
            <span className="concept-access-note">
              {tr(
                'Some questions refer to the Hub’s concept and its three core functions. You can open the full Concept Note at any point:',
                lang,
              )}
            </span>
            <Link to="/concept-note" className="concept-note-link" target="_blank" rel="noopener noreferrer">
              {tr('Open the Concept Note', lang)}
            </Link>
          </div>

          {current && view && (
            <div className="step active">
              <div className="step-tag">{tr('Step', lang)} {stepIndex + 1} · {view.tag}</div>
              <h2>{view.title}</h2>
              {view.hint && <p className="step-hint">{view.hint}</p>}

              {view.fields.map((field) => {
                if (field.showWhen && !field.showWhen(answers)) return null;
                if (field.type === 'group') {
                  return (
                    <FieldRenderer
                      key={field.id}
                      field={field}
                      value={null}
                      answers={answers}
                      onChange={onChange}
                    />
                  );
                }
                return (
                  <FieldRenderer
                    key={field.id}
                    field={field}
                    value={answers[field.id]}
                    answers={answers}
                    onChange={onChange}
                    entryCards={field.id === 'q0_type'}
                  />
                );
              })}

              {error && <div className="c-field-err show">{localizeError(error, lang)}</div>}
              {submitError && <div className="c-field-err show">{submitError}</div>}

              <div className="step-nav">
                <button type="button" className="btn-back" disabled={stepIndex === 0} onClick={goBack}>
                  {tr('Back', lang)}
                </button>
                <button type="button" className="btn-next" disabled={submitting} onClick={goNext}>
                  {stepIndex >= steps.length - 1
                    ? submitting
                      ? tr('Submitting…', lang)
                      : tr('Submit', lang)
                    : tr('Continue', lang)}
                </button>
              </div>
            </div>
          )}

          {resolveBranch(answers) && (
            <p className="max-note" style={{ marginTop: 16 }}>
              {lang === 'ru'
                ? `Направление: ${resolveBranch(answers)} – профильные вопросы следуют за общим разделом.`
                : `Track: ${resolveBranch(answers)} – branch-specific questions follow shared section.`}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
