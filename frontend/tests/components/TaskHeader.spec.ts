/* Test du composant TaskHeader
 * pour vérifier qu'il affiche correctement le prénom de l'utilisateur
 * et qu'il émet un événement de déconnexion
 * lorsqu'on clique sur le bouton "Se déconnecter".
 */
import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import TaskHeader from "../../app/components/tasks/TaskHeader.vue";

describe("TaskHeader", () => {
  it("affiche le prénom de l'utilisateur dans le message de bienvenue", () => {
    const wrapper = mount(TaskHeader, {
      props: {
        firstName: "Horly",
      },
    });

    expect(wrapper.text()).toContain("Bienvenue, Horly");
    expect(wrapper.text()).toContain("Mes tâches");
  });

  it("émet un événement logout lorsque l'utilisateur clique sur Se déconnecter", async () => {
    const wrapper = mount(TaskHeader, {
      props: {
        firstName: "Horly",
      },
    });

    await wrapper.get("button").trigger("click");

    expect(wrapper.emitted("logout")).toHaveLength(1);
  });
});
