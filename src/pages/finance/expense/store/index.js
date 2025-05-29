import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

export const useExpenseStores = defineStore("expense", {
  state: () => ({
    expense: {},
    expenses: [],
    expenseCategories: [],
    expenseCategory: {},
  }),
  getters: {},
  actions: {
    async findAll() {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.get(`expense/${institutionId}`);
      if (error) throw error;
      this.expenses = data;
    },
    async create(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.post("/expense", {
        ...params,
        institutionId: institutionId,
      });
      if (error) throw error;
      this.expense = data;
    },
    /* routas de category */
    async findCategory() {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.get(
        `expense/category/${institutionId}`
      );
      if (error) throw error;
      this.expenseCategories = data;
    },
    async createCategory(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.post("/expense/category", {
        ...params,
        institutionId: institutionId,
      });
      if (error) throw error;
      this.expenseCategory = data;
    },
  },
});
