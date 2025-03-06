import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useInternshipStores = defineStore("internship", {
  state: () => ({
    internships: [],
    internship: {},
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list(params) {
      const { data, error } = await api.get(`/chilhood-internship`, {
        params: params,
      });
      if (error) throw error;
      this.internships = data;
    },

    async create(params) {
      const { data, error } = await api.post("/chilhood-internship", {
        ...params,
      });
      if (error) throw error;
      return data;
    },

    async findOne(id) {
      const { data, error } = await api.get(`/chilhood-internship/${id}`);
      if (error) throw error;
      this.internship = data;
    },
    async update(id, params) {
      const { data, error } = await api.put(
        `/chilhood-internship/${id}`,
        params
      );
      if (error) throw error;
      this.internship = data;
    },
  },
});
