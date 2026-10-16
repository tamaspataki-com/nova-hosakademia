import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  // Keep bundled JS/CSS out of public/assets, which holds the artwork.
  build: { assetsDir: 'static' },
  plugins: [
    react(),
    VitePWA({
      // The new version waits until the child (or parent) taps "Frissítés"; see src/app/update.js.
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['icons/apple-touch-icon.png', 'icons/favicon.png'],
      manifest: {
        name: 'NOVA Hősakadémia',
        short_name: 'NOVA',
        description: 'Szövegértés- és hallásértés-gyakorló kaland.',
        lang: 'hu',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'any',
        background_color: '#102D35',
        theme_color: '#102D35',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        clientsClaim: true, // a worker that takes over controls open pages at once, so the reload after "Frissítés" always follows
        // App shell, icons and all artwork (public/assets/*.webp, ~2.2 MB) are precached for offline use.
        globPatterns: ['**/*.{js,css,html,svg,ico,woff2}', 'icons/*.png', 'assets/*.webp'],
        // Largest image is ~0.5 MB; leave headroom so a re-export doesn't silently drop out of the precache.
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts', expiration: { maxEntries: 30 } }
          }
        ]
      }
    })
  ]
});
