import List from "../pages/List.vue";
import Create from "../pages/Create.vue";
import Schedule from "../pages/Schedule.vue";

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
    {
    path: "class/:classId/schedule",
    name: "class-schedule",
    meta: { title: "Class Schedule"},
    component: Schedule,
  },
];

export default classeRoutes;
