import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

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
       const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.post("/contact", {
        ...params,
        institutionId: institutionId,
      });
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
