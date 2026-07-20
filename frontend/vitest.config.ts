import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    // Je lance les composants dans un environnement Nuxt
    // afin d'avoir accès aux fonctionnalités de l'application.
    environment: "nuxt",

    environmentOptions: {
      nuxt: {
        domEnvironment: "happy-dom",
      },
    },
  },
});
