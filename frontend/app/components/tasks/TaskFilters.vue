// création d'un composant pour gérer les filtres de tâches.

<script setup lang="ts">
import { computed } from 'vue';

// définition du type TaskFilter pour les filtres de tâches.
type TaskFilter = 'all' | 'todo' | 'completed';

// definition des props que le composant attend de son parent.
const props = defineProps<{
  selectedFilter: TaskFilter;
  searchTerm: string;
}>();

// definition des événements que le composant peut émettre vers son parent.
const emit = defineEmits<{
  'update:searchTerm': [value: string];
  'change-filter': [filter: TaskFilter];
}>();

// définition des filtres disponibles pour les tâches.
const taskFilters: Array<{
  label: string;
  value: TaskFilter;
}> = [
  { label: 'Toutes', value: 'all' },
  { label: 'À faire', value: 'todo' },
  { label: 'Terminées', value: 'completed' },
];

// Je relie le champ de recherche à la variable searchTerm
// qui reste gérée dans la page tasks.vue.
const search = computed({
  get: () => props.searchTerm,
  set: (value: string) => emit('update:searchTerm', value),
});
</script>

<template>
  <div>
    <div
      class="flex flex-col gap-5 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between"
    >
      <!-- Filtres -->
      <div>
        <h2 class="text-lg font-bold text-slate-900">
          Liste des tâches
        </h2>

        <p class="mt-1 text-sm text-slate-500">
          Filtrez les tâches selon leur état d'avancement.
        </p>
      </div>

      <div
        class="grid w-full grid-cols-3 rounded-xl bg-slate-100 p-1 sm:w-auto"
      >
        <button
          v-for="filter in taskFilters"
          :key="filter.value"
          type="button"
          class="rounded-lg px-2 py-2 text-sm font-semibold transition sm:px-4"
          :class="
            selectedFilter === filter.value
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          "
          @click="emit('change-filter', filter.value)"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Champ de recherche -->
    <div class="mt-5">
      <label
        for="task-search"
        class="mb-2 block text-sm font-medium text-slate-700"
      >
        Rechercher une tâche
      </label>

      <input
        id="task-search"
        v-model="search"
        type="search"
        placeholder="Rechercher par titre..."
        class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      >
    </div>
  </div>
</template>