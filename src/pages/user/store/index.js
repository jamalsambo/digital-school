import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

export const useUserStores = defineStore("user", {
  state: () => ({
    user: {},
    users: [],
  }),
  getters: {},
  actions: {
    async findAll() {
      const { data, error } = await api.get("/user");
      if (error) throw error;
      this.users = data;
    },
    async create(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user.userDetails;
      const { data, error } = await api.post("/user", {
        ...params,
        institutionId: institutionId,
      });
      if (error) throw error;
      this.user = data;
    },
    async update(id, params) {
      const { data, error } = await api.put(`/user/${id}`, params);
      if (error) throw error;
      this.user = data;
    },
  },
});
