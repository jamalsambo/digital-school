import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

export const useCurriculumPlanStores = defineStore("curriculum-plan", {
  state: () => ({
    curriculumPlans: [],
    curriculumPlan: {},
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user.userDetails;
      const { data, error } = await api.get("/curriculum-plan", { params: {...params, institutionId:institutionId}});
      if (error) throw error;
      this.curriculumPlans = data;
    },

    async create(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user.userDetails;
      const { data, error } = await api.post("/curriculum-plan", {
        ...params,
        institutionId: institutionId,
      });
      if (error) throw error;
      return data;
    },

    async update(id, params) {
      const { data, error } = await api.put(`/curriculum-plan/${id}`, params);
      if (error) throw error;
      return data;
    },

    async delete(id) {
      const { data, error } = await api.delete(`/curriculum-plan/${id}`);
      if (error) throw error;
      return data;
    },

    async findOne(id) {
      const { data, error } = await api.get(`/curriculum-plan/${id}`);
      if (error) throw error;
      this.curriculumPlan = data;
    },

    async addCourseToCurriculum(curriculumId, courseId) {
      const { data, error } = await api.post(
        `/curriculum-plan/${curriculumId}/courses/${courseId}`
      );
      if (error) throw error;
      return data;
    },
  },
});
