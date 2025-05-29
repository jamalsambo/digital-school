import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";
import scripts from "src/composables/Scripts";

const { filterEnrollmentsByYear} = scripts()

export const useStudentStores = defineStore("student", {
  state: () => ({
    students: [],
    student: {},
    studentPaternity: {},
  }),
  getters: {
    enrollmentActive: (state) =>  filterEnrollmentsByYear(state.student?.enrollments, new Date().getFullYear())
  },
  actions: {
    async list(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.get("/student", {
        params: { ...params, institutionId: institutionId },
      });
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
      const { institutionId } = authStore.user;
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
    },
  },
});
