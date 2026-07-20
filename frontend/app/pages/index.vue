<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  middleware: "guest",
});

// Définition des types pour l'authentification.
type AuthMode = "login" | "register";

// Définition des interfaces pour les réponses de l'API et les erreurs.
interface AuthResponse {
  accessToken: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface ApiError {
  data?: {
    message?: string | string[];
  };
}

const config = useRuntimeConfig();

const accessToken = useCookie<string | null>("access_token", {
  sameSite: "strict",
});

// Je conserve le prénom afin de personnaliser la page des tâches.
const userFirstName = useCookie<string | null>("user_first_name", {
  sameSite: "strict",
});

const authMode = ref<AuthMode>("login");
const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const loginForm = ref({
  email: "",
  password: "",
});

const registerForm = ref({
  firstName: "",
  lastName: "",
  email: "",
  emailConfirmation: "",
  password: "",
  passwordConfirmation: "",
});

// Je redirige l'utilisateur vers la page des tâches s'il est déjà connecté.
if (accessToken.value) {
  navigateTo("/tasks");
}
function changeAuthMode(mode: AuthMode) {
  authMode.value = mode;
  errorMessage.value = "";
  successMessage.value = "";
}

function getApiErrorMessage(error: unknown, defaultMessage: string): string {
  const apiError = error as ApiError;
  const message = apiError.data?.message;

  if (Array.isArray(message)) {
    return message.join(" ");
  }

  return message || defaultMessage;
}

// Gestion de la connexion et de l'inscription
async function handleLogin() {
  errorMessage.value = "";
  successMessage.value = "";
  isLoading.value = true;

  try {
    const response = await $fetch<AuthResponse>(
      `${config.public.apiBaseUrl}/auth/login`,
      {
        method: "POST",
        body: {
          email: loginForm.value.email,
          password: loginForm.value.password,
        },
      },
    );

    // Je conserve le token afin d'accéder aux routes protégées.
    accessToken.value = response.accessToken;

    userFirstName.value = response.user.firstName;
    // Je redirige l'utilisateur vers la page des tâches après une connexion réussie.
    await navigateTo("/tasks");

    successMessage.value = `Bienvenue ${response.user.firstName}, vous êtes connecté(e).`;
  } catch (error) {
    errorMessage.value = getApiErrorMessage(
      error,
      "Adresse e-mail ou mot de passe incorrect.",
    );
  } finally {
    isLoading.value = false;
  }
}

// Gestion de l'inscription
async function handleRegister() {
  errorMessage.value = "";
  successMessage.value = "";

  const email = registerForm.value.email.trim().toLowerCase();
  const emailConfirmation = registerForm.value.emailConfirmation
    .trim()
    .toLowerCase();

  if (email !== emailConfirmation) {
    errorMessage.value = "Les adresses e-mail ne correspondent pas.";
    return;
  }

  if (registerForm.value.password !== registerForm.value.passwordConfirmation) {
    errorMessage.value = "Les mots de passe ne correspondent pas.";
    return;
  }

  isLoading.value = true;

  try {
    const response = await $fetch<AuthResponse>(
      `${config.public.apiBaseUrl}/auth/register`,
      {
        method: "POST",
        body: {
          ...registerForm.value,
          email,
          emailConfirmation,
        },
      },
    );

    // Je conserve le token afin que le nouveau compte soit connecté.
    accessToken.value = response.accessToken;
    userFirstName.value = response.user.firstName;
    // Je redirige l'utilisateur vers la page des tâches après une inscription réussie.
    await navigateTo("/tasks");

    successMessage.value = `Bienvenue ${response.user.firstName}, votre compte a été créé avec succès.`;
  } catch (error) {
    errorMessage.value = getApiErrorMessage(
      error,
      "La création du compte a échoué.",
    );
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <main
    class="min-h-dvh bg-slate-100 px-3 py-4 sm:px-6 sm:py-8 lg:flex lg:items-center lg:justify-center"
  >
    <section
      class="mx-auto grid w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-xl lg:grid-cols-2 lg:rounded-3xl"
    >
      <!-- Présentation -->
      <aside
        class="hidden bg-blue-600 p-10 text-white lg:flex lg:min-h-[680px] lg:flex-col lg:justify-between xl:p-14"
      >
        <div>
          <p
            class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100"
          >
            Test technique Libheros
          </p>

          <h1 class="mt-7 text-4xl font-bold leading-tight xl:text-5xl">
            Organisez vos tâches simplement.
          </h1>

          <p class="mt-6 max-w-lg text-lg leading-8 text-blue-100">
            Créez, modifiez, filtrez et suivez vos tâches personnelles depuis
            une interface claire et sécurisée.
          </p>
        </div>

        <p class="text-sm text-blue-100">
          Application développée avec Nuxt, NestJS, MySQL, Docker et JWT.
        </p>
      </aside>

      <!-- Zone des formulaires -->
      <div class="flex items-center p-5 sm:p-8 lg:p-10 xl:p-12">
        <div class="mx-auto w-full max-w-lg">
          <header class="mb-6">
            <p class="text-sm font-semibold text-blue-600">Ma Todo List</p>

            <h2 class="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              {{ authMode === "login" ? "Connexion" : "Créer un compte" }}
            </h2>

            <p class="mt-2 text-sm text-slate-600 sm:text-base">
              {{
                authMode === "login"
                  ? "Connectez-vous pour retrouver vos tâches."
                  : "Renseignez vos informations pour commencer."
              }}
            </p>
          </header>

          <!-- Onglets -->
          <div class="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              class="rounded-lg px-2 py-3 text-sm font-semibold transition sm:px-4"
              :class="
                authMode === 'login'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              "
              @click="changeAuthMode('login')"
            >
              Connexion
            </button>

            <button
              type="button"
              class="rounded-lg px-2 py-3 text-sm font-semibold transition sm:px-4"
              :class="
                authMode === 'register'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              "
              @click="changeAuthMode('register')"
            >
              Créer un compte
            </button>
          </div>

          <!-- Messages communs -->
          <div
            v-if="errorMessage"
            class="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {{ errorMessage }}
          </div>

          <div
            v-if="successMessage"
            class="mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {{ successMessage }}
          </div>

          <!-- Page de connexion -->
          <form
            v-if="authMode === 'login'"
            class="space-y-5"
            @submit.prevent="handleLogin"
          >
            <div>
              <label
                for="login-email"
                class="mb-2 block text-sm font-medium text-slate-700"
              >
                Adresse e-mail
              </label>

              <input
                id="login-email"
                v-model="loginForm.email"
                type="email"
                autocomplete="email"
                placeholder="exemple@email.com"
                required
                class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                for="login-password"
                class="mb-2 block text-sm font-medium text-slate-700"
              >
                Mot de passe
              </label>

              <input
                id="login-password"
                v-model="loginForm.password"
                type="password"
                autocomplete="current-password"
                placeholder="Votre mot de passe"
                required
                class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ isLoading ? "Connexion en cours..." : "Se connecter" }}
            </button>
          </form>

