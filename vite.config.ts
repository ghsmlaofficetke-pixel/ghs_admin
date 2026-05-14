import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      // ✅ devOptions: manifest.webmanifest dev ಲ್ಲೂ serve ಆಗ್ತದೆ
      devOptions: {
        enabled: true,
        type: 'module',
      },
      includeAssets: ['favicon.ico', 'logo.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'GHS MLA Office',
        short_name: 'GHS MLA Office',
        description: '126 ತರೀಕೆರೆ ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        lang: 'kn',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
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

  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
          // ✅ html2pdf - CJS library, vite ಇದನ್ನು pre-bundle ಮಾಡ್ತದೆ (ESM fix)
          'vendor-pdf': ['html2pdf.js'],
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
      'html2pdf.js',   // ✅ CJS → ESM conversion here
      'html2canvas',
    ],
    exclude: ['xlsx', 'xlsx-js-style'],
  },
})