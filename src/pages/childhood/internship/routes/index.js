import List from '../pages/List.vue';
import Create from '../pages/Create.vue';
import Settings from '../pages/Settings.vue';

const internshipRoutes = [
  { path: 'education/:id/internships', name: 'list-internships', component: List },
  { path: 'education/:id/internship/create', name: 'create-internships', component: Create },
  { path: 'education/:id/internship/edit/:internshipId', name: 'edit-internships', component: Create },
  { path: 'education/:educationId/internship/:internshipId/settings', name: 'settings-internship', component: Settings }
];

export default internshipRoutes;
