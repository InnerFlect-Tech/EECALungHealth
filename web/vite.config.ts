import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
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
