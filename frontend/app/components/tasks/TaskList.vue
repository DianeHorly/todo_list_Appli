// Composant permettant de lister les tâches et de gérer les filtres

<script setup lang="ts">
import { computed } from "vue";

import TaskItem from "./TaskItem.vue";

// Je définis l'interface Task pour typer les tâches.
interface Task {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// Je définis les props que le composant attend de son parent.
const props = defineProps<{
  tasks: Task[];
  isLoading: boolean;
  searchTerm: string;
  editingTaskId: number | null;
  editedTitle: string;
  isSavingTitle: boolean;
  updatingTaskId: number | null;
  deletingTaskId: number | null;
}>();

// Je définis les événements que le composant peut émettre vers son parent.
const emit = defineEmits<{
  "update:editedTitle": [value: string];
  "start-edit": [task: Task];
  "cancel-edit": [];
  "save-title": [task: Task];
  toggle: [task: Task];
  delete: [task: Task];
}>();

// Je relie le titre modifié à la variable editedTaskTitle
// qui reste gérée par la page principale.
const editedTitleModel = computed({
  get: () => props.editedTitle,
  set: (value: string) => emit("update:editedTitle", value),
});
</script>

<template>
  <!-- Chargement -->
  <div v-if="isLoading" class="py-12 text-center text-slate-500">
    Chargement des tâches...
  </div>

  <!-- Aucune tâche -->
  <div v-else-if="tasks.length === 0" class="py-12 text-center">
    <h2 class="text-lg font-semibold text-slate-800">
      {{
        searchTerm
          ? "Aucune tâche trouvée"
          : "Aucune tâche dans cette catégorie"
      }}
    </h2>

    <p class="mt-2 text-slate-500">
      {{
        searchTerm
          ? "Essayez avec un autre mot."
          : "Ajoutez une tâche ou choisissez un autre filtre."
      }}
    </p>
  </div>

  <!-- Liste des tâches -->
  <div v-else class="mt-6 space-y-4">
    <TaskItem
      v-for="task in tasks"
      :key="task.id"
      v-model:edited-title="editedTitleModel"
      :task="task"
      :is-editing="editingTaskId === task.id"
      :is-saving-title="isSavingTitle"
      :is-updating="updatingTaskId === task.id"
      :is-deleting="deletingTaskId === task.id"
      @start-edit="emit('start-edit', $event)"
      @cancel-edit="emit('cancel-edit')"
      @save-title="emit('save-title', $event)"
      @toggle="emit('toggle', $event)"
      @delete="emit('delete', $event)"
    />
  </div>
</template>
