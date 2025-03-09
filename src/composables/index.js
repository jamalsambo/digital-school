
import { data } from "autoprefixer";
import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useComposablesStores = defineStore("composables", {
  state: () => ({
    provinces: [],
    countries: [],
    extraFees: [],
    educationLevels: [],
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async findCountries() {
      const { data, error } = await api.get("/country");
      if (error) throw error;
      this.countries = data;
    },
    async findProvinces() {
      const { data, error } = await api.get("/province");
      if (error) throw error;
      this.provinces = data;
    },
    async upload(formData) {
      const { data, error } = await api.post("/upload/single", formData);
      if (error) throw error;
      return data;
    },
    async findEducationLevels() {
      const { data, error } = await api.get("/education-level");
      if (error) throw error;
      this.educationLevels = data;
    },
    async listExtraFees() {
      const { data, error } = await api.get("/extra-fees");
      if (error) throw error;
      this.extraFees = data;
    }
  },
});
