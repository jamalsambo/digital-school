import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

export const useEmployeeStores = defineStore("employee", {
  state: () => ({
    employees: [],
    employee: {},
    teachings: [],
    teaching: {},
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list() {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user.userDetails;
      const { data, error } = await api.get("/employee");
      if (error) throw error;
      this.employees = data;
    },

    async findOne(id) {
      const { data, error } = await api.get(`/employee/${id}`);
      if (error) throw error;
      this.employee = data;
    },

    async create() {
      const { data, error } = await api.post("/employee", {
        institutionId: institutionId,
      });
      if (error) throw error;
      this.employee = data;
    },

    async update(id, employee) {
      const { data, error } = await api.put(`/employee/${id}`, employee);
      if (error) throw error;
      this.employee = data;
    },

    async findTeachings(id, params) {
      const { data, error } = await api.get(`/employee/${id}/teachings`, {
        params: params,
      });
      if (error) throw error;
      this.teachings = data;
    },

    async addTeachings(params) {
      const { data, error } = await api.post(`/employee/teachings`, params);
      if (error) throw error;
      this.teachings = data;
    },
  },
});
