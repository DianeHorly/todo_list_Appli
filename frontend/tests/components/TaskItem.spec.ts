// Test du composant TaskItem

import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import TaskItem from "../../app/components/tasks/TaskItem.vue";

const task = {
  id: 1,
  title: "Préparer la présentation Libheros",
  completed: false,
  userId: 1,
  createdAt: "2026-07-20T10:00:00.000Z",
  updatedAt: "2026-07-20T10:00:00.000Z",
};

function mountComponent(overrides = {}) {
  return mount(TaskItem, {
    props: {
      task,
      isEditing: false,
      editedTitle: "",
      isSavingTitle: false,
      isUpdating: false,
      isDeleting: false,
      ...overrides,
    },
  });
}

describe("TaskItem", () => {
  it("affiche le titre et le statut de la tâche", () => {
    const wrapper = mountComponent();

    expect(wrapper.text()).toContain("Préparer la présentation Libheros");
    expect(wrapper.text()).toContain("À faire");
  });

  it("émet un événement toggle lorsque le statut est modifié", async () => {
    const wrapper = mountComponent();

    const toggleButton = wrapper
      .findAll("button")
      .find((button) => button.text().includes("Marquer comme terminée"));

    expect(toggleButton).toBeDefined();

    await toggleButton?.trigger("click");

    expect(wrapper.emitted("toggle")).toBeTruthy();
    expect(wrapper.emitted("toggle")?.[0]).toEqual([task]);
  });

  it("émet un événement start-edit lorsque Modifier est sélectionné", async () => {
    const wrapper = mountComponent();

    const editButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "Modifier");

    expect(editButton).toBeDefined();

    await editButton?.trigger("click");

    expect(wrapper.emitted("start-edit")).toBeTruthy();
    expect(wrapper.emitted("start-edit")?.[0]).toEqual([task]);
  });

  it("émet un événement delete lorsque Supprimer est sélectionné", async () => {
    const wrapper = mountComponent();

    const deleteButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "Supprimer");

    expect(deleteButton).toBeDefined();

    await deleteButton?.trigger("click");

    expect(wrapper.emitted("delete")).toBeTruthy();
    expect(wrapper.emitted("delete")?.[0]).toEqual([task]);
  });
});
