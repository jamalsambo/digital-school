import List from '../pages/List.vue';
import Create from '../pages/Create.vue';


const enrollmentRoutes = [
   { path: 'education/:educationId/enrollments', name: 'enrollments', component: List },
   { path: 'education/:educationId/enrollment/create', name: 'create-enrollment', component: Create },
   { path: 'education/:educationId/enrollment/:enrollmentId/student/:studentd', name: 'create-enrollment-to-student', component: Create },

   { path: 'education/:educationId/:program/edit/:courseId', name: 'edit-program', component: Create },
];

export default enrollmentRoutes;
