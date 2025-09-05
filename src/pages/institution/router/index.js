import List from '../pages/List.vue';
import Create from '../pages/Create.vue';
import Settings from '../pages/Settings.vue'


const institutionRoutes = [
   { path: 'institutions', name: 'list-institutions', component: List },
   { path: 'institution/create', name: 'create-institution', component: Create },
   { path: 'institution/:institutionId/edit', name: 'edit-institution', component: Create },
   { path: 'institution/:institutionId/settings', name: 'settings-institution', component: Settings },
   {
    path: "/institution/create/:parent/branch",
    name: "create-branch",
    component: () => import("pages/institution/pages/Create.vue"),
  },
  {
    path: "/cycles",
    name: "cycles",
    component: () => import("src/pages/institution/pages/cycle/List.vue"),
    meta: { title: 'Cycles'}
  },
   {
    path: "/cycle/create",
    name: "cycle-create",
    component: () => import("src/pages/institution/pages/cycle/Create.vue"),
    meta: { title: 'Cycles Create'}
  },
];

export default institutionRoutes;
