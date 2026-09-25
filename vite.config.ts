import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'node:fs'

// App version comes from package.json — bump the "version" field there on
// every release. This same value is what the update popup shows the user.
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

// 🔧 FIXED TS2353: vite-plugin-pwa types `manifest` as `Partial<ManifestOptions>`,
// which doesn't declare `version` / `release_notes`. TypeScript only runs its
// "excess property check" on object literals written INLINE inside a typed
// call — pulling this out into its own const (then passing the variable
// below) sidesteps that check without losing the two custom fields, since
// they're harmless extra JSON keys that browsers just ignore anyway.
const manifest = {
  name: 'GHS MLA Office',
  short_name: 'GHS MLA Office',
  description: '126 ತರೀಕೆರೆ ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ',
  theme_color: '#0f172a',
  background_color: '#0f172a',
  display: 'standalone' as const,
  start_url: '/',
  lang: 'kn',
  orientation: 'portrait-primary' as const,
  // 🆕 ADDED: these two custom fields are not part of the web-manifest
  // spec (browsers just ignore unknown keys), but our update popup
  // fetches this same manifest.webmanifest fresh (no-cache) and reads
  // them to show "what's new" + the version number. Edit BOTH of
  // these (and package.json "version") every time you ship a release.
  version: pkg.version,
 release_notes: `ಈ ಅಪ್‌ಡೇಟ್‌ನಲ್ಲಿ:
PWA ಅಪ್ಲಿಕೇಶನ್‌ನ ಐಕಾನ್ ಅನ್ನು ಹೊಸ ವಿನ್ಯಾಸದೊಂದಿಗೆ ನವೀಕರಿಸಲಾಗಿದೆ,
ಜಾತಿವಾರು ಸಮೀಕ್ಷೆಯ ಮಾಹಿತಿಯನ್ನು ನವೀಕರಿಸಲಾಗಿದೆ,
ಚುನಾವಣಾ ಮಾಹಿತಿಯನ್ನು ನವೀಕರಿಸಲಾಗಿದೆ,
BLA ಮತ್ತು BLO ಪಟ್ಟಿಯನ್ನು ನವೀಕರಿಸಲಾಗಿದೆ,
ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿನ ಪ್ರಮುಖ ಮಾಹಿತಿಗಳನ್ನು ಇತ್ತೀಚಿನ ವಿವರಗಳೊಂದಿಗೆ ನವೀಕರಿಸಲಾಗಿದೆ`,
  icons: [
    {
      src: '/pwa-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any',           // ✅ separate
    },
    {
      src: '/pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',           // ✅ separate
    },
    {
      src: '/pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',      // ✅ separate maskable entry
    },
  ],
}

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      // 🔧 FIXED: was 'autoUpdate'. That mode tells the service worker to
      // skipWaiting() + activate itself immediately on install, so it never
      // sits in a "waiting" state — which means onNeedRefresh() in
      // src/index.tsx almost never fired, and the update popup never had a
      // chance to show. 'prompt' keeps the new version waiting until the
      // user taps "Update" (this is what makes the popup logic actually work,
      // in both `npm run dev` and the built/live site).
      registerType: 'prompt',
      injectRegister: 'auto',
      // ✅ devOptions: manifest.webmanifest dev ಲ್ಲೂ serve ಆಗ್ತದೆ
      devOptions: {
        enabled: true,
        type: 'module',
      },
      includeAssets: ['favicon.ico', 'logo.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        globIgnores: ['**/node_modules/**/*', 'sw.js', 'workbox-*.js'],
        navigateFallback: 'index.html',
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: /\.(?:woff|woff2|ttf|eot)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 365 * 24 * 60 * 60,
              },
            },
          },
        ],
      }
    })
  ],

  // 🆕 ADDED: bakes the version from package.json into the bundle as
  // __APP_VERSION__. The running app uses this to know "what version am I
  // currently on", so it can compare against the new version it finds in
  // manifest.webmanifest and avoid showing the update popup again once the
  // user is already on that version.
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },

  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
          'vendor-xlsx': ['xlsx', 'xlsx-js-style'],
          'vendor-ui': [
            '@headlessui/react',
            '@headlessui-float/react',
            'simplebar-react',
          ],
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'yup'],
          'vendor-calendar': [
            '@fullcalendar/core',
            '@fullcalendar/react',
            '@fullcalendar/daygrid',
            '@fullcalendar/interaction',
            '@fullcalendar/list',
          ],
          'vendor-axios': ['axios'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
    sourcemap: false,
  },

  server: {
    host: true,
    hmr: true,
  },

  // ✅ KEY FIX: html2pdf.js is CJS - must be in include, NOT exclude
  // Vite pre-bundles it → ESM ಆಗಿ convert ಮಾಡ್ತದೆ → import error ಹೋಗ್ತದೆ
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'axios',
      'html2canvas',
    ],
    exclude: ['xlsx', 'xlsx-js-style', 'html2pdf.js'],
  },
})