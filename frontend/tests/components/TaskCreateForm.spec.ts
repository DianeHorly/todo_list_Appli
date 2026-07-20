import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import TaskCreateForm from "../../app/components/tasks/TaskCreateForm.vue";

// Test du composant TaskCreateForm
// pour vérifier qu'il transmet correctement le titre saisi à la page principale
describe("TaskCreateForm", () => {
  it("transmet le titre saisi à la page principale", async () => {
    const wrapper = mount(TaskCreateForm, {
      props: {
        modelValue: "",
        isCreating: false,
      },
    });

    const input = wrapper.get("input");

    await input.setValue("Préparer la présentation Libheros");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([
      "Préparer la présentation Libheros",
    ]);
  });

  it("émet un événement submit lorsque le formulaire est envoyé", async () => {
    const wrapper = mount(TaskCreateForm, {
      props: {
        modelValue: "Créer une tâche",
        isCreating: false,
      },
    });

    await wrapper.get("form").trigger("submit");

    expect(wrapper.emitted("submit")).toHaveLength(1);
  });

  it("désactive le bouton pendant la création", () => {
    const wrapper = mount(TaskCreateForm, {
      props: {
        modelValue: "Créer une tâche",
        isCreating: true,
      },
    });

    const button = wrapper.get("button");

    expect(button.attributes("disabled")).toBeDefined();
    expect(button.text()).toContain("Ajout en cours...");
  });
});
