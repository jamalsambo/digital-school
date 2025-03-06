import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useCourseStores = defineStore("course", {
  state: () => ({
    courses: [],
    course: {},
    classe: {}
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list() {
      const { data, error } = await api.get("/course");
      if (error) throw error;
      this.courses = data;
    },

    async create(params) {
      const { data, error } = await api.post("/course", params);
      if (error) throw error;
      return data;
    },

    async findOne(id) {
      const { data, error } = await api.get(`/course/${id}`);
      if (error) throw error;
      this.course = data;
    },

    // curriculum
    async createCurriculum(params) {
      const { data, error } = await api.post("/curriculum-plan", params);
      if (error) throw error;
      return data;
    },

    async addDiscipline(params) {
      const { data, error } = await api.post(
        `/curriculum-plan/associate-to-discipline`,
        params
      );
      if (error) throw error;
      return data;
    },

    // Turma
    async createClasse(params) {
      const { data, error } = await api.post("/class", params);
      if (error) throw error;
      this.classe = data;
    },
    async editClasse(id,params) {
      const { data, error } = await api.put(`/class/${id}`,params);
      if (error) throw error;
      return data;
    },
  },
});
