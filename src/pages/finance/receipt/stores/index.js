import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

export const useReceiptStores = defineStore("receipt", {
  state: () => ({
     receipts: [],
     receipt: {}
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list() {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user.userDetails;
      const { data, error } = await api.get(
        `receipt/institution/${institutionId}`
      );
      if (error) throw error;
      this.receipts = data;
    },

    async create(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user.userDetails;
      const { data, error } = await api.post("receipt", {
        ...params,
        institutionId: institutionId,
      });
      if (error) throw error;
      this.shift = data;
    },
  },
});
