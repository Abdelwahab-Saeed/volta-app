import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // There is deliberately no manualChunks here. Please measure before adding
    // one back.
    //
    // Route-level splitting (React.lazy in App.jsx) does the real work. Adding
    // vendor chunks on top of it was measured and made the homepage WORSE:
    // splitting one large chunk into several compresses less efficiently and
    // duplicates helper code.
    //
    //   route splitting only ................ 227 KB gzip
    //   + react/router/i18n/embla chunks ..... 240 KB gzip
    //   + react-dom chunk only ............... 239 KB gzip
    //
    // The trade-off is caching: stable vendor chunks would survive a deploy
    // that only touched app code. Worth revisiting if repeat visits ever
    // outweigh first visits, but this site is failing on first-paint metrics.
    chunkSizeWarningLimit: 600,
  },
});
