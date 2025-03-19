import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";



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
      const authStore = useAuthStore();
const { institutionId } = authStore.user;
      const { data, error } = await api.get("/notification", {params: params});
      if (error) throw error;
      this.notifications = data;
    },

    async create(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user.userDetails;
      const { data, error } = await api.post("/notification", {
        ...params,
        institutionId: institutionId,
      });

      if (error) throw error;
      this.notification = data;
    },
  },
});
