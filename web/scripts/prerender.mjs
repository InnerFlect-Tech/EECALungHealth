// Post-build prerender: renders every public route in headless Chrome and
// writes the resulting HTML into dist/, so crawlers and AI tools that don't run
// JavaScript (ChatGPT browsing, Perplexity, link previews) see the real text
// instead of an empty <div id="root">. Visitors still get the normal SPA — the
// client re-renders over this markup on load.
//
// Output: dist/index.html (home), dist/<route>.html for every other route,
// dist/app-shell.html (the untouched SPA shell, used as the fallback for
// admin/token routes), and dist/sitemap.xml generated from PUBLIC_ROUTES.
// .htaccess maps /team -> team.html, etc.

import { readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import puppeteer from 'puppeteer';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const SITE = 'https://eecalunghealth.com';

// Every route here is prerendered and listed in the sitemap.
const PUBLIC_ROUTES = [
  { path: '/', priority: '1.0' },
  { path: '/solution', priority: '0.9' },
  { path: '/policymakers', priority: '0.9' },
  { path: '/partners', priority: '0.9' },
  { path: '/civil-society', priority: '0.9' },
  { path: '/for-funders', priority: '0.9' },
  { path: '/concept-note', priority: '0.8' },
  { path: '/governance/financials', priority: '0.7' },
  { path: '/team', priority: '0.7' },
  { path: '/consultation', priority: '0.8' },
  { path: '/consultation/funder', priority: '0.6' },
  { path: '/contact', priority: '0.6' },
  { path: '/demo/parliamentary-intelligence', priority: '0.5' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  { path: '/disclaimer', priority: '0.3', changefreq: 'yearly' },
  // Unlinked audit page: reachable from the sitemap and by direct link only.
  { path: '/audit/2026-10-15', priority: '0.4', changefreq: 'yearly' },
  { path: '/demo/care-continuity', priority: '0.5' },
];

// Routes deliberately left client-only: private, parameterised, redirects,
// dev-only drafts, or the internal design reference.
const EXCLUDED_ROUTES = new Set([
  '/admin', '/admin/login', '/admin/responses/:id', '/admin/budgets', '/admin/budgets/:id',
  '/budget/:token', '/donors', '/design', '*',
  '/partners/foundations', '/partners/tech', '/partners/targets',
  '/meeting/2026-10-15', // internal meeting worksheet: noindex, not in sitemap
]);

// Minimum visible text for a page to count as rendered.
const MIN_TEXT_CHARS = 400;

async function checkRoutesInSync() {
  const app = await readFile(join(ROOT, 'src/App.tsx'), 'utf8');
  const declared = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);
  const known = new Set([...PUBLIC_ROUTES.map((r) => r.path), ...EXCLUDED_ROUTES]);
  const missing = declared.filter((p) => !known.has(p));
  if (missing.length) {
    throw new Error(
      `Routes in src/App.tsx not listed in scripts/prerender.mjs: ${missing.join(', ')}\n` +
      'Add each to PUBLIC_ROUTES (public page) or EXCLUDED_ROUTES (private/redirect).',
    );
  }
}

function outFile(path) {
  return path === '/' ? join(DIST, 'index.html') : join(DIST, `${path.slice(1)}.html`);
}

async function writeSitemap() {
  const urls = PUBLIC_ROUTES.map(({ path, priority, changefreq = 'monthly' }) =>
    `  <url><loc>${SITE}${path}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`,
  ).join('\n');
  await writeFile(
    join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
}

async function main() {
  await checkRoutesInSync();
  // Keep the bare shell before index.html is overwritten with the home page.
  await copyFile(join(DIST, 'index.html'), join(DIST, 'app-shell.html'));

  const server = await preview({ root: ROOT, preview: { port: 4179, strictPort: true }, logLevel: 'warn' });
  const base = `http://localhost:4179`;
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const failures = [];
  try {
    const page = await browser.newPage();
    // Prerender in English regardless of the build machine's locale.
    await page.evaluateOnNewDocument(() => {
      try { localStorage.setItem('eeca-hub-lang', 'en'); } catch { /* ignore */ }
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    });
    for (const { path } of PUBLIC_ROUTES) {
      await page.goto(base + path, { waitUntil: 'networkidle0', timeout: 60_000 });
      await page.waitForFunction(() => document.getElementById('root')?.childElementCount > 0);
      const text = await page.evaluate(() => document.getElementById('root').innerText.trim());
      if (text.length < MIN_TEXT_CHARS) failures.push(`${path} (${text.length} chars)`);
      const html = '<!doctype html>\n' + await page.evaluate(() => document.documentElement.outerHTML);
      const file = outFile(path);
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, html);
      console.log(`prerendered ${path} -> ${file.slice(DIST.length + 1)} (${text.length} chars)`);
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.httpServer.close(resolve));
  }
  if (failures.length) throw new Error(`Pages rendered with too little text: ${failures.join(', ')}`);
  await writeSitemap();
  console.log(`sitemap.xml: ${PUBLIC_ROUTES.length} URLs`);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
