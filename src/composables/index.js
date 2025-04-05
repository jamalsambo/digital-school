import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import useSupabase from "boot/supabase";
import { v4 as uuidv4 } from "uuid";

export const useComposablesStores = defineStore("composables", {
  state: () => ({
    provinces: [],
    countries: [],
    extraFees: [],
    educationLevels: [],
    userSupabase: ''
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
    async login( email, password )  {
      const { supabase } = useSupabase();
      const { user, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return user
    },
    async upload(formData) {
      const { data, error } = await api.post("/upload/single", formData);
      if (error) throw error;
      return data;
    },
    async uploadFromSupabase(file, storage) {
      const { supabase } = useSupabase();
      const filename = uuidv4();
      const { error } = supabase.storage.from(storage).upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
      });
      const publicUrl = this.getURlPublic(filename, storage);
      if (error) throw error;
      return publicUrl;
    },
    async getURlPublic(filename, storage) {
      const { supabase } = useSupabase();

      const { data, error } = supabase
        .storage
        .from(storage)
        .getPublicUrl(filename);

      if (error) {
        throw error;
      }

      return data.publicUrl;
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
    },
  },
});
