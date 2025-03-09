import List from '../pages/List.vue';
import Create from '../pages/Create.vue';


const disciplineRoutes = [
  { path: 'education/:educationId/module/:module', name: 'list-module', component: List },
  { path: 'education/:educationId/module/:module/create', name: 'create-module', component: Create },
  { path: 'education/:educationId/module/:module/:moduleId/edit', name: 'edit-module', component: Create }
];

export default disciplineRoutes;
