import List from '../pages/List.vue';
import Create from '../pages/Create.vue';
import Teachings from '../pages/Teachings.vue';


const employeeRoutes = [
   { path: 'employees', name: 'list-employees', component: List },
   { path: 'employee/:created/:id', name: 'create-employee', component: Create },
   { path: 'employee/:id/teachings', name: 'employee-teachings', component: Teachings }
];

export default employeeRoutes;
