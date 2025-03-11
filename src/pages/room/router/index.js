import List from '../pages/List.vue';
import Create from '../pages/Create.vue';

const roomRoutes = [
   { path: 'rooms', name: 'rooms', component: List },
   { path: 'room/create', name: 'create-room', component: Create },
   { path: 'room/:roomId/edit', name: 'edit-room', component: Create },
];

export default roomRoutes;
