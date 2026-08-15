import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNoIndex } from '../lib/useNoIndex';
import '../design.css';

/** Reads a computed CSS custom property from :root. */
function useToken(name: string) {
  const [val, setVal] = useState('');
  useEffect(() => {
    setVal(getComputedStyle(document.documentElement).getPropertyValue(name).trim());
  }, [name]);
  return val;
}

function Swatch({ token, dark }: { token: string; dark?: boolean }) {
  const val = useToken(token);
  return (
    <div className="ds-swatch">
      <div className={`ds-chip${dark ? ' ds-chip-dark' : ''}`} style={{ background: `var(${token})` }} />
      <code>{token}</code>
      <span className="ds-hex">{val || '–'}</span>
    </div>
  );
}

const BRAND = ['--color-primary', '--color-primary-dark', '--color-primary-light', '--color-accent', '--color-accent-light', '--color-accent-dark'];
const INK = ['--ink-900', '--ink-800', '--ink-700'];
const NEUTRALS = ['--neutral-25', '--neutral-50', '--neutral-100', '--neutral-200', '--neutral-300', '--neutral-400', '--neutral-500', '--neutral-600', '--neutral-700', '--neutral-800', '--neutral-900'];
const SEMANTIC = ['--color-bg', '--color-bg-alt', '--color-surface', '--color-text', '--color-text-muted', '--color-border', '--color-border-strong'];
const RADII = ['--radius-sm', '--radius', '--radius-md', '--radius-lg', '--radius-full'];
const SHADOWS = ['--shadow-xs', '--shadow-sm', '--shadow-md', '--shadow-lg', '--shadow-xl'];
const SPACES = ['--space-xs', '--space-sm', '--space-md', '--space-lg', '--space-xl', '--space-2xl', '--space-3xl'];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section className="ds-section" id={id}>
      <h2 className="ds-h2">{title}</h2>
      {children}
    </section>
  );
}

