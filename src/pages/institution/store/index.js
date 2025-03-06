import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

export const useInstitutionStores = defineStore("institution", {
  state: () => ({
    institutions: [],
    institution: {},
    shifts: [],
    educationLevel: [],
    rooms: [],
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list() {
      const { data, error } = await api.get("/institution");
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

    async createInstitutionShift(params) {
      const { data, error } = await api.post("/institution/shift", params);
      if (error) throw error;
      return data;
    },

    async findShifts(params) {
      const authStore = useAuthStore();
      const institutionId = authStore?.user?.userDetails?.institutionId ?? null;
      const { data, error } = await api.get("/institution/shift/find", {
        params: { institutionId: institutionId, ...params },
      });
      if (error) throw error;
      this.shifts = data;
    },

    async createInstitutionEducation(params) {
      const { data, error } = await api.post(
        "/institution/education/level/create",
        params
      );
      if (error) throw error;
      return data;
    },

    async deleteInstitutionEducation(params) {
      const { data, error } = await api.delete(
        "/institution/education/level/delete",
        { params: params }
      );
      if (error) throw error;
      return data;
    },

    async findEducationLevel() {
      const { data, error } = await api.get("/institution/education/level");
      if (error) throw error;
      this.educationLevel = data;
    },

    //rooms
    async listRooms() {
      const authStore = useAuthStore();
      const institutionId = authStore?.user?.userDetails?.institutionId ?? null;
      const { data, error } = await api.get(
        `class/institution/${institutionId}/room`
      );
      if (error) throw error;
      this.rooms = data;
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
