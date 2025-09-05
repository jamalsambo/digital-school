import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

export const useFinanceReportStores = defineStore("finance-report", {
  state: () => ({
     report: {},
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async findFinanceReport(from,to) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.get(
        `report/finance/${institutionId}/${from}/${to}`,
      );
      if (error) throw error;
      this.report = data;
    },
  },
});
