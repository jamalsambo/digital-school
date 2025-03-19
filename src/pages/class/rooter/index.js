import List from "../pages/List.vue";
import Create from "../pages/Create.vue";

const classeRoutes = [
  {
    path: "education/:educationId/:program/:internshipId/classe/create",
    name: "create-classe",
    component: Create,
  },
  {
    path: "education/:educationId/:program/:internshipId/classe/:classeId/edit",
    name: "edit-classe",
    component: Create,
  },
];

export default classeRoutes;
