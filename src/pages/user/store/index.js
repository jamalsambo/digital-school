import { defineStore } from "pinia";
import { api } from "src/boot/axios";

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
      const { data, error } = await api.post("/user", params);
      if (error) throw error;
      this.user = data;
    },
    async update(id,params) {
      const { data, error } = await api.put(`/user/${id}`, params );
      if (error) throw error;
      this.user = data;
    },
  },
});
