import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

export const usePaymentStores = defineStore("payment", {
  state: () => ({
    payments: [],
    payment: {},
    paymentTypes: [],
    value: {},
    paymentType: {},
    penaltyRules: {},
    invoice: {},
    invoiceItens: {},
    items: [],
    invoices: [],
  }),
  getters: {
    paymentMonthFeeStudent: (state) => state.value,
  },
  actions: {
    async findAll(params) {
      const { data, error } = await api.get("/payment", params);
      if (error) throw error;
      this.payments = data;
    },
    async create(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user.userDetails;
      const { data, error } = await api.post("/payment", {
        ...params,
        institutionId: institutionId,
      });
      if (error) throw error;
      this.payment = data;
    },
    async update(id, params) {
      const { data, error } = await api.put(`/payment/${id}`, params);
      if (error) throw error;
      this.payment = data;
    },

    /* sessao tipos de pagamentos */
    async findPaymentTypes() {
      const { data, error } = await api.get("/payment-type");
      if (error) throw error;
      this.paymentTypes = data;
    },

    async createPaymentType(params) {
      const { data, error } = await api.post("/payment-type", params);
      if (error) throw error;
      this.paymentType = data;
    },
    async createPenaltyRules(params) {
      const { data, error } = await api.post("/penalty-rule", params);
      if (error) throw error;
      this.penaltyRules = data;
    },

    async updatePenaltyRules(id, params) {
      const { data, error } = await api.put(`/penalty-rule/${id}`, params);
      if (error) throw error;
      return data;
    },

    async updateInvoicePenalts(id, params) {
      const { data, error } = await api.put(`/penalty/update-invoice-penalties/${id}`, params);
      if (error) throw error;
      return data;
    },

    /* Secção de facturas */
    async createInvoice(params) {
      const { data, error } = await api.post("/invoice", params);
      if (error) throw error;
      this.invoice = data;
    },

    async createInvoiceItems(params) {
      const { data, error } = await api.post("/invoice/item/create", params);
      if (error) throw error;
      return data;
    },

    async findInvoiceById(id) {
      const { data, error } = await api.get(`/invoice/${id}`);
      if (error) throw error;
      this.invoiceItens = data;
    },

    async findInvoiceItems(params) {
      const { data, error } = await api.get(`/invoice/item`, {
        params: params,
      });
      if (error) throw error;
      this.items = data;
    },
  },
});
