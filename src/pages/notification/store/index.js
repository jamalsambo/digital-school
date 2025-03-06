import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

const authStore = useAuthStore();
const { institutionId } = authStore.user.userDetails;

export const useNotificationStores = defineStore("notification", {
  state: () => ({
    notifications: [],
    notification: {},
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list(params) {
      const { data, error } = await api.get("/notification", {params: params});
      if (error) throw error;
      this.notifications = data;
    },

    async create(params) {
      const { data, error } = await api.post("/notification", {
        ...params,
        institutionId: institutionId,
      });

      if (error) throw error;
      this.notification = data;
    },
  },
});
