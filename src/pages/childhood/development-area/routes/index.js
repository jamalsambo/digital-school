import List from '../pages/List.vue';
import Create from '../pages/Create.vue';
import AddActivities from '../pages/AddActivities.vue';
const developmentAreaRoutes = [
  { path: 'development-area/', name: 'list-development-area', component: List },
  { path: 'internship/:internshipId/development-area/:developmentId/activities', name: 'activities-development-area', component: AddActivities },
  { path: 'internship/:internshipId/development-area/create', name: 'create-development-area', component: Create },
  { path: 'development-area/:developmentAreaId/edit', name: 'edit-development-area', component: Create }

];

export default developmentAreaRoutes;
