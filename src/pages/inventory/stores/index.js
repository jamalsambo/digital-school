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

    async update(id, params) {
      const { data, error } = await api.put(`/invoice/${id}`, params);
      if (error) throw error;
      this.invoice = data;
    },

    async createItems(params) {
      const { data, error } = await api.post("/invoice/item-create", params);
      if (error) throw error;
      return data;
    },

    async findOne(id) {
      const { data, error } = await api.get(`/invoice/${id}`);
      if (error) throw error;
      this.invoiceItens = data;
    },
  },
});
