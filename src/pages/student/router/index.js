import Payments from "../pages/Payments.vue";
import Report from "../pages/Report.vue";

const studentRoutes = [
   { path: 'student/reports', name: 'student-reports', component: Report },
   { path: 'student/:studentId/payments', name: 'student-payments', component: Payments,  meta: {title: "Student Payments"}}
];

export default studentRoutes;
