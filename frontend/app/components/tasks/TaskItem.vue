// Composant pour afficher une tâche individuelle.
<script setup lang="ts">
import { computed } from "vue";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

const props = defineProps<{
  task: Task;
  isEditing: boolean;
  editedTitle: string;
  isSavingTitle: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}>();

const emit = defineEmits<{
  "update:editedTitle": [value: string];
  "start-edit": [task: Task];
  "cancel-edit": [];
  "save-title": [task: Task];
  toggle: [task: Task];
  delete: [task: Task];
}>();

// Je relie le champ de modification à editedTaskTitle
// qui reste géré par la page tasks.vue.
const title = computed({
  get: () => props.editedTitle,
  set: (value: string) => emit("update:editedTitle", value),
});

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}
</script>

<template>
  <article
    class="grid gap-4 rounded-xl border border-slate-200 p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
  >
    <div class="min-w-0">
      <!-- Modification du titre -->
      <form
        v-if="isEditing"
        class="space-y-3"
        @submit.prevent="emit('save-title', task)"
      >
        <label
          :for="`edit-task-${task.id}`"
          class="block text-sm font-medium text-slate-700"
        >
          Modifier le titre
        </label>

        <input
          :id="`edit-task-${task.id}`"
          v-model="title"
          type="text"
          maxlength="255"
          required
          class="w-full rounded-xl border border-blue-400 px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100"
        />

        <div class="flex flex-wrap gap-2">
          <button
            type="submit"
            :disabled="isSavingTitle"
            class="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {{ isSavingTitle ? "Enregistrement..." : "Enregistrer" }}
          </button>

          <button
            type="button"
            :disabled="isSavingTitle"
            class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            @click="emit('cancel-edit')"
          >
            Annuler
          </button>
        </div>
      </form>

      <!-- Affichage normal -->
      <template v-else>
        <h2
          class="break-words font-semibold"
          :class="
            task.completed ? 'text-slate-400 line-through' : 'text-slate-900'
          "
        >
          {{ task.title }}
        </h2>

        <p class="mt-1 text-sm text-slate-500">
          Créée le {{ formatDate(task.createdAt) }}
        </p>
      </template>
    </div>

    <!-- Actions -->
    <div class="flex flex-wrap items-center gap-2 lg:justify-end">
      <span
        class="w-fit rounded-full px-3 py-2 text-sm font-semibold"
        :class="
          task.completed
            ? 'bg-green-100 text-green-700'
            : 'bg-amber-100 text-amber-700'
        "
      >
        {{ task.completed ? "Terminée" : "À faire" }}
      </span>

      <button
        type="button"
        :disabled="isUpdating"
        class="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
        @click="emit('toggle', task)"
      >
        {{
          isUpdating
            ? "Mise à jour..."
            : task.completed
              ? "Remettre à faire"
              : "Marquer comme terminée"
        }}
      </button>

      <button
        v-if="!isEditing"
        type="button"
        class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        @click="emit('start-edit', task)"
      >
        Modifier
      </button>

      <button
        type="button"
        :disabled="isDeleting"
        class="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        @click="emit('delete', task)"
      >
        {{ isDeleting ? "Suppression..." : "Supprimer" }}
      </button>
    </div>
  </article>
</template>
