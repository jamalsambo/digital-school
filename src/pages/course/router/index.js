import List from '../pages/List.vue';
import Create from '../pages/Create.vue';
import Settings from '../pages/Settings.vue'
import EvolutionType from '../pages/EvolutionType.vue';


const courseRoutes = [
   { path: 'education/:educationId/:program', name: 'list-program', component: List },
   { path: 'education/:educationId/:program/create', name: 'create-program', component: Create },
   { path: 'education/:educationId/:program/edit/:courseId', name: 'edit-program', component: Create },
   { path: 'education/:educationId/:program/:internshipId/settings', name: 'settings-program', component: Settings },
   { path: 'course/:courseId/evolution-type/create', name: 'course-evolution-type-create', component: EvolutionType, meta: {title: 'Create Evolution Type'} }

];

export default courseRoutes;
