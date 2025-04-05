import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

export const usePlanStores = defineStore("plan", {
  state: () => ({
    plans: [],
    plan: {},
    permissions: [],
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list() {
      const { data, error } = await api.get(`/plan`);
      if (error) throw error;
      this.plans = data;
    },

    async findOne(id) {
      const { data, error } = await api.get(`/plan/${id}`);
      if (error) throw error;
      this.plan = data;
    },

    async create(params) {
      const { data, error } = await api.post(`/plan`, {
        ...params,
      });
      if (error) throw error;
      this.plan = data;
    },

    async update(id, params) {
      const { data, error } = await api.put(`/plan/${id}`, params);
      if (error) throw error;
      this.plan = data;
    },

    async addPlanPermission(planId, permissionId) {
      const { data, error } = await api.post(
        `/plan/${planId}/permission/${permissionId}`
      );
      if (error) throw error;
      return data;
    },

    async permissions() {
      const { data, error } = await api.get(`/permission`);
      if (error) throw error;
      this.permissions = data;
    },
  },
});
