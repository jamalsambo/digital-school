import List from "../pages/List.vue";
import Teste from "../pages/teste.vue";
import View from "../pages/View.vue";

const receiptsRoutes = [
   { path: 'finance/institution/:institutionId/receipts', name: 'receipts', component: List},
   { path: 'receipt/:receiptId/print', name: 'print-receipt', component: View},
   { path: 'receipt/print', name: 'teste', component: Teste}

];

export default receiptsRoutes;
