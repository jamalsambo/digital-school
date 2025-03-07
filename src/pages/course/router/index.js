import List from '../pages/List.vue';
import Create from '../pages/Create.vue';
import Settings from '../pages/Settings.vue'


const courseRoutes = [
   { path: 'education/:educationId/:program', name: 'list-program', component: List },
   { path: 'education/:educationId/:program/create', name: 'create-program', component: Create },
   { path: 'education/:educationId/:program/edit/:courseId', name: 'edit-program', component: Create },
   { path: 'education/:educationId/:program/:internshipId/settings', name: 'settings-program', component: Settings }
];

export default courseRoutes;
