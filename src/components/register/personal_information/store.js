import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useBasicStores = defineStore("basic-information", {
  state: () => ({
    basicInformation: {},
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async create(params) {
      const { data, error } = await api.post("/basic-information", params);
      if (error) throw error;
      this.basicInformation = data;
    },
    async update(id, params) {
      const { data, error } = await api.put(`/basic-information/${id}`, params);
      if (error) throw error;
      this.basicInformation = data;
    },
    async findOne(id) {
      const { data, error } = await api.get(`/basic-information/${id}`);
      if (error) throw error;
      this.basicInformation = data;
    },
  },
});
