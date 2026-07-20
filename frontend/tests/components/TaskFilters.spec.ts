// Test du composant TaskFilters
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import TaskFilters from "../../app/components/tasks/TaskFilters.vue";

describe("TaskFilters", () => {
  function mountComponent() {
    return mount(TaskFilters, {
      props: {
        selectedFilter: "all",
        searchTerm: "",
        selectedSort: "newest",
      },
    });
  }

  it("émet le filtre sélectionné lorsque l'utilisateur clique sur À faire", async () => {
    const wrapper = mountComponent();

    const todoButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "À faire");

    expect(todoButton).toBeDefined();

    await todoButton?.trigger("click");

    expect(wrapper.emitted("change-filter")).toBeTruthy();
    expect(wrapper.emitted("change-filter")?.[0]).toEqual(["todo"]);
  });

  it("transmet le texte saisi dans le champ de recherche", async () => {
    const wrapper = mountComponent();

    await wrapper.get("#task-search").setValue("présentation");

    expect(wrapper.emitted("update:searchTerm")).toBeTruthy();
    expect(wrapper.emitted("update:searchTerm")?.[0]).toEqual(["présentation"]);
  });

  it("transmet le nouveau choix de tri", async () => {
    const wrapper = mountComponent();

    await wrapper.get("#task-sort").setValue("oldest");

    expect(wrapper.emitted("update:selectedSort")).toBeTruthy();
    expect(wrapper.emitted("update:selectedSort")?.[0]).toEqual(["oldest"]);
  });
});
