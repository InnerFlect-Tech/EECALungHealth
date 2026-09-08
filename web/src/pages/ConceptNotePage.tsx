import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SiteLayout } from '../components/Layout';
import { BriefingCTA } from '../components/BriefingCTA';
import { UseOfFundsChart } from '../components/UseOfFundsChart';
import { T, useI18n } from '../i18n/I18nProvider';

// The budget chart is a real React component, but the concept note body is
// fetched as a static HTML string — split it at this marker so the chart can
// render inline, right where the section actually discusses budget, rather
// than bolted onto the top or bottom of the document. Editions without a
// budget section simply omit the marker and get no chart.
const BUDGET_SECTION_MARKER = '<!--budget-chart-->';

// Several editions of the same note share this page. Which one a visitor gets
// follows the site language: Russian readers get the Russian note, everyone
// else the English one. ?doc= overrides that for the internal editions —
// full (proposed extra sections, marked red) and diff (departures from the
// source doc, marked red), in either language.
const BODY_FILES: Record<string, string> = {
  default: '/concept-note-body.html',
  full: '/concept-note-body-full.html',
  diff: '/concept-note-body-diff.html',
  ru: '/concept-note-body-ru.html',
  'ru-diff': '/concept-note-body-ru-diff.html',
};

const PDF_FILES: Record<string, string> = {
  default: '/concept-note.pdf',
  full: '/concept-note-full.pdf',
  diff: '/concept-note-diff.pdf',
  ru: '/concept-note-ru.pdf',
  'ru-diff': '/concept-note-ru-diff.pdf',
};

export function ConceptNotePage() {
  const { t, lang } = useI18n();
  const [searchParams] = useSearchParams();
  const [html, setHtml] = useState('');
  const [error, setError] = useState(false);

  const variant = searchParams.get('doc') ?? (lang === 'ru' ? 'ru' : 'default');
  const bodyFile = BODY_FILES[variant] ?? BODY_FILES.default;
  const pdfFile = PDF_FILES[variant] ?? PDF_FILES.default;

  // Only the edition that actually carries a budget section gets the chart.
  const hasBudgetSection = html.includes(BUDGET_SECTION_MARKER);

  const htmlParts = useMemo(() => {
    const splitAt = html.indexOf(BUDGET_SECTION_MARKER);
    if (splitAt === -1) return [html, ''];
    return [html.slice(0, splitAt), html.slice(splitAt)];
  }, [html]);

  useEffect(() => {
    const prev = document.title;
    document.title = `${t('concept-note-page-title')} • EECA Lung Health Hub`;
    return () => {
      document.title = prev;
    };
  }, [t]);

  useEffect(() => {
    fetch(bodyFile)
      .then((r) => {
        if (!r.ok) throw new Error('fetch failed');
        return r.text();
      })
      .then(setHtml)
      .catch(() => setError(true));
  }, [bodyFile]);

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
              href={pdfFile}
              download
              className="btn btn-primary concept-note-download"
              onClick={(e) => {
                // Hide gracefully until W7 ships the PDF
                fetch(pdfFile, { method: 'HEAD' })
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
            <div className="concept-note-content">
              <div dangerouslySetInnerHTML={{ __html: htmlParts[0] }} />
              {hasBudgetSection && (
                <div className={variant === 'full' ? 'cn-uof cn-diff-block' : 'cn-uof'}>
                  <UseOfFundsChart compact />
                </div>
              )}
              <div dangerouslySetInnerHTML={{ __html: htmlParts[1] }} />
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
