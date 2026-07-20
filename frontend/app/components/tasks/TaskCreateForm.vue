// Composant pour créer une nouvelle tâche.
<script setup lang="ts">
import { computed } from "vue";

// définition de l'interface Task pour typer les tâches.
const props = defineProps<{
  modelValue: string;
  isCreating: boolean;
}>();

// definition des événements que le composant peut émettre vers son parent.
const emit = defineEmits<{
  "update:modelValue": [value: string];
  submit: [];
}>();

// Je relie le champ du composant à la variable newTaskTitle
// qui reste gérée par la page tasks.vue.
const taskTitle = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});
</script>

<template>
  <section class="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
    <div>
      <h2 class="text-lg font-bold text-slate-900">Ajouter une tâche</h2>

      <p class="mt-1 text-sm text-slate-500">
        Saisissez le titre de la tâche que vous souhaitez réaliser.
      </p>
    </div>

    <form
      class="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
      @submit.prevent="emit('submit')"
    >
      <label for="new-task" class="sr-only"> Titre de la nouvelle tâche </label>

      <input
        id="new-task"
        v-model="taskTitle"
        type="text"
        maxlength="255"
        placeholder="Exemple : terminer le rapport"
        required
        class="min-w-0 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />

      <button
        type="submit"
        :disabled="isCreating"
        class="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {{ isCreating ? "Ajout en cours..." : "Ajouter" }}
      </button>
    </form>
  </section>
</template>
