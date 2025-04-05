import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

export const useDisciplineStores = defineStore("discipline", {
  state: () => ({
    disciplines: [],
    discipline: {},
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list(educationId) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.get(
        `/discipline/${institutionId}/${educationId}`
      );
      if (error) throw error;
      this.disciplines = data;
    },

    async create(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.post("/discipline", {
        ...params,
        institutionId: institutionId,
      });
      if (error) throw error;
      return data;
    },

    async findOne(id) {
      const { data, error } = await api.get(`/discipline/${id}`);
      if (error) throw error;
      this.discipline = data;
    },

    async delete(id) {
      const { data, error } = await api.delete(`/discipline/${id}`);
      if (error) throw error;
      return data;
    },
    async update(id, params) {
      const { data, error } = await api.put(`/discipline/${id}`, params);
      if (error) throw error;
      return data;
    },
  },
});
