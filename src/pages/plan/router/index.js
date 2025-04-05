import Create from '../pages/Create.vue';
import List from '../pages/List.vue';

const planRoutes = [
   { path: 'plans', name: 'plans', component: List },
   { path: 'plan/create', name: 'create-plan', component: Create },
   { path: 'plan/:planId/edit', name: 'edit-plan', component: Create },
];

export default planRoutes;
