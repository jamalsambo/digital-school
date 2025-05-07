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
    location: {},
    moves: []
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    /* Asset */
    async list() {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.get("/asset", {
        params: { institutionId: institutionId },
      });
      if (error) throw error;
      this.assets = data;
    },
    async create(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.post("/asset", {
        ...params,
        institutionId: institutionId,
      });
      if (error) throw error;
      this.asset = data;
    },
    async update(id, params) {
      const { data, error } = await api.put(`/asset/${id}`, params);
      if (error) throw error;
      this.asset = data;
    },
    async findOne(id) {
      const { data, error } = await api.get(`/asset/${id}`);
      if (error) throw error;
      this.asset = data;
    },
    async categories() {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.get("/category-patrimony", {
        params: { institutionId: institutionId },
      });
      if (error) throw error;
      this.categories = data;
    },

    async createCategory(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.post("/category-patrimony", {
        ...params,
        institutionId: institutionId,
      });
      if (error) throw error;
      this.category = data;
    },

    /* Location */
    async findlocations() {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.get("/location-patrimony", {
        params: { institutionId: institutionId },
      });
      if (error) throw error;
      this.locations = data;
    },

    async createLocation(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.post("location-patrimony", {
        ...params,
        institutionId: institutionId,
      });
      if (error) throw error;
      this.asset = data;
    },
    /* Asset Move */
    async findMoves() {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.get("/patrimony-moviment", {
        params: { institutionId: institutionId },
      });
      if (error) throw error;
      this.moves = data;
    },
    async createMove(params) {
      const authStore = useAuthStore();
      const { institutionId  } = authStore.user
      const { data, error } = await api.post("/patrimony-moviment", {
        ...params,
        institutionId: institutionId,
      });
      if (error) throw error;
      this.asset = data;
    },
  },
});
