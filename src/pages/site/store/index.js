import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useSiteStores = defineStore("site", {
  state: () => ({
    institution: {},
    education: {},
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
  },
});
