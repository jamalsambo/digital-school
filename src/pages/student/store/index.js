import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

export const useStudentStores = defineStore("student", {
  state: () => ({
    students: [],
    student: {},
    studentPaternity: {}
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list(params) {
      const { data, error } = await api.get("/student", {params: params});
      if (error) throw error;
      this.students = data;
    },

    async findOne(id) {
      const { data, error } = await api.get(`/student/${id}`);
      if (error) throw error;
      this.student = data;
    },

    async create() {
      const authStore = useAuthStore();
const { institutionId } = authStore.user.userDetails;
      const { data, error } = await api.post("/student", {
        institutionId: institutionId,
      });
      if (error) throw error;
      this.student = data;
    },

    async update(id, student) {
      const { data, error } = await api.put(`/student/${id}`, student);
      if (error) throw error;
      this.student = data;
    },

    async paternity(params) {
      const { data, error } = await api.post("/student/paternity", params);
      if (error) throw error;
      this.studentPaternity = data;
    },

    async paternityUpdate(id, params) {
      const { data, error } = await api.put(`/student/paternity/${id}`, params);
      if (error) throw error;
      this.studentPaternity = data;
    },

    async createPaymentType(params) {
      const { data, error } = await api.post(`/student/payment-type`, params);
      if (error) throw error;
      return data;
    }

  },
});
