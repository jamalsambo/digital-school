import { defineStore } from "pinia";
import { api } from "src/boot/axios";

import { useAuthStore } from "src/pages/auth/store";

export const useDashboardStores = defineStore("dashboard", {
  state: () => ({
    studentStatusSummary: {},
    financialSummary: {}
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async getStudentStatusSummary() {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.get(`/dashboard/${institutionId}/student-status-summary`);
      if (error) throw error;
      this.studentStatusSummary = data;
    },
    async getFinancialSummary() {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.get(`/dashboard/${institutionId}/financial-summary`);
      if (error) throw error;
      this.financialSummary = data;
    }
  }
});
