import List from '../pages/List.vue';
import Create from '../pages/Create.vue';


const enrollmentRoutes = [
   { path: 'education/:educationId/enrollments', name: 'enrollments', component: List },
   { path: 'student/create/:studentId/enrollment/create', name: 'create-enrollment', component: Create },
];

export default enrollmentRoutes;
