import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useContactStores = defineStore("contact", {
  state: () => ({
    contacts: [],
    contact: {},
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list() {
      const { data, error } = await api.get("/contact");
      if (error) throw error;
      this.contacts = data;
    },

    async create(params) {
      const { data, error } = await api.post("/contact", params);
      if (error) throw error;
      this.contact = data;
    },

    async delete(id) {
      const { data, error } = await api.delete(`/contact/${id}`);
      if (error) throw error;
      return data;
    },

    async addToOwner(owner) {
      const { data, error } = await api.post(`/contact/add-to-owner`, owner);
      if (error) throw error;
      return data;
    }
  },
});
