import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useCurriculumPlanStores = defineStore("curriculum-plan", {
  state: () => ({
    curriculumPlans: [],
    curriculumPlan: {}
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list() {
      const { data, error } = await api.get("/curriculum-plan");
      if (error) throw error;
      this.curriculumPlans = data;
    },

    async create(params) {
      const { data, error } = await api.post("/curriculum-plan", params);
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
      return data;
    },

    async addDiscipline(params) {
      const { data, error } = await api.post(`/curriculum-plan/associate-to-discipline`, params);
      if (error) throw error;
      return data;
    },

    async removeDiscipline(id, disciplineId) {
      const { data, error } = await api.delete(`/curriculum-plan/${id}/disciplines/${disciplineId}`);
      if (error) throw error;
      return data;
    }
  },
});
