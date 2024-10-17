// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss','@formkit/auto-animate/nuxt'],
  css: [
    '@/assets/styles/tailwind.css', 
  ],
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8000',
    },
  },
  plugins: ['~/plugins/fontawesome.js'],
})
