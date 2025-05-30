import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

const authStore = useAuthStore();
const { institutionId } = authStore.user;

export const useGroupStores = defineStore("work-group", {
  state: () => ({
    groups: [],
    group: {},
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list(params) {
      const { data, error } = await api.get("/work-group", {
        params: params,
        institutionId: institutionId,
      });
      if (error) throw error;
      this.groups = data;
    },
    async create(params) {
      const { data, error } = await api.post("/work-group", {
        ...params,
        institutionId: institutionId,
      });

      if (error) throw error;
      this.group = data;
    },
    async update(id, params) {
      const { data, error } = await api.put(`/work-group/${id}`, params);
      if (error) throw error;
      this.group = data;
    },
    async findOne(id) {
      const { data, error } = await api.get(`/work-group/${id}`);
      if (error) throw error;
      this.group = data;
    },
    async addMembers(params) {
      const { data, error } = await api.post("/work-group/add-members", {
        ...params,
      });
      if (error) throw error;
      return data;
    },
    async removeMembers(groupId,studentId) {
      const { data, error } = await api.delete(`/work-group/${groupId}/member/${studentId}`);
      if (error) throw error;
      return data;
    },
  },
});
