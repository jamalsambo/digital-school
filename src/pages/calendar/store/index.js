import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

const authStore = useAuthStore();
const { institutionId } = authStore.user.userDetails;

export const useCalendarStores = defineStore("calendar", {
  state: () => ({
    events: [],
    event: {}
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list() {
      const { data, error } = await api.get(`/calendar/${institutionId}`);
      if (error) throw error;
      this.events = data;
    },
    async create(params) {
      const { data, error } = await api.post("/calendar", {
        ...params,
        institutionId: institutionId,
      });
      if (error) throw error;
      this.event = data;
    },
  },
});
