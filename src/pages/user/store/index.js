import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useUserStores = defineStore("user", {
  state: () => ({
    user: {
      permissionsItems:[]
    },
    users: [],
  }),
  getters: {
    hasViewStudents: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_students"),
    hasCreateStudents: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_students"),
    hasCreateEnrrolment: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_enrollment"),
    hasCreateDisciplines: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_disciplines"),
    hasCreateCurriculum: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_curriculum"),
    hasCreateClasse: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_classe"),

    hasViewEmployees: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_employees"),
    hasCreateEmployees: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_employees"),

    hasViewInstitution: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_institution"),
    hasEditInstitution: (state) =>  state.user?.permissionsItems.some((p) => p.key === "edit_institution"),
    hasSettingsSiteInstitution: (state) =>  state.user?.permissionsItems.some((p) => p.key === "settigs_site_institution"),

    hasViewRooms: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_rooms"),
    hasCreateRooms: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_rooms"),
    hasEditRooms: (state) =>  state.user?.permissionsItems.some((p) => p.key === "edit_rooms"),

    hasViewHoraryInstitution: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_horary_institution"),
    hasCreateHoraryInstitution: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_horary_institution"),
    hasEditHoraryInstitution: (state) =>  state.user?.permissionsItems.some((p) => p.key === "edit_horary_institution"),

    hasViewHoraryFixes: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_horary_fixes"),
    hasCreateHoraryFixes: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_horary_fixes"),

    hasViewActivityFixes: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_activity_fixes"),
    hasCreateActivityFixes: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_activity_fixes"),
    hasEditActivityFixes: (state) =>  state.user?.permissionsItems.some((p) => p.key === "edit_activity_fixes"),


    hasViewCalendar: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_calendar_academic"),
    hasCreateCalendar: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_calendar_academic"),
    hasViewEvolutionTypes: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_evolution_types"),
    hasCreateEvolutionTypes: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_evolution_types"),
    hasEditEvolutionTypes: (state) =>  state.user?.permissionsItems.some((p) => p.key === "edit_evolution_types"),

    hasViewInvoices: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_invoices"),
    hasCreateInvoices: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_invoices"),

    hasViewReceipts: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_receipts"),
    hasCreateReceipts: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_receipts"),

    hasViewPaymentsExtras: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_payments_extra"),
    hasCreatePaymentExtras: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_payments_extra"),
    hasEditPaymentExtras: (state) =>  state.user?.permissionsItems.some((p) => p.key === "edit_payments_extra"),

    hasViewNotifications: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_notifications"),
    hasCreateNotifications: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_notifications"),
    hasEditNotifications: (state) =>  state.user?.permissionsItems.some((p) => p.key === "edit_notifications"),

    hasViewBulletins: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_bulletins"),
    hasIssueBulletins: (state) =>  state.user?.permissionsItems.some((p) => p.key === "issue_bulletins"),

    hasViewPaymentsTypes: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_payment_types"),
    hasCreatePaymentsTypes: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_payment_types"),
    hasEditPaymentsTypes: (state) =>  state.user?.permissionsItems.some((p) => p.key === "edit_payment_types"),

    hasViewExpensesCategories: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_expenses_categories"),
    hasCreateExpensesCategories: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_expenses_categories"),
    hasEditExpensesCategories: (state) =>  state.user?.permissionsItems.some((p) => p.key === "edit_expenses_categories"),

    hasViewExpenses: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_expenses"),
    hasCreateExpenses: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_expenses"),
    hasEditExpenses: (state) =>  state.user?.permissionsItems.some((p) => p.key === "edit_expenses"),
    hasDeleteExpenses: (state) =>  state.user?.permissionsItems.some((p) => p.key === "delete_expenses"),

    hasViewGlobalPayments: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_global_payments"),
    hasViewPaymentsYear: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_payments_year"),
    hasViewExpensesYear: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_expenses_year"),
    hasViewPaymentsDay: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_payments_day"),
    hasViewPaymentsMonth: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_payments_month"),
    hasViewExpensesDay: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_expenses_day"),
    hasViewExpensesMonth: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_expenses_month"),
    hasViewPaymentsLate: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_payment_late"),
    hasViewExpensesLate: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_expenses_late"),

  },
  actions: {
    async findAll() {
      const { data, error } = await api.get("/user");
      if (error) throw error;
      this.users = data;
    },
    async findOne(id) {
      const { data, error } = await api.get(`/user/${id}`);
      if (error) throw error;
      this.user = data;
    },
    async create(params) {
      const { data, error } = await api.post("/user", {
        ...params,
      });
      if (error) throw error;
      this.user = data;
    },
    async update(id, params) {
      const { data, error } = await api.put(`/user/${id}`, params);
      if (error) throw error;
      this.user = data;
    },
    async addPermissions(id, params) {
      const { data, error } = await api.post(`/user/${id}/permissions`, params);
      if (error) throw error;
      this.user = data;
    },
    async removePermissions(id, permissionItenId) {
      const { data, error } = await api.delete(
        `/user/${id}/permissions/${permissionItenId}`
      );
      if (error) throw error;
      return data;
    },
  },
});
