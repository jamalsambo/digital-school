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
    isTeacher:  (state) =>  state.user.employee?.teacher === 'Sim',
    isStudent: (state) =>  state.user.userType?.name ===  'Estudante',
    isGuardian: (state) =>  state.user.userType?.name ===  'Encarregado',
    isSuper: (state) =>  state.user.userType?.name ===  'Super',


    hasViewStudents: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_students"),
    hasCreateStudents: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_students"),
    hasCreateEnrrolment: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_enrollment"),
    hasCreateDisciplines: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_disciplines"),
    hasCreateCurriculum: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_curriculum"),
    hasCreateClasse: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_classe"),

    hasViewEmployees: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_employees"),
    hasCreateEmployees: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_employees"),

    hasViewInstitution: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_institution"),
    hasEditInstitution: (state) =>  state.permissionsItems.some((p) => p.permission.key === "edit_institution"),
    hasSettingsSiteInstitution: (state) =>  state.user?.permissionsItems.some((p) => p.permission.key === "settigs_site_institution"),

    hasViewRooms: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_rooms"),
    hasCreateRooms: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_rooms"),
    hasEditRooms: (state) =>  state.permissionsItems.some((p) => p.permission.key === "edit_rooms"),

    hasViewHoraryInstitution: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_horary_institution"),
    hasCreateHoraryInstitution: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_horary_institution"),
    hasEditHoraryInstitution: (state) =>  state.permissionsItems.some((p) => p.permission.key === "edit_horary_institution"),

    hasViewHoraryFixes: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_horary_fixes"),
    hasCreateHoraryFixes: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_horary_fixes"),

    hasViewActivityFixes: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_activity_fixes"),
    hasCreateActivityFixes: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_activity_fixes"),
    hasEditActivityFixes: (state) =>  state.permissionsItems.some((p) => p.permission.key === "edit_activity_fixes"),


    hasViewCalendar: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_calendar_academic"),
    hasCreateCalendar: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_calendar_academic"),
    hasViewEvolutionTypes: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_evolution_types"),
    hasCreateEvolutionTypes: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_evolution_types"),
    hasEditEvolutionTypes: (state) =>  state.permissionsItems.some((p) => p.permission.key === "edit_evolution_types"),

    hasViewInvoices: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_invoices"),
    hasCreateInvoices: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_invoices"),

    hasViewReceipts: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_receipts"),
    hasCreateReceipts: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_receipts"),

    hasViewPaymentsExtras: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_payments_extra"),
    hasCreatePaymentExtras: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_payments_extra"),
    hasEditPaymentExtras: (state) =>  state.permissionsItems.some((p) => p.permission.key === "edit_payments_extra"),

    hasViewNotifications: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_notifications"),
    hasCreateNotifications: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_notifications"),
    hasEditNotifications: (state) =>  state.permissionsItems.some((p) => p.permission.key === "edit_notifications"),

    hasViewBulletins: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_bulletins"),
    hasIssueBulletins: (state) =>  state.permissionsItems.some((p) => p.permission.key === "issue_bulletins"),
    /* Tipos de paqgementos */
    hasViewPaymentsTypes: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_payment_types"),
    hasCreatePaymentsTypes: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_payment_types"),
    hasEditPaymentsTypes: (state) =>  state.permissionsItems.some((p) => p.permission.key === "edit_payment_types"),
    /* Financas */
    hasViewExpensesCategories: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_expenses_categories"),
    hasCreateExpensesCategories: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_expenses_categories"),
    hasEditExpensesCategories: (state) =>  state.user?.permissionsItems.some((p) => p.permission.key === "edit_expenses_categories"),
    hasViewExpenses: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_expenses"),
    hasCreateExpenses: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_expenses"),
    hasEditExpenses: (state) =>  state.permissionsItems.some((p) => p.permission.key === "edit_expenses"),
    hasDeleteExpenses: (state) =>  state.permissionsItems.some((p) => p.permission.key === "delete_expenses"),
    /* Tela principal */
    hasViewGlobalPayments: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_global_payments"),
    hasViewPaymentsYear: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_payments_year"),
    hasViewExpensesYear: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_expenses_year"),
    hasViewPaymentsDay: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_payments_day"),
    hasViewPaymentsMonth: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_payments_month"),
    hasViewExpensesDay: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_expenses_day"),
    hasViewExpensesMonth: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_expenses_month"),
    hasViewPaymentsLate: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_payment_late"),
    hasViewExpensesLate: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_expenses_late"),
    /* Lancamento de notas */
    hasPostEvolutionGrade: (state) =>  state.permissionsItems.some((p) => p.permission.key === "post_evaluation_grade"),
    hasEditEvolutionGrade: (state) =>  state.permissionsItems.some((p) => p.permission.key === "edit_evaluation_grade"),
    hasDeleteEvolutionGrade: (state) =>  state.permissionsItems.some((p) => p.permission.key === "delete_evaluation_grade"),
    hasViewEvolutionGrade: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_evaluation_grade"),
    /* Stokc */
    hasMoveStock: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_moviments_stock"),
    hasCreateInStock: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_in_stock"),
    hasCreateOutStock: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_out_stock"),
    hasViewProductStock: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_produts_stock"),
    hasCreateProductStock: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_produts_stock"),
    hasEditProductStock: (state) =>  state.permissionsItems.some((p) => p.permission.key === "edit_produts_stock"),
    hasDeleteProductStock: (state) =>  state.permissionsItems.some((p) => p.permission.key === "delete_produts_stock"),
    hasViewCategoryStock: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_category_stock"),
    hasCreateCategoryStock: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_category_stock"),
    hasEditCategoryStock: (state) =>  state.permissionsItems.some((p) => p.permission.key === "edit_category_stock"),
    hasDeleteCategoryStock: (state) =>  state.permissionsItems.some((p) => p.permission.key === "delete_category_stock"),
    hasViewSuplierStock: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_supliers_stock"),
    hasCreateSuplierStock: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_supliers_stock"),
    hasEditSuplierStock: (state) =>  state.permissionsItems.some((p) => p.permission.key === "edit_supliers_stock"),
    hasDeleteSuplierStock: (state) =>  state.permissionsItems.some((p) => p.permission.key === "delete_supliers_stock"),
    /* Patrimonio */
    hasMoveAsset: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_moviments_assets"),
    hasCreateMoveAsset: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_move_assets"),
    hasViewAsset: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_assets"),
    hasCreateAsset: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_assets"),
    hasEditAsset: (state) =>  state.permissionsItems.some((p) => p.permission.key === "edit_assets"),
    hasDeleteAsset: (state) =>  state.permissionsItems.some((p) => p.permission.key === "delete_assets"),
    hasViewCategoryAsset: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_category_assets"),
    hasCreaCategoryeAsset: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_category_assets"),
    hasEditCategoryAsset: (state) =>  state.permissionsItems.some((p) => p.permission.key === "edit_category_assets"),
    hasDeleCategoryAsset: (state) =>  state.permissionsItems.some((p) => p.permission.key === "delete_category_assets"),
    hasViewLocationAsset: (state) =>  state.permissionsItems.some((p) => p.permission.key === "view_location_assets"),
    hasCreaLocationeAsset: (state) =>  state.permissionsItems.some((p) => p.permission.key === "create_location_assets"),
    hasEditLocationAsset: (state) =>  state.permissionsItems.some((p) => p.permission.key === "edit_location_assets"),
    hasDeleLocationAsset: (state) =>  state.permissionsItems.some((p) => p.permission.key === "delete_location_assets"),

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
      return data;
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
    async findPermissions(userId){
      const { data, error } = await api.get(`/user/${userId}/permissions`);
      if (error) throw error;
      this.permissionsItems = data;
    }
  },
});
