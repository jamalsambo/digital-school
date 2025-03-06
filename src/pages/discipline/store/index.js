import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

const authStore = useAuthStore();
const {institutionId} = authStore.user.userDetails;

export const useDisciplineStores = defineStore("discipline", {
  state: () => ({
    disciplines: [],
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list() {
      const { data, error } = await api.get(
        `/discipline/${institutionId}/institution`
      );
      if (error) throw error;
      this.disciplines = data;
    },

    async create(params) {
      const { data, error } = await api.post("/discipline", params);
      if (error) throw error;
      return data;
    },

    async delete(id) {
      const { data, error } = await api.delete(`/discipline/${id}`);
      if (error) throw error;
      return data;
    },
  },
});
