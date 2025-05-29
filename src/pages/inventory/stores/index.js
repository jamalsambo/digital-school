import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

export const useInventoryStores = defineStore("inventory", {
  state: () => ({
    moves: [],
    products: [],
    categories: [],
    suppliers: [],
  }),
  getters: {},
  actions: {
    /* Secção de Stock */
    async findStockMove() {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.get(`/stock-movement`, {params: {institutionId:institutionId}});
      if (error) throw error;
      this.moves = data;
    },

    async create(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.post("/stock-movement", {
        institutionId: institutionId,
       ...params,
      });
      if (error) throw error;
      this.move = data;
    },

     /* Secção de productos */
    async findProducts() {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.get("/product", { params: { institutionId: institutionId}});
      if (error) throw error;
      this.products = data;
    },

    async findSuppliers() {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.get("/supplier", { params: { institutionId: institutionId}});
      if (error) throw error;
      this.suppliers = data;
    },

    async findCategories() {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.get("/category-product", { params: { institutionId: institutionId}});
      if (error) throw error;
      this.categories = data;
    },
     async createProduct(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.post("/product", {
        institutionId: institutionId,
       ...params,
      });
      if (error) throw error;
      return data;
    },
    async createProductCategory(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.post("/category-product", {
        institutionId: institutionId,
       ...params,
      });
      if (error) throw error;
      return data;
    },
    async createProductSupplier(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.post("/supplier", {
        institutionId: institutionId,
       ...params,
      });
      if (error) throw error;
      return data;
    },

  },
});
