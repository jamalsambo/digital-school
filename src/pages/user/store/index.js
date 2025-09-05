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
    async findOne(id) {
      const { data, error } = await api.get(`/user/${id}`);
      if (error) throw error;
      this.user = data;
    },
    async findUsername(username) {
  try {
    const { data } = await api.get(`/user/${username}/username`);
    this.user = data;
  } catch (error) {
    if (error.response?.status === 404) {
      this.user = null; // Usuário não encontrado
    } else {
      throw error; // Outros erros (ex: servidor fora do ar) continuam sendo lançados
    }
  }
},
    async create(params) {
      const { data, error } = await api.post("/user", {
        ...params,
      });
      if (error) throw error;
      this.user = data;
    },
    async update(id, params) {
      const { data, error } = await api.put(`/user/${id}`, params);
      if (error) throw error;
      this.user = data;
    },
    async addPermissions(id, params) {
      const { data, error } = await api.post(`/user/${id}/permissions`, params);
      if (error) throw error;
      data;
    },
    async removePermissions(id, permissionItenId) {
      const { data, error } = await api.delete(
        `/user/${id}/permissions/${permissionItenId}`
      );
      if (error) throw error;
      return data;
    },
  },
});
