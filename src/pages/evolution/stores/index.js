import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

export const useEvolutionStores = defineStore("evolution", {
  state: () => ({
    evolutionTypes: [],
    evolutionType: {},
    evolution: {},
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list() {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.get("test-type", {
        params: { institutionId: institutionId },
      });
      if (error) throw error;
      this.evolutionTypes = data;
    },
    async create(params) {
      const { data, error } = await api.post(`/evolution`, params);
      if (error) throw error;
      this.evolution = data;
    },
    async createType(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.post("test-type", {
        ...params,
        institutionId: institutionId,
      });
      if (error) throw error;
      return data;
    },
    async updateType(id, params) {
      const { data, error } = await api.put(`/test-type/${id}`, params);
      if (error) throw error;
      this.evolutionType = data;
    },
  },
});
