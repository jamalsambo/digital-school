import List from '../pages/List.vue';
import Create from '../pages/Create.vue';
import AddTeachings from '../pages/Teachings-Add.vue';
import Teachings from '../pages/Teachings.vue';


const employeeRoutes = [
   { path: 'employees', name: 'list-employees', component: List },
   { path: 'employee/:created/:id', name: 'create-employee', component: Create },
   { path: 'employee/:id/teachings', name: 'employee-teachings', component: Teachings },
   { path: 'class/:id/teachings/add', name: 'employee-teachings-add', component: AddTeachings },

];

export default employeeRoutes;
