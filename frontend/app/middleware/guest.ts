export default defineNuxtRouteMiddleware(() => {
  const accessToken = useCookie<string | null>("access_token");

  // Un utilisateur déjà connecté arrive directement sur ses tâches.
  if (accessToken.value) {
    return navigateTo("/tasks");
  }
});
