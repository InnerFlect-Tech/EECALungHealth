import { rmSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The review and comparison editions of the concept note live in public/ so the
// local preview server can serve them to the PDF printer, but they carry
// internal commentary — unsigned-off phase timings, superseded budget figures,
// notes on where the live note departs from the source doc. They must not reach
// the public site. The deploy rsyncs without --delete, so anything published
// once stays on the server until someone removes it by hand; keeping them out
// of dist/ in the first place is the only safe point to stop them.
const INTERNAL_ONLY = [
  'concept-note-body-full.html',
  'concept-note-body-diff.html',
  'concept-note-body-ru-diff.html',
  'concept-note-full.pdf',
  'concept-note-diff.pdf',
  'concept-note-ru-diff.pdf',
];

function stripInternalEditions() {
  return {
    name: 'strip-internal-concept-note-editions',
    apply: 'build' as const,
    closeBundle() {
      for (const file of INTERNAL_ONLY) {
        rmSync(join(__dirname, 'dist', file), { force: true });
      }
      console.log(`Excluded ${INTERNAL_ONLY.length} internal concept note files from dist/`);
    },
  };
}

export default defineConfig({
  base: '/',
  plugins: [react(), stripInternalEditions()],
  build: {
    outDir: 'dist',
    // Lightning CSS (Vite's default CSS minifier) strips the standard
    // `backdrop-filter` declaration whenever it sits alongside
    // `-webkit-backdrop-filter`, keeping only the legacy prefix — which
    // current Chrome no longer honors on its own. Disable CSS minification
    // to keep both declarations as written (this build has no esbuild
    // dependency to fall back to).
    cssMinify: false,
  },
});
