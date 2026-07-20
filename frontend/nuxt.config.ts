import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: {
    enabled: true,
  },

  // Je fixe définitivement le frontend sur le port 3001.
  devServer: {
    port: 3001,
  },

  // Je charge le fichier CSS principal dans toute l'application.
  css: ['./app/assets/css/main.css'],

  // J'ajoute Tailwind au processus de compilation de Vite.
  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    public: {
      // Je centralise ici l'adresse du backend afin de ne pas
      // répéter http://localhost:3000 dans toutes les pages.
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
    },
  },
});