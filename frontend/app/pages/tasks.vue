<script setup lang="ts">
// Importation des fonctions et composants nécessaires depuis Vue et d'autres fichiers.
import { computed, onMounted, ref } from "vue";

import TaskCreateForm from "~/components/tasks/TaskCreateForm.vue";
import TaskFilters from "~/components/tasks/TaskFilters.vue";
import TaskHeader from "~/components/tasks/TaskHeader.vue";
import TaskList from "~/components/tasks/TaskList.vue";

// Définition des métadonnées de la page, incluant le middleware d'authentification.
definePageMeta({
  middleware: "auth",
});

// Definition de l'interface Task pour typer les tâches.
interface Task {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// Definition du type TaskFilter pour les filtres de tâches.
type TaskFilter = "all" | "todo" | "completed";
type TaskSort = "newest" | "oldest";

// Definition de l'interface ApiError pour gérer les erreurs d'API.
interface ApiError {
  status?: number;
  statusCode?: number;
  data?: {
    statusCode?: number;
    message?: string | string[];
  };
}

// Je récupère la configuration de l'application et le cookie d'authentification.
const config = useRuntimeConfig();
const accessToken = useCookie<string | null>("access_token");
const userFirstName = useCookie<string | null>("user_first_name");

// Définition des variables pour gérer l'état de l'application.
const tasks = ref<Task[]>([]);
const newTaskTitle = ref("");
const searchTerm = ref("");
const selectedFilter = ref<TaskFilter>("all");
const selectedSort = ref<TaskSort>("newest");

const isLoading = ref(true);
const isCreating = ref(false);
const isSavingTitle = ref(false);

// Definition des variables pour suivre l'état des tâches en cours de modification, de suppression ou de mise à jour.
const updatingTaskId = ref<number | null>(null);
const deletingTaskId = ref<number | null>(null);
const editingTaskId = ref<number | null>(null);
const editedTaskTitle = ref("");

const errorMessage = ref("");
const successMessage = ref("");

// Je filtre et trie les tâches affichées.
const displayedTasks = computed(() => {
  const search = searchTerm.value.trim().toLowerCase();

  const filteredTasks = search
    ? tasks.value.filter((task) => task.title.toLowerCase().includes(search))
    : [...tasks.value];

  return filteredTasks.sort((firstTask, secondTask) => {
    const firstDate = new Date(firstTask.createdAt).getTime();
    const secondDate = new Date(secondTask.createdAt).getTime();

    return selectedSort.value === "newest"
      ? secondDate - firstDate
      : firstDate - secondDate;
  });
});

// Je définis une fonction pour extraire un message d'erreur depuis la réponse de l'API.
function getApiErrorMessage(error: unknown, defaultMessage: string): string {
  const apiError = error as ApiError;
  const message = apiError.data?.message;

  if (Array.isArray(message)) {
    return message.join(" ");
  }

  return message || defaultMessage;
}

// determine si une tâche correspond au filtre sélectionné.
function taskMatchesSelectedFilter(task: Task): boolean {
  if (selectedFilter.value === "todo") {
    return !task.completed;
  }

  if (selectedFilter.value === "completed") {
    return task.completed;
  }

  return true;
}

// Gestion de l'erreur (non autorisé) en redirigeant l'utilisateur vers la page de connexion.
async function handleUnauthorized(error: unknown): Promise<boolean> {
  const apiError = error as ApiError;

  const statusCode =
    apiError.statusCode || apiError.status || apiError.data?.statusCode;

  if (statusCode === 401) {
    accessToken.value = null;
    await navigateTo("/");
    return true;
  }

  return false;
}

// Je récupère les tâches correspondant au filtre sélectionné.
async function fetchTasks() {
  errorMessage.value = "";
  isLoading.value = true;

  try {
    tasks.value = await $fetch<Task[]>(
      `${config.public.apiBaseUrl}/tasks?status=${selectedFilter.value}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      },
    );
  } catch (error) {
    if (await handleUnauthorized(error)) {
      return;
    }

    errorMessage.value = getApiErrorMessage(
      error,
      "Impossible de récupérer les tâches.",
    );
  } finally {
    isLoading.value = false;
  }
}

// Je crée une nouvelle tâche et l’ajoute à la liste si elle correspond
// au filtre actuellement sélectionné.
async function handleCreateTask() {
  errorMessage.value = "";
  successMessage.value = "";

  const title = newTaskTitle.value.trim();

  if (!title) {
    errorMessage.value = "Veuillez saisir le titre de la tâche.";
    return;
  }

  isCreating.value = true;

  try {
    const createdTask = await $fetch<Task>(
      `${config.public.apiBaseUrl}/tasks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
        body: {
          title,
        },
      },
    );

    if (taskMatchesSelectedFilter(createdTask)) {
      tasks.value.unshift(createdTask);
    }

    newTaskTitle.value = "";
    successMessage.value = "La tâche a été créée avec succès.";
  } catch (error) {
    if (await handleUnauthorized(error)) {
      return;
    }

    errorMessage.value = getApiErrorMessage(
      error,
      "Impossible de créer la tâche.",
    );
  } finally {
    isCreating.value = false;
  }
}