          <!-- Page d'inscription -->
          <form v-else class="space-y-4" @submit.prevent="handleRegister">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  for="first-name"
                  class="mb-2 block text-sm font-medium text-slate-700"
                >
                  Prénom
                </label>

                <input
                  id="first-name"
                  v-model="registerForm.firstName"
                  type="text"
                  autocomplete="given-name"
                  required
                  class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  for="last-name"
                  class="mb-2 block text-sm font-medium text-slate-700"
                >
                  Nom
                </label>

                <input
                  id="last-name"
                  v-model="registerForm.lastName"
                  type="text"
                  autocomplete="family-name"
                  required
                  class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  for="register-email"
                  class="mb-2 block text-sm font-medium text-slate-700"
                >
                  Adresse e-mail
                </label>

                <input
                  id="register-email"
                  v-model="registerForm.email"
                  type="email"
                  autocomplete="email"
                  required
                  class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  for="email-confirmation"
                  class="mb-2 block text-sm font-medium text-slate-700"
                >
                  Confirmer l'adresse e-mail
                </label>

                <input
                  id="email-confirmation"
                  v-model="registerForm.emailConfirmation"
                  type="email"
                  autocomplete="email"
                  required
                  class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  for="register-password"
                  class="mb-2 block text-sm font-medium text-slate-700"
                >
                  Mot de passe
                </label>

                <input
                  id="register-password"
                  v-model="registerForm.password"
                  type="password"
                  autocomplete="new-password"
                  minlength="8"
                  required
                  class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  for="password-confirmation"
                  class="mb-2 block text-sm font-medium text-slate-700"
                >
                  Confirmer le mot de passe
                </label>

                <input
                  id="password-confirmation"
                  v-model="registerForm.passwordConfirmation"
                  type="password"
                  autocomplete="new-password"
                  minlength="8"
                  required
                  class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ isLoading ? "Création en cours..." : "Créer mon compte" }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>
