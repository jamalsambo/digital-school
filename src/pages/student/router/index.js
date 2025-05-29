import Payments from "../pages/Payments.vue";
import Report from "../pages/Report.vue";
import Task from "../pages/Task.vue";

const studentRoutes = [
   { path: 'student/reports', name: 'student-reports', component: Report },
   { path: 'student/:studentId/payments', name: 'student-payments', component: Payments,  meta: {title: "Student Payments"}},
   { path: 'student/:studentId/my-tasks', name: 'my-tasks', component: Task,  meta: {title: "My Tasks"}},


];

export default studentRoutes;
