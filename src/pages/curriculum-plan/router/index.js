import List from '../pages/List.vue';
import Create from '../pages/Create.vue';
import Settings from '../pages/Settings.vue';

const curriculumRoutes = [
  { path: 'education/:educationId/curriculums', name: 'curriculums', component: List },
  { path: 'education/:educationId/course/:courseId/curriculum/create', name: 'create-curriculum', component: Create },
  { path: 'education/:educationId/curriculum/:curriculumId/edit', name: 'edit-curriculum', component: Create },
  { path: 'education/:educationId/curriculum/:curriculumId/settings', name: 'settings-curriculum', component: Settings }
];

export default curriculumRoutes;
