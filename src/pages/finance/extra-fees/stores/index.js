import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

export const useExtraFeeStores = defineStore("fees", {
  state: () => ({
    extraFees: [],
    extraFee: {},
    extraFeeEnrollment: {},
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.get(`/extra-fees/${institutionId}`, {
        params: params,
      });
      if (error) throw error;
      this.extraFees = data;
    },

    async create(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.post("/extra-fees", {
        ...params,
        institutionId: institutionId,
      });
      if (error) throw error;
      this.extraFee = data;
    },

    async delete(params) {
      const { data, error } = await api.delete(`/extra-fees`, {
        params: params,
      });
      if (error) throw error;
      return data;
    },

    /* extra fees to enrollment */
    async createFeesToEnrollment(classeId, feesId) {
      const { data, error } = await api.post(`extra-fees/enrollment/${classeId}/${feesId}`);
      if (error) throw error;
      return data;
    },

    async deleteFeesToEnrollment(classeId, feesId) {
      const { data, error } = await api.delete(`extra-fees/enrollment/${classeId}/${feesId}`);
      if (error) throw error;
      return data;
    },

     /* extra fees to extra */
    async createFeesToRenew(classeId, feesId) {
      const { data, error } = await api.post(`extra-fees/renew/${classeId}/${feesId}`);
      if (error) throw error;
      this.extraFee = data;
    },

    async deleteFeesToRenew(classeId, feesId) {
      const { data, error } = await api.delete(`extra-fees/renew/${classeId}/${feesId}`);
      if (error) throw error;
      return data;
    },

  },
});
