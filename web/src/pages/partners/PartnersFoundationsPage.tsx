import { useNoIndex } from '../../lib/useNoIndex';
import {
  ArtFoundations, IcBuilding, IcGlobe, IcLock, IcChart, IcHandshake, IcTrophy,
  IcBolt, IcLink, IcShield, IcCheck,
} from './icons';

const EMAIL = 'mailto:alesia.matusevych@globaltbcaucus.org?subject=Sovereignty%20Hub%20%E2%80%94%20Foundation%20partnership';

export function PartnersFoundationsPage() {
  useNoIndex('Partnership — National Foundations | EECA Lung Health Sovereignty Hub');
  return (
    <div className="pp found">
      {/* HERO */}
      <header className="pp-hero">
        <div className="pp-wrap pp-hero-inner">
          <div>
            <div className="eyebrow rise">A national legacy in health sovereignty</div>
            <h1 className="rise d1">Protect a generation’s lung health — under your nation’s name, on your nation’s terms.</h1>
            <p className="pp-lede rise d2">
              A rare chance to put your foundation’s name on a permanent, sovereign health institution for
              Eastern Europe & Central Asia — built in-country, governed in-region, and measured in lives.
            </p>
            <div className="pp-hero-cta rise d3">
              <a className="pp-btn pp-btn-primary" href={EMAIL}>Request the proposal &amp; a trustee briefing →</a>
              <a className="pp-btn pp-btn-ghost" href="#benefits">See the benefits</a>
            </div>
            <div className="pp-trustline rise d3"><IcLock className="" />Sovereign, in-region data · ISO 27001-grade governance</div>
          </div>
          <div className="pp-art rise d2"><ArtFoundations /></div>
        </div>
      </header>

      {/* STATS */}
      <div className="pp-stats">
        <div className="pp-wrap pp-stats-grid">
          <div className="pp-stat"><b>2014</b><span>Network active in EECA since</span></div>
          <div className="pp-stat"><b>9</b><span>National parliaments (TB Caucus)</span></div>
          <div className="pp-stat"><b>300k+</b><span>Vulnerable patients</span></div>
          <div className="pp-stat"><b>24&nbsp;mo</b><span>Multi-phase programme</span></div>
        </div>
      </div>

      {/* WHY NOW */}
      <section className="pp-sec">
        <div className="pp-wrap">
          <div className="pp-urgency">
            <div className="big">2025</div>
            <p>
              As global donors withdraw from the region, national institutions must step forward.
              <b> Whoever leads this transition defines the next decade of health sovereignty in EECA</b> — and a
              foundation that carries a national legacy is uniquely placed to claim it.
            </p>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="pp-sec alt" id="benefits">
        <div className="pp-wrap">
          <div className="pp-head">
            <div className="eyebrow">What your foundation gains</div>
            <h2>The benefits — for you</h2>
            <p>Not a one-off donation. A flagship, prestige-bearing institution aligned to your mission.</p>
          </div>
          <div className="pp-grid">
            {[
              { I: IcBuilding, t: 'A named, lasting institution', d: 'A permanent regional health platform that can carry your foundation’s name and legacy for decades.' },
              { I: IcGlobe, t: 'National prestige & health diplomacy', d: 'Position your country as the regional leader, convening nine EECA parliaments in collaboration with the Global TB Caucus.' },
              { I: IcLock, t: 'Sovereignty by design', d: 'Aggregated, non-identifiable data hosted in-country/in-region under ISO 27001-grade security. Control stays national.' },
              { I: IcChart, t: 'Measurable, reportable impact', d: 'Clear deliverables and dashboards — legislation, budget decisions, patients protected — for credible annual reporting.' },
              { I: IcHandshake, t: 'Co-funding leverage', d: 'Your lead gift de-risks and unlocks matching support from WHO, ADB, the World Bank and the Global Fund.' },
              { I: IcTrophy, t: 'Dignity, not dependency', d: 'A model of self-reliance: countries owning their data, their law, and their continuity of care.' },
            ].map(({ I, t, d }) => (
              <article className="pp-card" key={t}>
                <div className="pp-ico"><I className="" /></div>
                <h3>{t}</h3><p>{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT IT IS */}
      <section className="pp-sec">
        <div className="pp-wrap">
          <div className="pp-head">
            <div className="eyebrow">What you would be funding</div>
            <h2>One governed platform, three components</h2>
          </div>
          <div className="pp-comp">
            <div className="c"><div className="pp-ico"><IcBolt className="" /></div><span className="tag">ENGINE</span><h4>Faster, better law</h4><p>A secure portal for MPs with AI-assisted drafting and comparative-law intelligence — every output human-reviewed. No personal data.</p></div>
            <div className="c"><div className="pp-ico"><IcLink className="" /></div><span className="tag">BRIDGE</span><h4>Smart diplomacy</h4><p>Evidence-based regional cooperation and decision briefs that turn political will into concrete policy and financing.</p></div>
            <div className="c"><div className="pp-ico"><IcShield className="" /></div><span className="tag">SHIELD</span><h4>Continuity of care</h4><p>Early-warning and dashboards that protect patients during displacement, funding transitions and supply shocks.</p></div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="pp-sec tinted">
        <div className="pp-wrap">
          <div className="pp-head"><div className="eyebrow">Why it can be trusted</div><h2>Governance, not “AI breakthroughs”</h2></div>
          <div className="pp-trust">
            {['Aggregated / non-identifiable data only', 'ISO 27001-grade security', 'GDPR-equivalent protection', 'Sovereign / in-region hosting', 'Independent audit', 'Human-in-the-loop AI'].map((c) => (
              <span className="pp-chip" key={c}><IcCheck className="" />{c}</span>
            ))}
          </div>
          <div className="pp-logos">
            <span>In collaboration with&nbsp;<b>the Global TB Caucus</b></span>
            <span>Aligned with&nbsp;<b>WHO Europe — TB-Free Central Asia</b></span>
            <span>Co-funding path:&nbsp;<b>ADB · World Bank · Global Fund</b></span>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="pp-sec">
        <div className="pp-wrap">
          <div className="pp-quote">
            <p>“Too many laws, too little implementation.” The Hub closes that gap — turning political will into delivered care, fast, and under national ownership.</p>
            <cite>— The case for the EECA Lung Health Sovereignty Hub</cite>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pp-sec alt">
        <div className="pp-wrap">
          <div className="pp-cta-band">
            <h2>Lead a legacy your nation will remember.</h2>
            <p>A lead philanthropic investment toward the 24-month regional programme — or a named component (Engine, Bridge, or Shield). We will align scope, recognition and reporting to your foundation’s priorities. Full budget and terms available on request.</p>
            <a className="pp-btn pp-btn-primary" href={EMAIL}>Request the proposal &amp; a trustee briefing →</a>
          </div>
        </div>
      </section>

      <footer className="pp-foot">EECA Lung Health Sovereignty Hub · Confidential partnership brief — not for public distribution</footer>
    </div>
  );
}
