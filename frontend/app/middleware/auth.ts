// Ce middleware vérifie si l'utilisateur est authentifié.

export default defineNuxtRouteMiddleware(() => {
  const accessToken = useCookie<string | null>("access_token");

  // Je redirige vers la connexion lorsque le token est absent.
  if (!accessToken.value) {
    return navigateTo("/");
  }
});
