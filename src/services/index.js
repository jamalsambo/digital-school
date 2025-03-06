import { data } from "autoprefixer";
import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useServicesStores = defineStore("service", {
  state: () => ({
    provinces: [],
    countriess: [],
    extraFees: [],
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async countries() {
      const { data, error } = await api.get("/country");
      if (error) throw error;
      this.countriess = data;
    },
    async list() {
      const { data, error } = await api.get("/province");
      if (error) throw error;
      this.provinces = data;
    },
    async upload(formData) {
      const { data, error } = await api.post("/upload/single", formData);
      if (error) throw error;
      return data;
    },
    async listExtraFees() {
      const { data, error } = await api.get("/extra-fees");
      if (error) throw error;
      this.extraFees = data;
    }
  },
});
