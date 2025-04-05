import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

export const useInstitutionStores = defineStore("institution", {
  state: () => ({
    institutions: [],
    institution: {},
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list(params) {
      const { data, error } = await api.get("/institution", {params: params});
      if (error) throw error;
      this.institutions = data;
    },

    async create(params) {
      const { data, error } = await api.post("/institution", params);
      if (error) throw error;
      return data;
    },

    async update(id, params) {
      const { data, error } = await api.put(`/institution/${id}`, params);
      if (error) throw error;
      this.institution = data;
    },

    async findOne(id) {
      const { data, error } = await api.get(`/institution/${id}`);
      if (error) throw error;
      this.institution = data;
    },

    async findDomain(domain) {
      const { data, error } = await api.get(`/institution/domain/${domain}`);
      if (error) throw error;
      this.institution = data;
    },

    async deleteInstitutionEducation(params) {
      const { data, error } = await api.delete(
        "/institution/education/level/delete",
        { params: params }
      );
      if (error) throw error;
      return data;
    },

    /* site */
    async createMainCarroselImagen(params) {
      const authStore = useAuthStore();
      const institutionId = authStore?.user?.userDetails?.institutionId ?? null;
      const { data, error } = await api.post("/site/main-carrosel", {
        ...params,
        institutionId: institutionId,
      });
      if (error) throw error;
      return data;
    },
    async createAboutUsCarroselImagen(params) {
      const authStore = useAuthStore();
      const institutionId = authStore?.user?.userDetails?.institutionId ?? null;
      const { data, error } = await api.post("/site/about-us-carrosel", {
        ...params,
        institutionId: institutionId,
      });
      if (error) throw error;
      return data;
    },
  },
});
