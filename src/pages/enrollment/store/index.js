import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

export const useEnrollmentStores = defineStore("enrollment", {
  state: () => ({
    enrollments: [],
    enrollment: {},
    renew: {},
    extraFees: {}
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async create(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.post("/enrollment", {...params, institutionId: institutionId});
      if (error) throw error;
      this.enrollment = data;
    },
    async update(id, params) {
      const { data, error } = await api.put(`/enrollment/${id}`, params);
      if (error) throw error;
      this.enrollment = data;
    },
    async renew(params) {
      const { data, error } = await api.post("/enrollment/renew", params);
      if (error) throw error;
      this.renew = data;
    },
    async findById(id) {
      const { data, error } = await api.get(`/enrollment/${id}`);
      if (error) throw error;
      this.enrollment =  data;
    },
    async findByStudent(id) {
      const { data, error } = await api.get(`/enrollment/student/${id}`);
      if (error) throw error;
      this.enrollments = data;
    },
    async findByClass(id) {
      const { data, error } = await api.get(`/enrollment/class/${id}`);
      if (error) throw error;
      this.enrollments = data;
    },
    async addExtraFees(classId, extraFeesId) {
      const { data, error } = await api.post(`enrollment/${classId}/extra-fees/${extraFeesId}`);
      if (error) throw error;
      return data;
    }
  },
});
