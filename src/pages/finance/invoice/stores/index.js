import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

export const useInvoiceStores = defineStore("invoice", {
  state: () => ({
    invoice: {},
    invoiceItens: {},
    items: [],
    invoices: [],
  }),
  getters: {},
  actions: {
    /* Secção de facturas */

    async find(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.get(`/invoice/${institutionId}`, {params: params});
      if (error) throw error;
      this.invoices = data;
    },

    async create(params) {
      const authStore = useAuthStore();
      const { id, institutionId } = authStore.user;
      const { data, error } = await api.post("/invoice", {
        ...params,
        institutionId: institutionId,
        employeeId: id,
      });
      if (error) throw error;
      this.invoice = data;
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

    async findtems(params) {
      const { data, error } = await api.get(`/invoice/item`, {
        params: params,
      });
      if (error) throw error;
      this.items = data;
    },
  },
});
