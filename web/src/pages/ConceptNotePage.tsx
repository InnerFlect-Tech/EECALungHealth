import { useEffect, useState } from 'react';
import { SiteLayout } from '../components/Layout';
import { BriefingCTA } from '../components/BriefingCTA';
import { T, useI18n } from '../i18n/I18nProvider';

export function ConceptNotePage() {
  const { t } = useI18n();
  const [html, setHtml] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const prev = document.title;
    document.title = `${t('concept-note-page-title')} • EECA Lung Health Hub`;
    return () => {
      document.title = prev;
    };
  }, [t]);

  useEffect(() => {
    fetch('/concept-note-body.html')
      .then((r) => {
        if (!r.ok) throw new Error('fetch failed');
        return r.text();
      })
      .then(setHtml)
      .catch(() => setError(true));
  }, []);

  return (
    <SiteLayout>
      <section className="page-hero concept-note-hero">
        <div className="page-hero-inner container">
          <div className="concept-note-print-mark">
            <img src="/assets/images/brand/logo-mark-color.png" alt="" />
            <span>EECA Lung Health Hub</span>
          </div>
          <p className="page-hero-eyebrow"><T k="concept-note-eyebrow" /></p>
          <h1><T k="concept-note-page-title" /></h1>
          <p className="page-hero-lead"><T k="concept-note-lead" /></p>
          <div className="concept-note-actions">
            <a
              href="/concept-note.pdf"
              className="btn btn-primary concept-note-download"
              onClick={(e) => {
                // Hide gracefully until W7 ships the PDF
                fetch('/concept-note.pdf', { method: 'HEAD' })
                  .then((r) => {
                    if (!r.ok) e.preventDefault();
                  })
                  .catch(() => {});
              }}
            >
              <T k="concept-note-download" />
            </a>
            <BriefingCTA variant="secondary" />
          </div>
        </div>
      </section>

      <section className="section concept-note-body-section">
        <div className="container concept-note-container">
          {error ? (
            <p className="concept-note-error">
              <T k="concept-note-error" />{' '}
              <BriefingCTA variant="inline" labelKey="cta-briefing-primary" />
            </p>
          ) : (
            <div
              className="concept-note-content"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
