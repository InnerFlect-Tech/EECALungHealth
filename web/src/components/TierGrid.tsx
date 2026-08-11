import { T } from '../i18n/I18nProvider';

type Tier = {
  key: 'founding' | 'regional' | 'platform';
  when: string;
  benefits: number;
};

const TIERS: Tier[] = [
  { key: 'founding', when: 'tier-founding-when', benefits: 5 },
  { key: 'regional', when: 'tier-regional-when', benefits: 5 },
  { key: 'platform', when: 'tier-platform-when', benefits: 5 },
];

export function TierGrid() {
  return (
    <section className="tier-section">
      <div className="tier-head">
        <p className="eyebrow"><T k="tiers-eyebrow" /></p>
        <h2 className="tier-title"><T k="tiers-title" /></h2>
        <p className="section-lead"><T k="tiers-lead" /></p>
      </div>

      <div className="tier-axis" aria-hidden="true">
        {TIERS.map((tier, i) => (
          <div className="tier-axis-point" key={tier.key}>
            <span>0{i + 1} · <T k={tier.when} /></span>
          </div>
        ))}
      </div>

      <div className="tier-grid">
        {TIERS.map((tier) => (
          <article className="tier-card" key={tier.key}>
            <header className="tier-card-head">
              <p className="tier-badge"><T k={`tier-${tier.key}-name`} /></p>
              <p className="tier-tagline"><T k={`tier-${tier.key}-tagline`} /></p>
            </header>
            <ul className="tier-benefits">
              {Array.from({ length: tier.benefits }).map((_, i) => (
                <li key={i}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <T k={`tier-${tier.key}-b${i + 1}`} />
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
