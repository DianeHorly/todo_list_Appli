// Composant pour afficher l'en-tête de la page des tâches.

<script setup lang="ts">

const emit = defineEmits<{
  logout: [];
}>();
</script>

<template>
  <header
    class="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7"
  >
    <div>
      <p class="text-sm font-semibold text-blue-600">
        Ma Todo List
      </p>

      <h1 class="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
        Mes tâches
      </h1>

      <p class="mt-2 text-sm text-slate-600 sm:text-base">
        Gérez ici toutes vos tâches personnelles.
      </p>
    </div>

    <button
      type="button"
      class="w-full rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
      @click="emit('logout')"
    >
      Se déconnecter
    </button>
  </header>
</template>