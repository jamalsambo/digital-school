import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

export const useAssetStores = defineStore("asset", {
  state: () => ({
    assets: [],
    asset: {},
    categories: [],
    category: {},
    locations: [],
    location: {}
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    /* Asset */
    async list() {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.get("/asset",{params: {institutionId: institutionId}});
      if (error) throw error;
      this.assets = data;
    },
    async create(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.post("/asset", {...params, institutionId: institutionId});
      if (error) throw error;
      this.asset = data;
    },
    async categories() {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.get("/category-patrimony",{params: {institutionId: institutionId}});
      if (error) throw error;
      this.categories = data;
    },

    async createCategory(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.post("/category-patrimony", {...params, institutionId: institutionId});
      if (error) throw error;
      this.category = data;
    },

     /* Location */
     async locations() {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.get("/location-patrimony",{params: {institutionId: institutionId}});
      if (error) throw error;
      this.locations = data;
    },

    async createLocation(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.post("location-patrimony", {...params, institutionId: institutionId});
      if (error) throw error;
      this.asset = data;
    },

    async update(id, employee) {
      const { data, error } = await api.put(`/employee/${id}`, employee);
      if (error) throw error;
      this.employee = data;
    },
  },
});
