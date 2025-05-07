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
    isEmployee: (state) =>  state.user.userType?.name === 'Funcionario',
    isTeacher:  (state) =>  state.user.teacher === 'Sim',
    isStudent: (state) =>  state.user.userType?.name ===  'Estudante',
    isGuardian: (state) =>  state.user.userType?.name ===  'Encarregado',
    isSuper: (state) =>  state.user.userType?.name ===  'Super',


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
    /* Tipos de paqgementos */
    hasViewPaymentsTypes: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_payment_types"),
    hasCreatePaymentsTypes: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_payment_types"),
    hasEditPaymentsTypes: (state) =>  state.user?.permissionsItems.some((p) => p.key === "edit_payment_types"),
    /* Financas */
    hasViewExpensesCategories: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_expenses_categories"),
    hasCreateExpensesCategories: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_expenses_categories"),
    hasEditExpensesCategories: (state) =>  state.user?.permissionsItems.some((p) => p.key === "edit_expenses_categories"),
    hasViewExpenses: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_expenses"),
    hasCreateExpenses: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_expenses"),
    hasEditExpenses: (state) =>  state.user?.permissionsItems.some((p) => p.key === "edit_expenses"),
    hasDeleteExpenses: (state) =>  state.user?.permissionsItems.some((p) => p.key === "delete_expenses"),
    /* Tela principal */
    hasViewGlobalPayments: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_global_payments"),
    hasViewPaymentsYear: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_payments_year"),
    hasViewExpensesYear: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_expenses_year"),
    hasViewPaymentsDay: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_payments_day"),
    hasViewPaymentsMonth: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_payments_month"),
    hasViewExpensesDay: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_expenses_day"),
    hasViewExpensesMonth: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_expenses_month"),
    hasViewPaymentsLate: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_payment_late"),
    hasViewExpensesLate: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_expenses_late"),
    /* Lancamento de notas */
    hasPostEvolutionGrade: (state) =>  state.user?.permissionsItems.some((p) => p.key === "post_evaluation_grade"),
    hasEditEvolutionGrade: (state) =>  state.user?.permissionsItems.some((p) => p.key === "edit_evaluation_grade"),
    hasDeleteEvolutionGrade: (state) =>  state.user?.permissionsItems.some((p) => p.key === "delete_evaluation_grade"),
    hasViewEvolutionGrade: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_evaluation_grade"),
    /* Stokc */
    hasMoveStock: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_moviments_stock"),
    hasCreateInStock: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_in_stock"),
    hasCreateOutStock: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_out_stock"),
    hasViewProductStock: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_produts_stock"),
    hasCreateProductStock: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_produts_stock"),
    hasEditProductStock: (state) =>  state.user?.permissionsItems.some((p) => p.key === "edit_produts_stock"),
    hasDeleteProductStock: (state) =>  state.user?.permissionsItems.some((p) => p.key === "delete_produts_stock"),
    hasViewCategoryStock: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_category_stock"),
    hasCreateCategoryStock: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_category_stock"),
    hasEditCategoryStock: (state) =>  state.user?.permissionsItems.some((p) => p.key === "edit_category_stock"),
    hasDeleteCategoryStock: (state) =>  state.user?.permissionsItems.some((p) => p.key === "delete_category_stock"),
    hasViewSuplierStock: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_supliers_stock"),
    hasCreateSuplierStock: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_supliers_stock"),
    hasEditSuplierStock: (state) =>  state.user?.permissionsItems.some((p) => p.key === "edit_supliers_stock"),
    hasDeleteSuplierStock: (state) =>  state.user?.permissionsItems.some((p) => p.key === "delete_supliers_stock"),
    /* Patrimonio */
    hasMoveAsset: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_moviments_assets"),
    hasCreateMoveAsset: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_move_assets"),
    hasViewAsset: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_assets"),
    hasCreateAsset: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_assets"),
    hasEditAsset: (state) =>  state.user?.permissionsItems.some((p) => p.key === "edit_assets"),
    hasDeleteAsset: (state) =>  state.user?.permissionsItems.some((p) => p.key === "delete_assets"),
    hasViewCategoryAsset: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_category_assets"),
    hasCreaCategoryeAsset: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_category_assets"),
    hasEditCategoryAsset: (state) =>  state.user?.permissionsItems.some((p) => p.key === "edit_category_assets"),
    hasDeleCategoryAsset: (state) =>  state.user?.permissionsItems.some((p) => p.key === "delete_category_assets"),
    hasViewLocationAsset: (state) =>  state.user?.permissionsItems.some((p) => p.key === "view_location_assets"),
    hasCreaLocationeAsset: (state) =>  state.user?.permissionsItems.some((p) => p.key === "create_location_assets"),
    hasEditLocationAsset: (state) =>  state.user?.permissionsItems.some((p) => p.key === "edit_location_assets"),
    hasDeleLocationAsset: (state) =>  state.user?.permissionsItems.some((p) => p.key === "delete_location_assets"),

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
