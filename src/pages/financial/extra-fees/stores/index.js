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
      const { institutionId } = authStore.user.userDetails;
      const { data, error } = await api.get(`/extra-fees/${institutionId}`, {
        params: params,
      });
      if (error) throw error;
      this.extraFees = data;
    },

    async create(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user.userDetails;
      const { data, error } = await api.post("/extra-fees", {
        ...params,
        institutionId: institutionId,
      });
      if (error) throw error;
      this.extraFee = data;
    },

    async createFeesToEnrollment(params) {
      const { data, error } = await api.post("/extra-fees/enrollments", params);
      if (error) throw error;
      this.extraFee = data;
    },

    async feesEnrollments(classId, extraFeesId) {
      const { data, error } = await api.get(
        `/extra-fees/enrollments/${classId}/${extraFeesId}`
      );
      if (error) throw error;
      this.extraFeeEnrollment = data;
    },

    async delete(params) {
      const { data, error } = await api.delete(`/extra-fees`, {
        params: params,
      });
      if (error) throw error;
      return data;
    },

    /* childhood */
    async childhoodCreateFeesToEnrollment(params) {
      const { data, error } = await api.post("/extra-fees/childhood/enrollments", params);
      if (error) throw error;
      this.extraFee = data;
    },

    async childhoodDeleteFeesToEnrollment(classId,extraFeesId) {
      const { data, error } = await api.delete(`/extra-fees/childhood/${classId}/${extraFeesId}`);
      if (error) throw error;
      return data;
    },
  },
});
