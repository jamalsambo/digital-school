import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

const authStore = useAuthStore();
const { institutionId } = authStore.user.userDetails;

export const useTaskStores = defineStore("task", {
  state: () => ({
    tasks: [],
    task: {},
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list(params) {
      const { data, error } = await api.get("/task", {
        params: params,
        institutionId: institutionId,
      });
      if (error) throw error;
      this.tasks = data;
    },

    async create(params) {
      const { data, error } = await api.post("/task", {
        ...params,
        institutionId: institutionId,
      });

      if (error) throw error;
      this.task = data;
    },
    async findOne(id) {
      const { data, error } = await api.get(`/task/${id}`);
      if (error) throw error;
      this.task = data;
    },

    async addToGroup (params) {
      const { data, error } = await api.post("/task/add-group", params);
      if (error) throw error;
       return data;
    },
    async removeGroupTask (params) {
      const { data, error } = await api.delete("/task/remove-group", {params: params});
      if (error) throw error;
      return data;
    },
    async AddToStudent (params) {
      const { data, error } = await api.post("/task/add-student", params);
      if (error) throw error;
       return data;
    },
    async removeStudentTask (params) {
      const { data, error } = await api.delete("/task/remove-student", {params: params});
      if (error) throw error;
      return data;
    }

  },
});