// Je change le statut puis je conserve la tâche seulement si elle
// correspond encore au filtre sélectionné.
async function handleToggleTask(task: Task) {
  errorMessage.value = "";
  successMessage.value = "";
  updatingTaskId.value = task.id;

  try {
    const updatedTask = await $fetch<Task>(
      `${config.public.apiBaseUrl}/tasks/${task.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
        body: {
          completed: !task.completed,
        },
      },
    );

    if (!taskMatchesSelectedFilter(updatedTask)) {
      tasks.value = tasks.value.filter(
        (currentTask) => currentTask.id !== task.id,
      );
      return;
    }

    const taskIndex = tasks.value.findIndex(
      (currentTask) => currentTask.id === task.id,
    );

    if (taskIndex !== -1) {
      tasks.value[taskIndex] = updatedTask;
    }
  } catch (error) {
    if (await handleUnauthorized(error)) {
      return;
    }

    errorMessage.value = getApiErrorMessage(
      error,
      "Impossible de modifier le statut de la tâche.",
    );
  } finally {
    updatingTaskId.value = null;
  }
}

function startEditingTask(task: Task) {
  errorMessage.value = "";
  successMessage.value = "";

  editingTaskId.value = task.id;
  editedTaskTitle.value = task.title;
}

function cancelEditingTask() {
  editingTaskId.value = null;
  editedTaskTitle.value = "";
}

// Je sauvegarde le nouveau titre puis je mets à jour la tâche affichée.
async function handleSaveTaskTitle(task: Task) {
  errorMessage.value = "";
  successMessage.value = "";

  const title = editedTaskTitle.value.trim();

  if (!title) {
    errorMessage.value = "Le titre de la tâche ne peut pas être vide.";
    return;
  }

  if (title === task.title) {
    cancelEditingTask();
    return;
  }

  isSavingTitle.value = true;

  try {
    const updatedTask = await $fetch<Task>(
      `${config.public.apiBaseUrl}/tasks/${task.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
        body: {
          title,
        },
      },
    );

    const taskIndex = tasks.value.findIndex(
      (currentTask) => currentTask.id === task.id,
    );

    if (taskIndex !== -1) {
      tasks.value[taskIndex] = updatedTask;
    }

    successMessage.value = "Le titre de la tâche a été modifié.";
    cancelEditingTask();
  } catch (error) {
    if (await handleUnauthorized(error)) {
      return;
    }

    errorMessage.value = getApiErrorMessage(
      error,
      "Impossible de modifier le titre de la tâche.",
    );
  } finally {
    isSavingTitle.value = false;
  }
}

async function handleDeleteTask(task: Task) {
  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer la tâche « ${task.title} » ?`,
  );

  if (!confirmed) {
    return;
  }

  errorMessage.value = "";
  successMessage.value = "";
  deletingTaskId.value = task.id;

  try {
    await $fetch(`${config.public.apiBaseUrl}/tasks/${task.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    });

    tasks.value = tasks.value.filter(
      (currentTask) => currentTask.id !== task.id,
    );

    successMessage.value = "La tâche a été supprimée avec succès.";
  } catch (error) {
    if (await handleUnauthorized(error)) {
      return;
    }

    errorMessage.value = getApiErrorMessage(
      error,
      "Impossible de supprimer la tâche.",
    );
  } finally {
    deletingTaskId.value = null;
  }
}

async function handleFilterChange(filter: TaskFilter) {
  selectedFilter.value = filter;
  searchTerm.value = "";
  await fetchTasks();
}

async function handleLogout() {
  accessToken.value = null;
  userFirstName.value = null;
  await navigateTo("/");
}

onMounted(fetchTasks);
</script>

<template>
  <main class="min-h-dvh bg-slate-100 px-3 py-4 sm:px-6 sm:py-8">
    <section class="mx-auto w-full max-w-6xl space-y-6">
      <TaskHeader
        :first-name="userFirstName || 'Utilisateur'"
        @logout="handleLogout"
      />

      <div
        v-if="errorMessage"
        class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ errorMessage }}
      </div>

      <div
        v-if="successMessage"
        class="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700"
      >
        {{ successMessage }}
      </div>

      <TaskCreateForm
        v-model="newTaskTitle"
        :is-creating="isCreating"
        @submit="handleCreateTask"
      />

      <section class="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
        <TaskFilters
          v-model:search-term="searchTerm"
          v-model:selected-sort="selectedSort"
          :selected-filter="selectedFilter"
          @change-filter="handleFilterChange"
        />

        <TaskList
          v-model:edited-title="editedTaskTitle"
          :tasks="displayedTasks"
          :is-loading="isLoading"
          :search-term="searchTerm"
          :editing-task-id="editingTaskId"
          :is-saving-title="isSavingTitle"
          :updating-task-id="updatingTaskId"
          :deleting-task-id="deletingTaskId"
          @start-edit="startEditingTask"
          @cancel-edit="cancelEditingTask"
          @save-title="handleSaveTaskTitle"
          @toggle="handleToggleTask"
          @delete="handleDeleteTask"
        />
      </section>
    </section>
  </main>
</template>
