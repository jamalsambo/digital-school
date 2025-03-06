import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useDocumentStores = defineStore("document", {
  state: () => ({
    documents: [],
    document: {},
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async create(params) {
      const { data, error } = await api.post("/document", params);
      if (error) throw error;
      this.document = data;
    },

    async delete(id) {
      const { data, error } = await api.delete(`/document/${id}`);
      if (error) throw error;
      return data;
    },

    async addToOwner(owner) {
      const { data, error } = await api.post(`/document/add-to-owner`, owner);
      if (error) throw error;
      return data;
    }
  },
});
