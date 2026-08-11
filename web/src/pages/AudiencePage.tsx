import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from '../components/Layout';
import { BriefingCTA } from '../components/BriefingCTA';
import { TierGrid } from '../components/TierGrid';
import { Reveal, CountUp } from '../lib/motion';
import { useI18n } from '../i18n/I18nProvider';
import { tr } from '../i18n/formRu';
import '../audience.css';

type Audience = 'policymakers' | 'partners' | 'civil-society';

const HERO: Record<Audience, { eyebrow: string; title: string; lead: string; cta: string; proof: string; img: string }> = {
  policymakers: {
    eyebrow: 'For policymakers', title: 'Act with certainty. See it delivered.',
    lead: 'Move from commitment to enacted, financed policy in weeks — with governed, human-reviewed tools and the backing of a proven regional parliamentary network.',
    cta: 'Book a consultation', proof: 'Backed by nine national caucuses — active since 2014.', img: '/assets/images/policymakers.webp',
  },
  partners: {
    eyebrow: 'For partners', title: 'A governed platform to build on.',
    lead: 'Bring your technology, diagnostics, capital or funding into a proven, standards-based regional health system — with a clearly defined role and measurable impact.',
    cta: 'Explore a partnership', proof: 'Standards-based, human-reviewed, sovereign by design.', img: '/assets/images/diagnostics.webp',
  },
  'civil-society': {
    eyebrow: 'For civil society', title: 'Your evidence, reaching the people who can act on it.',
    lead: 'The Hub creates a direct link between affected communities and political decision-makers — so community-generated evidence, recommendations and requests reach the politicians who have the mandate and resources to act.',
    cta: 'Share your community’s evidence', proof: 'A standing seat on the Civil Society Council — not a one-time submission.', img: '/assets/images/donors.webp',
  },
};

const GET: Record<Audience, { title: string; items: string[] }> = {
  policymakers: { title: 'What you get', items: [
    'A secure, invitation-only MP portal to draft and share laws and amendments',
    'AI-assisted drafting & comparative-law intelligence (human-reviewed)',
    'Decision briefs and budget-impact notes, ready for committee',
    'A peer network of nine national caucuses and former-MP advisors',
  ] },
  partners: { title: 'What partnership includes', items: [
    'Defined integration points across the Engine, Bridge and Shield',
    'Co-financing and partnership frameworks',
    'A live, working solution in a first country — the proof unit',
    'Transparent governance, reporting and independent oversight',
    'Association with a trusted parliamentary network',
    'Full budget and terms — available on request',
  ] },
  'civil-society': { title: 'What this creates for you', items: [
    'A direct channel from community evidence to the MPs who can act on it',
    'Your priorities turned into legislative asks — not just recommendations',
    'A seat on the Civil Society Council — standing oversight, not a one-off submission',
    'Aggregated, non-identifiable reporting — no individual patient data ever exposed',
    'Visible tracking of your input, from submission through to policy or budget outcome',
  ] },
};

const CLOSE: Record<Audience, { title: string; lead: string }> = {
  policymakers: { title: 'Turn your decision into delivered care.', lead: 'Start a confidential conversation about your country.' },
  partners: { title: 'Build with a proven regional platform.', lead: "Let's discuss where your organisation fits — from technology to funding." },
  'civil-society': { title: 'Turn lived experience into legal and financial commitment.', lead: "Share what your community needs — we'll make sure it reaches decision-makers who can act on it." },
};

const PROOF = [
  { value: 300, fmt: (n: number) => `${Math.round(n)}K+`, l: 'patients in scope' },
  { value: 9, fmt: (n: number) => String(Math.round(n)), l: 'national caucuses' },
  { value: 2014, fmt: (n: number) => String(Math.round(n)), l: 'network active since' },
];

const cssw = (w: string) => ({ '--w': w } as React.CSSProperties);

