import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useSiteStores = defineStore("site", {
  state: () => ({
    institution: {},
    education: {},
    mainCarroselImagens: [],
    aboutUsCarroselImagens: [],
    courses: []
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async findDomain(domain) {
      const { data, error } = await api.get(`/institution/domain/${domain}`);
      if (error) throw error;
      this.institution = data;
    },
    async findEducationByName(name) {
      const { data, error } = await api.get(`/course/name/${name}`);
      if (error) throw error;
      this.education = data;
    },
    async findMainCarroselImagens(institutionId) {
      const { data, error } = await api.get(`/site/main-carrosel/${institutionId}`);
      if (error) throw error;
      this.mainCarroselImagens = data;
    },
     async findAboutUsCarroselImagens(institutionId) {
      const { data, error } = await api.get(`/site/about-us-carrosel/${institutionId}`);
      if (error) throw error;
      this.aboutUsCarroselImagens = data;
    },
     async findCorses(institutionId) {
      const { data, error } = await api.get(`/site/courses/${institutionId}`);
      if (error) throw error;
      this.courses = data;
    }

  },
});