export function DesignSystemPage() {
  useNoIndex('Design System • EECA Hub');
  return (
    <div className="ds-page">
      <header className="ds-header">
        <div className="ds-header-inner">
          <div>
            <p className="ds-eyebrow">EECA Hub</p>
            <h1 className="ds-h1">Design System</h1>
            <p className="ds-lead">The single source of truth for tokens and components. We review and accept design changes here – everything on the site reads from these values.</p>
          </div>
          <Link to="/" className="ds-back">← Back to site</Link>
        </div>
        <nav className="ds-nav">
          {['Color', 'Typography', 'Spacing', 'Radius', 'Elevation', 'Buttons', 'Components'].map((s) => (
            <a key={s} href={`#${s.toLowerCase()}`}>{s}</a>
          ))}
        </nav>
      </header>

      <main className="ds-main">
        <Section id="color" title="Color">
          <h3 className="ds-h3">Brand</h3>
          <div className="ds-swatches">{BRAND.map((t) => <Swatch key={t} token={t} />)}</div>
          <h3 className="ds-h3">Ink surfaces</h3>
          <div className="ds-swatches">{INK.map((t) => <Swatch key={t} token={t} dark />)}</div>
          <h3 className="ds-h3">Neutral ramp</h3>
          <div className="ds-swatches">{NEUTRALS.map((t) => <Swatch key={t} token={t} />)}</div>
          <h3 className="ds-h3">Semantic</h3>
          <div className="ds-swatches">{SEMANTIC.map((t) => <Swatch key={t} token={t} />)}</div>
        </Section>

        <Section id="typography" title="Typography">
          <div className="ds-type-row"><span className="ds-type-meta">Display / Space Grotesk 700</span><p className="ds-type-sample" style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em' }}>Big decisions, real delivery.</p></div>
          <div className="ds-type-row"><span className="ds-type-meta">H2 / Space Grotesk 2.25rem</span><p className="ds-type-sample" style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--color-text)' }}>The Solution: One Integrated System</p></div>
          <div className="ds-type-row"><span className="ds-type-meta">H3 / Space Grotesk 1.25rem</span><p className="ds-type-sample" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--color-text)' }}>The Engine – Sovereignty App</p></div>
          <div className="ds-type-row"><span className="ds-type-meta">Lead / Inter 1.1875rem</span><p className="ds-type-sample" style={{ fontSize: '1.1875rem', color: 'var(--color-text-muted)', maxWidth: '48rem' }}>A multi-year regional programme, entered through a 6-month Foundation Phase in Kazakhstan that delivers a working solution before any further funding is asked. Full budget available on request.</p></div>
          <div className="ds-type-row"><span className="ds-type-meta">Body / Inter 1rem</span><p className="ds-type-sample" style={{ maxWidth: '48rem' }}>The Hub turns political will into lung-health action – a fast, governed platform built on the Global TB Caucus network across nine countries in Eastern Europe & Central Asia. AI is an enabling tool with human review at every step, never the decision-maker.</p></div>
          <div className="ds-type-row"><span className="ds-type-meta">Eyebrow / caps</span><p className="ds-type-sample" style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-primary)' }}>Regional stakeholder consultation</p></div>
        </Section>

        <Section id="spacing" title="Spacing scale">
          <div className="ds-scale">
            {SPACES.map((t) => (
              <div className="ds-scale-row" key={t}>
                <code>{t}</code>
                <span className="ds-bar" style={{ width: `var(${t})`, background: 'var(--color-primary)' }} />
              </div>
            ))}
          </div>
        </Section>

        <Section id="radius" title="Radius">
          <div className="ds-swatches">
            {RADII.map((t) => (
              <div className="ds-swatch" key={t}>
                <div className="ds-radius-box" style={{ borderRadius: `var(${t})` }} />
                <code>{t}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section id="elevation" title="Elevation">
          <div className="ds-swatches">
            {SHADOWS.map((t) => (
              <div className="ds-swatch" key={t}>
                <div className="ds-shadow-box" style={{ boxShadow: `var(${t})` }} />
                <code>{t}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section id="buttons" title="Buttons & links">
          <div className="ds-row-dark">
            <a className="btn btn-primary" href="#buttons">Primary action</a>
            <a className="btn btn-secondary" href="#buttons">Secondary</a>
            <a className="btn btn-hero-secondary" href="#buttons">On dark</a>
          </div>
          <p><a className="link-arrow" href="#buttons">Text link with arrow</a></p>
        </Section>

        <Section id="components" title="Components">
          <h3 className="ds-h3">Card</h3>
          <div className="benefits-grid">
            <article className="benefit-card">
              <div className="benefit-icon" aria-hidden="true">$</div>
              <h3>The Engine</h3>
              <p className="benefit-tagline">Strengthens lawmaking &amp; budgeting</p>
              <p>Equips ministries and parliaments with budget reviews, resource mapping, policy costing, and AI-assisted drafting (human-reviewed).</p>
            </article>
            <article className="crisis-card">
              <span className="crisis-num">01</span>
              <h3>Persistent lung-health crises</h3>
              <p>18 high-priority countries account for ~85% of TB and ~99% of MDR-TB.</p>
            </article>
          </div>
          <h3 className="ds-h3">Stat card (on ink)</h3>
          <div className="ds-row-dark">
            <aside className="hero-statcard" style={{ maxWidth: '26rem' }}>
              <p className="statcard-eyebrow">The opportunity</p>
              <p className="statcard-text">A multi-year regional programme, entered at a 6-month Foundation Phase – full budget on request.</p>
              <ul className="statgrid">
                <li><strong>300K+</strong><span>vulnerable patients</span></li>
                <li><strong>9</strong><span>national caucuses</span></li>
                <li><strong>~1 week</strong><span>decision to action</span></li>
                <li><strong>6&nbsp;mo</strong><span>Foundation Phase</span></li>
              </ul>
            </aside>
          </div>
        </Section>
      </main>
    </div>
  );
}