/* ---------------- POLICYMAKERS — a process ---------------- */
function Policymakers() {
  const { lang } = useI18n();
  const flow = [
    { t: 'Draft', d: 'AI-assisted, human-reviewed drafting in a secure MP portal.' },
    { t: 'Coordinate', d: 'Evidence, comparative law and stakeholders aligned.' },
    { t: 'Enact', d: 'Tabled, debated and passed — tracked in the app.' },
    { t: 'Deliver', d: 'Turned into financed, operational care.' },
  ];
  const why = [
    { t: 'Certainty', d: 'Draft, compare and table legislation faster — AI assistance that is transparent and human-reviewed at every step.' },
    { t: 'Sovereignty', d: 'Own your national health agenda as external funding recedes, on sovereign, in-region infrastructure.' },
    { t: 'Low risk', d: 'People decide, not machines. Full audit trail, no personal exposure, no unproven "AI breakthroughs".' },
  ];
  return (
    <>
      <section className="section aud-tension">
        <div className="container aud-tension-grid">
          <Reveal>
            <p className="eyebrow">{tr('The lag', lang)}</p>
            <h2>{tr('You have the will. The system has the lag.', lang)}</h2>
            <p className="section-lead">{tr('An average parliamentarian faces a deluge of legislation, and complex health policy stalls between commitment and action — for months, sometimes years. Donors withdraw, systems fragment, patients wait. The Hub closes that gap.', lang)}</p>
          </Reveal>
          <Reveal className="sig">
            <div className="sig-bar-row"><span className="sig-bar-lab">{tr('Conventional path', lang)}</span><div className="sig-bar-track"><div className="sig-bar barfill sig-slow" style={cssw('100%')}>{tr('Months–years', lang)}</div></div></div>
            <div className="sig-bar-row"><span className="sig-bar-lab">{tr('With the Hub', lang)}</span><div className="sig-bar-track"><div className="sig-bar barfill sig-fast" style={cssw('18%')}>{tr('Weeks', lang)}</div></div></div>
            <div className="sig-stat"><strong><CountUp value={22} />/26</strong><span>{tr('high-burden countries that raised domestic TB budgets had an active caucus', lang)}</span></div>
          </Reveal>
        </div>
      </section>

      {/* Signature structure: horizontal execution flow */}
      <section className="section aud-dark aud-flow">
        <div className="container">
          <Reveal><p className="eyebrow eyebrow-onDark">{tr('The execution loop', lang)}</p></Reveal>
          <Reveal><h2>{tr('From your decision to delivered care.', lang)}</h2></Reveal>
          <ol className="path">
            {flow.map((s, i) => (
              <Reveal as="li" className="path-step" delay={i * 90} key={s.t}>
                <span className="path-num">0{i + 1}</span>
                <div className="path-body"><strong>{tr(s.t, lang)}</strong><p>{tr(s.d, lang)}</p></div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Why — as rows (not cards) */}
      <section className="section section-alt">
        <div className="container">
          <Reveal><p className="eyebrow">{tr('Why it matters to you', lang)}</p></Reveal>
          <ul className="why-rows">
            {why.map((w, i) => (
              <Reveal as="li" delay={i * 80} key={w.t}>
                <span className="why-rows-n">0{i + 1}</span>
                <strong>{tr(w.t, lang)}</strong>
                <p>{tr(w.d, lang)}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

/* ---------------- PARTNERS — an exchange ---------------- */
function Partners() {
  const { lang } = useI18n();
  const bring = ['Technology, diagnostics or capital', 'Innovation, R&D and know-how', 'Distribution and supply-chain reach'];
  const gain = ['Access to expanding regional health markets', 'ESG/SDG-aligned, reportable impact', 'Association with a trusted parliamentary network'];
  const standards = ['ISO 27001-grade security', 'GDPR-equivalent protection', 'Human-in-the-loop review', 'Sovereign, in-region hosting'];
  const engage = [
    { t: 'Scope your role', d: 'Identify integration points across the Engine, Bridge and Shield.' },
    { t: 'Integrate', d: 'Plug in under governed, standards-based frameworks with human oversight.' },
    { t: 'Scale', d: 'Move from a proven pilot to nine-country regional reach.' },
  ];
  return (
    <>
      <section className="section aud-tension">
        <div className="container aud-tension-grid">
          <Reveal>
            <p className="eyebrow">{tr('The opportunity', lang)}</p>
            <h2>{tr('A region rebuilding its health systems — and it needs you.', lang)}</h2>
            <p className="section-lead">{tr('As external funding recedes, Eastern Europe & Central Asia is building self-reliant health infrastructure. Technology, diagnostics and capital with a governed home can lead here — this is shared value, not charity.', lang)}</p>
          </Reveal>
          <Reveal className="sig sig-bringgain">
            <div className="sig-col"><p className="sig-col-h">{tr('What you bring', lang)}</p><ul>{bring.map((x) => <li key={x}>{tr(x, lang)}</li>)}</ul></div>
            <div className="sig-swap" aria-hidden="true">⇄</div>
            <div className="sig-col sig-col-gain"><p className="sig-col-h">{tr('What you gain', lang)}</p><ul>{gain.map((x) => <li key={x}>{tr(x, lang)}</li>)}</ul></div>
          </Reveal>
        </div>
      </section>

      {/* Funder tier grid */}
      <section className="section">
        <div className="container">
          <TierGrid />
        </div>
      </section>

      {/* Signature structure: governed-by-design standards strip */}
      <section className="section aud-dark">
        <div className="container">
          <Reveal><p className="eyebrow eyebrow-onDark">{tr('Governed by design', lang)}</p></Reveal>
          <Reveal><h2>{tr('Credibility, built in.', lang)}</h2></Reveal>
          <div className="std-strip">
            {standards.map((s, i) => (
              <Reveal as="div" className="std-chip" delay={i * 80} key={s}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l7 3v5c0 4.4-3 7.4-7 8.9C8 17.4 5 14.4 5 11V6l7-3z" /><path d="M9 11.5l2 2 4-4" /></svg>
                <span>{tr(s, lang)}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Signature structure: engage steps */}
      <section className="section section-alt">
        <div className="container">
          <Reveal><p className="eyebrow">{tr('How you engage', lang)}</p></Reveal>
          <Reveal><h2>{tr('Three steps to a defined role.', lang)}</h2></Reveal>
          <div className="engage">
            {engage.map((s, i) => (
              <Reveal as="article" className="engage-step" delay={i * 90} key={s.t}>
                <span className="engage-n">0{i + 1}</span>
                <strong>{tr(s.t, lang)}</strong>
                <p>{tr(s.d, lang)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------------- CIVIL SOCIETY — evidence to commitment (kept lean) ---------------- */
function CivilSociety() {
  const { lang } = useI18n();
  const flow = [
    { t: 'Share', d: 'Community-generated evidence, recommendations and requests submitted through the Hub.' },
    { t: 'Reach', d: 'Routed directly to the parliamentarians and caucuses with the mandate to act.' },
    { t: 'Commit', d: 'Translated into legislative asks — new laws, amendments or policy changes.' },
    { t: 'Fund', d: 'Backed by budget allocation and tracked through to delivered care.' },
  ];
  return (
    <section className="section aud-dark aud-flow">
      <div className="container">
        <Reveal><p className="eyebrow eyebrow-onDark">{tr('The mechanism', lang)}</p></Reveal>
        <Reveal><h2>{tr('From lived experience to legal commitment.', lang)}</h2></Reveal>
        <Reveal><p className="section-lead">{tr('This is not consultation theatre — it is a mechanism that turns community priorities into political commitments, legal frameworks and concrete financial resources.', lang)}</p></Reveal>
        <ol className="path">
          {flow.map((s, i) => (
            <Reveal as="li" className="path-step" delay={i * 90} key={s.t}>
              <span className="path-num">0{i + 1}</span>
              <div className="path-body"><strong>{tr(s.t, lang)}</strong><p>{tr(s.d, lang)}</p></div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

const BODY = { policymakers: Policymakers, partners: Partners, 'civil-society': CivilSociety };

export function AudiencePage({ audience }: { audience: Audience }) {
  const { lang } = useI18n();
  const h = HERO[audience];
  const get = GET[audience];
  const close = CLOSE[audience];
  const Body = BODY[audience];
  useEffect(() => {
    const prev = document.title;
    document.title = `${tr(h.eyebrow, lang)} • EECA Lung Health Sovereignty Hub`;
    return () => { document.title = prev; };
  }, [h.eyebrow, lang]);

  return (
    <SiteLayout>
      <section className="page-hero aud-hero">
        <div className="aud-hero-bg" style={{ '--aud-img': `url(${h.img})` } as React.CSSProperties} aria-hidden="true" />
        <div className="page-hero-inner container">
          <p className="page-hero-eyebrow">{tr(h.eyebrow, lang)}</p>
          <h1>{tr(h.title, lang)}</h1>
          <p className="page-hero-lead">{tr(h.lead, lang)}</p>
          <div className="aud-hero-cta">
            <Link to="/consultation" className="btn btn-primary">{tr('Ready to Participate', lang)}</Link>
            <Link to="/concept-note" className="btn btn-secondary">{tr('Read the Concept Note', lang)}</Link>
          </div>
          <p className="aud-proof">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
            {tr(h.proof, lang)}
          </p>
        </div>
      </section>

      <Body />

      <section className="section section-alt aud-getwrap">
        <div className="container aud-get">
          <Reveal className="aud-get-head">
            <p className="eyebrow">{tr(get.title, lang)}</p>
            <h2>{tr('Built around what you need.', lang)}</h2>
          </Reveal>
          <ul className="aud-list">
            {get.items.map((g, i) => (
              <Reveal as="li" delay={i * 70} key={g}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                <span>{tr(g, lang)}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container">
          <ul className="proofband">
            {PROOF.map((p, i) => (
              <Reveal as="li" delay={i * 80} key={p.l}>
                <strong><CountUp value={p.value} format={p.fmt} /></strong>
                <span>{tr(p.l, lang)}</span>
              </Reveal>
            ))}
          </ul>
          <h2>{tr(close.title, lang)}</h2>
          <p className="cta-lead">{tr(close.lead, lang)}</p>
          <div className="cta-buttons">
            <BriefingCTA variant="primary" />
            <Link to="/consultation" className="btn btn-secondary">{tr('Ready to Participate', lang)}</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
