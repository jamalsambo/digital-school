import List from '../pages/List.vue';
import Create from '../pages/Create.vue';

const activitiesRoutes = [
  { path: 'education/:educationId/activities', name: 'list-activities', component: List },
  { path: 'education/:educationId/activity/create', name: 'create-activities', component: Create },
  { path: 'education/:educationId/activity/edit/:activityId', name: 'edit-activities', component: Create },

];

export default activitiesRoutes;
