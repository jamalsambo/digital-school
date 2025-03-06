import Create from '../pages/Create.vue';

const childhoodClasseRoutes = [
  { path: 'internship/:internshipId/classe/create', name: 'create-classe', component: Create },
  { path: 'classe/:classId/edit/', name: 'edit-classe', component: Create },

];

export default childhoodClasseRoutes;
