// création d'un composant pour gérer les filtres de tâches.

<script setup lang="ts">
import { computed } from "vue";

// Définition des types pour les filtres et le tri des tâches.
type TaskFilter = "all" | "todo" | "completed";
type TaskSort = "newest" | "oldest";

// Définition des props et des événements émis par le composant.
const props = defineProps<{
  selectedFilter: TaskFilter;
  searchTerm: string;
  selectedSort: TaskSort;
}>();

// Définition des événements émis par le composant.
const emit = defineEmits<{
  "update:searchTerm": [value: string];
  "update:selectedSort": [value: TaskSort];
  "change-filter": [filter: TaskFilter];
}>();

// Définition des filtres disponibles pour les tâches.
const taskFilters: Array<{
  label: string;
  value: TaskFilter;
}> = [
  { label: "Toutes", value: "all" },
  { label: "À faire", value: "todo" },
  { label: "Terminées", value: "completed" },
];

// Création de propriétés calculées pour gérer la recherche et le tri des tâches.
const search = computed({
  get: () => props.searchTerm,
  set: (value: string) => emit("update:searchTerm", value),
});

const sort = computed({
  get: () => props.selectedSort,
  set: (value: TaskSort) => emit("update:selectedSort", value),
});
</script>

<template>
  <div>
    <div
      class="flex flex-col gap-5 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <h2 class="text-lg font-bold text-slate-900">Liste des tâches</h2>

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

    <!-- Filtres de recherche et de tri -->
    <div class="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
      <div>
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
        />
      </div>

      <!-- Filtre de tri -->
      <div>
        <label
          for="task-sort"
          class="mb-2 block text-sm font-medium text-slate-700"
        >
          Trier par date
        </label>

        <select
          id="task-sort"
          v-model="sort"
          class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        >
          <option value="newest">Plus récentes</option>

          <option value="oldest">Plus anciennes</option>
        </select>
      </div>
    </div>
  </div>
</template>
