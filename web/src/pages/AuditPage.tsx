import { useEffect, useMemo, useRef, useState } from 'react';
import { marked } from 'marked';
import { SiteLayout } from '../components/Layout';
import auditMd from '../content/EECA_WEBSITE_AND_PROJECT_AUDIT_2026-10-15.md?raw';
import '../audit.css';

// Unlinked audit page (route: /audit/2026-10-15). Not in the menu; reachable
// from the sitemap and by direct link. The Markdown file is the single source:
// this page renders it and offers it as a download.

const FILE_NAME = 'EECA_WEBSITE_AND_PROJECT_AUDIT_2026-10-15.md';
const PAGE_URL = 'https://eecalunghealth.com/audit/2026-10-15';
const STATUS = ['LIVE', 'IMPLEMENTED', 'PLANNED', 'UNVERIFIED', 'CONFIRMED'];

type TocItem = { id: string; text: string };

function slug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function renderAudit(md: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const renderer = new marked.Renderer();
  renderer.heading = ({ tokens, depth }) => {
    const text = tokens.map((t) => ('text' in t ? t.text : '')).join('');
    const id = slug(text);
    if (depth === 2) toc.push({ id, text });
    return `<h${depth} id="${id}">${marked.Parser.parseInline(tokens)}</h${depth}>`;
  };
  renderer.code = ({ text, lang }) => {
    const esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    if (lang === 'mermaid') return `<figure class="audit-diagram"><pre class="mermaid">${esc}</pre></figure>`;
    return `<pre class="audit-code"><code>${esc}</code></pre>`;
  };
  renderer.table = function (token) {
    return `<div class="audit-table-wrap">${marked.Renderer.prototype.table.call(this, token)}</div>`;
  };
  let html = marked.parse(md.replace(/^# .*\n/, ''), { renderer, async: false }) as string;
  // Status labels become pills.
  html = html.replace(
    new RegExp(`<strong>(${STATUS.join('|')})([^<]*)</strong>`, 'g'),
    (_m, s: string, rest: string) => {
      const pill = `<span class="audit-pill audit-pill-${s.toLowerCase()}">${s}</span>`;
      const tail = rest.replace(/^[,:]\s*/, ' ').trim();
      return tail ? `${pill} <strong>${tail}</strong>` : pill;
    },
  );
  return { html, toc };
}

export function AuditPage() {
  const { html, toc } = useMemo(() => renderAudit(auditMd), []);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(toc[0]?.id);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Website & Project Audit — 15 Oct 2026 • EECA Lung Health Hub';
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const prevHref = canonical?.href;
    if (canonical) canonical.href = PAGE_URL;
    return () => {
      document.title = prevTitle;
      if (canonical && prevHref) canonical.href = prevHref;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    import('mermaid').then(({ default: mermaid }) => {
      if (cancelled || !bodyRef.current) return;
      const dark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      mermaid.initialize({ startOnLoad: false, theme: dark ? 'dark' : 'neutral', securityLevel: 'strict' });
      mermaid.run({ nodes: bodyRef.current.querySelectorAll<HTMLElement>('pre.mermaid') }).catch(() => {});
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      // Query on every pass: the article's nodes can be replaced after mount.
      const heads = Array.from(bodyRef.current?.querySelectorAll<HTMLElement>('h2[id]') ?? []);
      if (!heads.length) return;
      const line = window.innerHeight * 0.3;
      let current = heads[0].id;
      for (const h of heads) if (h.getBoundingClientRect().top <= line) current = h.id;
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const download = () => {
    const url = URL.createObjectURL(new Blob([auditMd], { type: 'text/markdown;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = FILE_NAME;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <SiteLayout>
      <section className="audit-hero">
        <div className="container audit-hero-inner">
          <p className="audit-eyebrow">Evidence-based audit · 15 October 2026</p>
          <h1>Website &amp; Project Audit</h1>
          <p className="audit-lead">
            What is live on eecalunghealth.com, what exists only in code, what is planned, and what cannot yet be
            verified – drawn from the live site, the repository and the deployment logs.
          </p>
          <div className="audit-legend" aria-label="Status labels">
            {STATUS.slice(0, 4).map((s) => (
              <span key={s} className={`audit-pill audit-pill-${s.toLowerCase()}`}>{s}</span>
            ))}
          </div>
          <div className="audit-actions">
            <button type="button" className="btn btn-primary" onClick={download}>Download Markdown</button>
            <a className="audit-hero-link" href="#k-machine-readable-summary">JSON summary ↓</a>
          </div>
        </div>
      </section>

      <section className="section audit-section">
        <div className="container audit-grid">
          <nav className="audit-toc" aria-label="Contents">
            <p className="audit-toc-title">Contents</p>
            <ol>
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className={active === t.id ? 'is-active' : undefined}>{t.text}</a>
                </li>
              ))}
            </ol>
          </nav>
          <article ref={bodyRef} className="audit-body" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </section>
    </SiteLayout>
  );
}
