import Settings from '../pages/PaymentSettings.vue'

const paymentsRoutes = [
   { path: '/finance/institution/:institutionId/payment-types', name: 'payment-types', component: Settings },
];

export default paymentsRoutes;
