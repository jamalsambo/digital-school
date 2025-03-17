import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

export const useShiftStores = defineStore("shift", {
  state: () => ({
    shifts: [],
    shift: {},
    activityFixe: {},
    activitiesFixes: [],
    scheduleFixe: {},
    scheduleFixes: []
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

    async createActivitiesFixes(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user.userDetails;
      const { data, error } = await api.post("/shift/activities-fixes", {...params, institutionId: institutionId});
      if (error) throw error;
      this.activityFixe = data;
    },

    async findActivityFixe() {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user.userDetails;
      const { data, error } = await api.get(`shift/activities-fixes/institution/${institutionId}`);
      if (error) throw error;
      this.activitiesFixes = data;
    },

    async createShiftFixe(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user.userDetails;
      const { data, error } = await api.post("/shift/fixes", {...params, institutionId: institutionId});
      if (error) throw error;
      this.scheduleFixe = data;
    },

    async findShiftFixe() {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user.userDetails;
      const { data, error } = await api.get(`shift/fixes/institution/${institutionId}`);
      if (error) throw error;
      this.scheduleFixes = data;
    },
  },
});
