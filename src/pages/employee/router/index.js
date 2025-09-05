import List from "../pages/List.vue";
import Create from "../pages/Create.vue";
import AddTeachings from "../pages/Teachings-Add.vue";
import Teachings from "../pages/Teachings.vue";

const employeeRoutes = [
  {
    path: "employees",
    name: "list-employees",
    component: List,
    meta: { title: "Employees" },
  },
  {
    path: "institution/:institutionId/employees",
    name: "institution-employees",
    component: List,
    meta: { title: "Institution Employees" },
  },
  { path: "employee/:created/:id", name: "create-employee", component: Create },
  {
    path: "employee/:id/teachings",
    name: "employee-teachings",
    component: Teachings,
  },
  {
    path: "employee/:id/classes",
    name: "employee-classes",
    component: Teachings,
    meta: { title: "Employee classes" },
  },
  {
    path: "class/:id/teachings/add",
    name: "employee-teachings-add",
    component: AddTeachings,
  },

];

export default employeeRoutes;
