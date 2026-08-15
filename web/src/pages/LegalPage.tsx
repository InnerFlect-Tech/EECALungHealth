import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from '../components/Layout';
import '../legal.css';

type Doc = 'privacy' | 'terms' | 'disclaimer';

const UPDATED = 'Last updated: 14 July 2026';

const META: Record<Doc, { eyebrow: string; title: string; lead: string }> = {
  privacy: {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    lead: 'How the EECA Lung Health Sovereignty Hub collects, uses, and protects personal data.',
  },
  terms: {
    eyebrow: 'Legal',
    title: 'Terms of Use',
    lead: 'The terms that govern your use of this website.',
  },
  disclaimer: {
    eyebrow: 'Legal',
    title: 'Disclaimer',
    lead: 'Important notices about the purpose and limits of the information on this site.',
  },
};

function PrivacyBody() {
  return (
    <>
      <p>
        The EECA Lung Health Sovereignty Hub ("the Hub", "we") respects your privacy. This policy
        explains what personal data we collect through this website, why we collect it, and the
        rights you have over it. We follow GDPR-equivalent principles across the region.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li><strong>Consultation submissions</strong> – the information you choose to provide in the consultation form (such as name, email, organisation or role, country, your responses, and any files you attach).</li>
        <li><strong>Technical data</strong> – standard server logs (e.g. IP address, browser type) generated when you visit, used only for security and reliability.</li>
        <li><strong>Essential cookies</strong> – a single session cookie is used only for the private administration area. The public site sets no marketing or tracking cookies.</li>
      </ul>
      <h2>Why we use it</h2>
      <p>
        To respond to consultation requests, coordinate stakeholder engagement, and improve the
        initiative. Our legal bases are your consent (which you may withdraw at any time) and our
        legitimate interest in advancing regional lung-health policy.
      </p>
      <h2>How we share it</h2>
      <p>
        We do not sell personal data. Information is accessible only to the Hub's core team and, where
        relevant, named partners under confidentiality, plus service providers (such as hosting) acting
        on our instructions. Where possible we use sovereign, in-region hosting and work with aggregated,
        non-identifiable data.
      </p>
      <h2>How long we keep it</h2>
      <p>We retain personal data only for as long as needed for the engagement it relates to, then delete or anonymise it.</p>
      <h2>Your rights</h2>
      <p>
        You may request access to, correction, or deletion of your data; object to or restrict its
        processing; request portability; and withdraw consent. You also have the right to complain to a
        data-protection authority.
      </p>
      <h2>Security</h2>
      <p>We apply ISO 27001-grade practices, access controls, and privacy-by-design across our systems.</p>
      <h2>Contact</h2>
      <p>To exercise any right or ask a question, reach us through the <Link to="/consultation#consultation-form">consultation form</Link>.</p>
    </>
  );
}

function TermsBody() {
  return (
    <>
      <p>By accessing this website you agree to these terms. If you do not agree, please do not use the site.</p>
      <h2>Purpose</h2>
      <p>This site is provided for general information about the EECA Lung Health Sovereignty Hub. Content may change without notice.</p>
      <h2>No warranty</h2>
      <p>The site and its content are provided "as is", without warranties of any kind. We do not guarantee accuracy, completeness, or availability.</p>
      <h2>Intellectual property</h2>
      <p>All content, branding, and materials on this site are owned by the Hub or its partners and may not be reproduced without permission.</p>
      <h2>Acceptable use</h2>
      <p>You agree not to misuse the site, attempt to disrupt it, or use it for any unlawful purpose.</p>
      <h2>External links</h2>
      <p>Links to third-party sites are provided for convenience; we are not responsible for their content or practices.</p>
      <h2>Limitation of liability</h2>
      <p>To the fullest extent permitted by law, the Hub is not liable for any loss arising from use of, or reliance on, this site.</p>
      <h2>Changes</h2>
      <p>We may update these terms from time to time. Continued use of the site constitutes acceptance of the current version.</p>
      <h2>Contact</h2>
      <p>Questions about these terms can be sent via the <Link to="/consultation#consultation-form">consultation form</Link>.</p>
    </>
  );
}

function DisclaimerBody() {
  return (
    <>
      <p>The information on this website is provided for general information only. Please note the following.</p>
      <h2>Not an offer or solicitation</h2>
      <p>Nothing on this site constitutes an offer, solicitation, or recommendation of any investment, security, or financial instrument, in any jurisdiction. Any engagement with prospective partners is conducted separately, under confidentiality.</p>
      <h2>Indicative figures and plans</h2>
      <p>Programme figures, phases, timelines, and outcomes described here are indicative, may change, and are shared in full with partners in confidence. They are not commitments.</p>
      <h2>Not medical advice</h2>
      <p>Content on this site is not medical advice and should not be relied upon for clinical or individual health decisions.</p>
      <h2>Forward-looking statements</h2>
      <p>Statements about future plans or impact are aspirational and subject to funding, partnership, and regional conditions.</p>
      <h2>No reliance</h2>
      <p>You should not rely on any statement here without seeking appropriate professional, legal, or financial advice.</p>
    </>
  );
}

const BODIES = {
  privacy: PrivacyBody,
  terms: TermsBody,
  disclaimer: DisclaimerBody,
} as const;

export function LegalPage({ doc }: { doc: Doc }) {
  const meta = META[doc];
  useEffect(() => {
    const prev = document.title;
    document.title = `${meta.title} • EECA Lung Health Sovereignty Hub`;
    return () => {
      document.title = prev;
    };
  }, [meta.title]);
  const Body = BODIES[doc];
  return (
    <SiteLayout>
      <section className="page-hero">
        <div className="page-hero-inner container">
          <p className="page-hero-eyebrow">{meta.eyebrow}</p>
          <h1>{meta.title}</h1>
          <p className="page-hero-lead">{meta.lead}</p>
        </div>
      </section>
      <section className="section">
        <div className="container legal-prose">
          <p className="legal-updated">{UPDATED}</p>
          <Body />
          <p className="legal-back">
            <Link className="link-arrow" to="/">Back to Homepage</Link>
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
