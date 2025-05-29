import List from '../pages/List.vue';
import Create from '../pages/Create.vue';

const developmentAreaRoutes = [
  { path: 'development-area/', name: 'list-development-area', component: List },
  { path: 'education/:educationId/curriculum/:curriculumId/d-area/create', name: 'create-development-area', component: Create },
  { path: 'd-area/:developmentAreaId/edit', name: 'edit-development-area', component: Create }

];

export default developmentAreaRoutes;
