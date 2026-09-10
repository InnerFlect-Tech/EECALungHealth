import { useNoIndex } from '../../lib/useNoIndex';
import {
  ArtTech, IcTrophy, IcGlobe, IcShield, IcGear, IcChart, IcCheck, IcHandshake,
} from './icons';

const EMAIL = 'mailto:alesia.matusevych@globaltbcaucus.org?subject=Sovereignty%20Hub%20%E2%80%94%20Tech%20%26%20AI%20partnership';

export function PartnersTechPage() {
  useNoIndex('Partnership — Technology & AI | EECA Lung Health Sovereignty Hub');
  return (
    <div className="pp tech">
      {/* HERO */}
      <header className="pp-hero">
        <div className="pp-wrap pp-hero-inner">
          <div>
            <div className="eyebrow rise">A reference case for responsible AI in government</div>
            <h1 className="rise d1">The proof that governed AI can run a region’s health policy — powered by you.</h1>
            <p className="pp-lede rise d2">
              A real, government-facing deployment of AI used the right way: an enabling tool with human review
              at every step, on sovereign infrastructure, under ISO 27001-grade governance. The credible,
              high-trust public-sector case your AI-for-good programme is built to showcase.
            </p>
            <div className="pp-hero-cta rise d3">
              <a className="pp-btn pp-btn-primary" href={EMAIL}>Start a partnership conversation →</a>
              <a className="pp-btn pp-btn-ghost" href="#benefits">Why it fits</a>
            </div>
            <div className="pp-trustline rise d3"><IcShield className="" />Human-in-the-loop · full audit trail · no PII</div>
          </div>
          <div className="pp-art rise d2"><ArtTech /></div>
        </div>
      </header>

      {/* STATS */}
      <div className="pp-stats">
        <div className="pp-wrap pp-stats-grid">
          <div className="pp-stat"><b>9</b><span>National parliaments reached</span></div>
          <div className="pp-stat"><b>2</b><span>Live pilots (KZ &amp; AZ)</span></div>
          <div className="pp-stat"><b>300k+</b><span>Patients in scope</span></div>
          <div className="pp-stat"><b>100%</b><span>AI outputs human-reviewed</span></div>
        </div>
      </div>

      {/* WHY IT FITS */}
      <section className="pp-sec">
        <div className="pp-wrap">
          <div className="pp-urgency">
            <div className="big">Real</div>
            <p>
              Most “AI for good” pilots never touch real institutions. This one sits inside parliaments and
              health ministries across EECA. <b>AI assists; people decide.</b> Impact plus governance — that’s
              what makes it a flagship reference, not a risk.
            </p>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="pp-sec alt" id="benefits">
        <div className="pp-wrap">
          <div className="pp-head">
            <div className="eyebrow">What you get</div>
            <h2>The benefits — for your company</h2>
            <p>A documented, government-trusted deployment of your models, cloud, or capital.</p>
          </div>
          <div className="pp-grid">
            {[
              { I: IcTrophy, t: 'A flagship public-sector reference', d: 'A documented, government-trusted deployment of your platform — ideal for AI-for-good storytelling, case studies and policy engagement.' },
              { I: IcGlobe, t: 'Footprint in a strategic region', d: 'Real adoption across nine EECA states — where credible, sovereign AI partners are scarce.' },
              { I: IcShield, t: 'Responsible-AI proof points', d: 'Human-in-the-loop, confidence indicators, audit trails, no PII, sovereign hosting — the governance story your policy team wants to tell.' },
              { I: IcGear, t: 'Efficient deployment of support', d: 'We can absorb cash grants, cloud/compute credits, model access, or engineering time — each maps to a defined component.' },
              { I: IcChart, t: 'Measurable outcomes', d: 'Legislative turnaround, budget decisions influenced, continuity-of-care alerts acted on — hard metrics for impact reporting.' },
              { I: IcHandshake, t: 'A named partnership', d: 'Your logo on a governed-AI reference case we build with you, scoped to your programme’s criteria.' },
            ].map(({ I, t, d }) => (
              <article className="pp-card" key={t}>
                <div className="pp-ico"><I className="" /></div>
                <h3>{t}</h3><p>{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO PARTNER */}
      <section className="pp-sec">
        <div className="pp-wrap">
          <div className="pp-head"><div className="eyebrow">How you can help</div><h2>Three ways to partner</h2></div>
          <div className="pp-steps">
            <div className="pp-step"><div className="n">1</div><h4>Fund</h4><p>A grant toward the 24-month regional programme or a named component. Fit: Google.org (AI for Government), McGovern Foundation, AWS IMAGINE. Full budget on request.</p></div>
            <div className="pp-step"><div className="n">2</div><h4>Power</h4><p>Cloud/compute credits and model access to run the platform sustainably. Fit: Microsoft Azure, Anthropic, NVIDIA Inception, OpenAI.</p></div>
            <div className="pp-step"><div className="n">3</div><h4>Build</h4><p>Engineering time, solution architecture and responsible-AI review. Fit: Google.org engineers, Microsoft AI for Good Lab, IBM.</p></div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="pp-sec tinted">
        <div className="pp-wrap">
          <div className="pp-head"><div className="eyebrow">The governance posture</div><h2>Designed to pass your trust &amp; safety review</h2></div>
          <div className="pp-trust">
            {['Human-in-the-loop on all AI outputs', 'Full audit trail & logging', 'Confidence / uncertainty shown', 'No personally identifiable data', 'ISO 27001-grade security', 'Sovereign / in-region hosting', 'Independent external audit'].map((c) => (
              <span className="pp-chip" key={c}><IcCheck className="" />{c}</span>
            ))}
          </div>
          <div className="pp-logos">
            <span>In collaboration with&nbsp;<b>the Global TB Caucus</b></span>
            <span>Aligned with&nbsp;<b>WHO Europe — TB-Free Central Asia</b></span>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="pp-sec">
        <div className="pp-wrap">
          <div className="pp-quote">
            <p>This is not a chatbot demo. It’s governed AI in production, inside real parliaments — assisting the people who decide, and protecting continuity of care for 300,000+ patients.</p>
            <cite>— The case for partnering on the Sovereignty Hub</cite>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pp-sec alt">
        <div className="pp-wrap">
          <div className="pp-cta-band">
            <h2>Put your name on the reference case for governed AI.</h2>
            <p>A funding, credits, or technical-partnership commitment — scoped to your programme’s criteria, with the impact reporting your team needs.</p>
            <a className="pp-btn pp-btn-primary" href={EMAIL}>Start a partnership conversation →</a>
          </div>
        </div>
      </section>

      <footer className="pp-foot">EECA Lung Health Sovereignty Hub · Confidential partnership brief — not for public distribution</footer>
    </div>
  );
}
