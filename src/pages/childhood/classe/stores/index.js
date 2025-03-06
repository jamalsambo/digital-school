import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

export const useChildhoodClasseStores = defineStore("childhood-classe", {
  state: () => ({
    classes: [],
    classe: {},
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list(internship) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user.userDetails;
      const { data, error } = await api.get("/childhood-classes", {
        params: { institutionId: institutionId, internshipId: internship },
      });
      if (error) throw error;
      this.classes = data;
    },

    async findOne(id) {
      const { data, error } = await api.get(`/childhood-classes/${id}`);
      if (error) throw error;
      this.classe = data;
    },

    async create(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user.userDetails;
      const { data, error } = await api.post("/childhood-classes", {...params, institutionId: institutionId});
      if (error) throw error;
      this.classe = data;
    },

    async update(id, params) {
      const { data, error } = await api.put(
        `/childhood-classes/${id}`,
        params
      );
      if (error) throw error;
      this.classe = data;
    },
  },
});
