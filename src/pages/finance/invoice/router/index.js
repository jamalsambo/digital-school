import List from "../pages/List.vue";

const invoiceRoutes = [
   { path: 'finance/institution/:institutionId/invoices', name: 'invoices', component: List}
];

export default invoiceRoutes;
