import Settings from '../pages/PaymentSettings.vue'
import Enrollment from '../pages/PaymentEnrollment.vue'


const paymentsRoutes = [
   { path: 'institution/:institutionId/education/:educationId/payment/settings', name: 'settings-payment', component: Settings },
   { path: 'student/:studentId/enrollment/:enrollmentId/payment', name: 'enrollment-payment', component: Enrollment},
];

export default paymentsRoutes;
