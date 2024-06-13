// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@element-plus/nuxt', 'nuxt3-leaflet', '@pinia/nuxt', '@vite-pwa/nuxt'],
  pwa: {
    manifest: {
      name: "BetterRestaurant",
      short_name: "BR",
      description: "Plateforme de reservation",
      theme_color: "#ffffff",
      icons: [
        {
          src: 'pictures/pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png'
        },
        {
          src: 'pictures/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pictures/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: 'pictures/maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
    },
    devOptions: {
      enabled: true,
      type: 'module',
    }
  },
  ssr: false,
});
