import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

export const useShiftStores = defineStore("shift", {
  state: () => ({
    shifts: [],
    shift: {},
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list() {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user.userDetails;
      const { data, error } = await api.get(
        `shift/institution/${institutionId}`
      );
      if (error) throw error;
      this.shifts = data;
    },

    async create(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user.userDetails;
      const { data, error } = await api.post("shift", {
        ...params,
        institutionId: institutionId,
      });
      if (error) throw error;
      this.shift = data;
    },

    async update(id, params) {
      const { data, error } = await api.put(`shift/${id}`, params);
      if (error) throw error;
      this.shift = data;
    },
  },
});
