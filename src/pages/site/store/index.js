import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useSiteStores = defineStore("site", {
  state: () => ({
    institution: {},
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
  },
});
