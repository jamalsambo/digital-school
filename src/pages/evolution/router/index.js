import Create from '../pages/Create.vue';
import Types from '../pages/Types.vue';

const evolutionsRoutes = [
   /* Rotas de Evolução */
   {
    path: "/evolution/class/:classe/discipline/:discipline/:student?/:studentId?/:cicle?/:cicle?/:year?/:year?/:participation",
    name: "evolution-create",
    component: Create,
  },
  {
    path: "/evolution/types",
    name: "evolution-types",
    component: Types,
  },

];

export default evolutionsRoutes;
