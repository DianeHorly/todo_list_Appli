// Test du composant TaskList
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import TaskList from "../../app/components/tasks/TaskList.vue";

const tasks = [
  {
    id: 1,
    title: "Préparer la présentation Libheros",
    completed: false,
    userId: 1,
    createdAt: "2026-07-20T10:00:00.000Z",
    updatedAt: "2026-07-20T10:00:00.000Z",
  },
];

function mountComponent(overrides: Record<string, unknown> = {}) {
  return mount(TaskList, {
    props: {
      tasks,
      isLoading: false,
      searchTerm: "",
      editingTaskId: null,
      editedTitle: "",
      isSavingTitle: false,
      updatingTaskId: null,
      deletingTaskId: null,
      ...overrides,
    },
  });
}

describe("TaskList", () => {
  it("affiche le message de chargement", () => {
    const wrapper = mountComponent({
      isLoading: true,
    });

    expect(wrapper.text()).toContain("Chargement des tâches...");
  });

  it("affiche un message lorsqu'aucune tâche n'est disponible", () => {
    const wrapper = mountComponent({
      tasks: [],
    });

    expect(wrapper.text()).toContain("Aucune tâche dans cette catégorie");
  });

  it("affiche les tâches reçues", () => {
    const wrapper = mountComponent();

    expect(wrapper.text()).toContain("Préparer la présentation Libheros");
    expect(wrapper.text()).toContain("À faire");
  });

  it("affiche un message spécifique lorsqu'une recherche ne donne aucun résultat", () => {
    const wrapper = mountComponent({
      tasks: [],
      searchTerm: "inexistante",
    });

    expect(wrapper.text()).toContain("Aucune tâche trouvée");
    expect(wrapper.text()).toContain("Essayez avec un autre mot.");
  });
});
