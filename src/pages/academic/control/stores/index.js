import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useHistoryStores = defineStore("history", {
  state: () => ({
    studentHistory: {},
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async findStudentHistory(studentId,courseId) {
      const { data, error } = await api.get(`/history/student/${studentId}/course/${courseId}`);
      if (error) throw error;
      this.studentHistory = data;
    },

  },
});
