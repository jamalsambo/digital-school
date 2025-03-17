import List from '../pages/List.vue';
import Create from '../pages/Create.vue';
import ListActivityFixes from '../pages/ListActivitiesFixes.vue';
import CreateActivitiesFixes from '../pages/CreateActivitiesFixes.vue';
import ListScheduleFixes from '../pages/ListScheduleFixes.vue';

const periodsRoutes = [
   { path: 'periods', name: 'periods', component: List },
   { path: 'period/create', name: 'create-period', component: Create },
   { path: 'periods/:periodId/edit', name: 'edit-period', component: Create },
   { path: 'periods/fixes', name: 'periods-fixe', component: ListScheduleFixes },

   { path: 'periods/fixe/activity', name: 'activity-fixe', component: ListActivityFixes },
   { path: 'periods/fixe/activity/create', name: 'activity-fixe-create', component: CreateActivitiesFixes },

];

export default periodsRoutes;
