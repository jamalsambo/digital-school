import List from '../pages/List.vue';
import Create from '../pages/Create.vue';

const periodsRoutes = [
   { path: 'periods', name: 'periods', component: List },
   { path: 'period/create', name: 'create-period', component: Create },
   { path: 'periods/:periodId/edit', name: 'edit-period', component: Create },
];

export default periodsRoutes;
