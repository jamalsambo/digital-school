import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useClassStores = defineStore("classe", {
  state: () => ({
    classes: [],
    classe: {},
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list(queryParams) {
      const { data, error } = await api.get("/class", {
        params: queryParams, // Aqui você passa os parâmetros da query
      });
      if (error) throw error;
      this.classes = data;
    },

    async create(params) {
      const { data, error } = await api.post("/class", params);
      if (error) throw error;
      this.classe = data;
    },

    async findOne(id) {
      const { data, error } = await api.get(`/class/${id}`);
      if (error) throw error;
      this.classe = data;
    }
  },
});
