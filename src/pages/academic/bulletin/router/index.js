import List from "../pages/List.vue";
import View from "../pages/View.vue";

const bulletinRoutes = [
  {
    path: "bulletins",
    name: "bulletins",
    component: List,
  },
  {
    path: "bulletin/student/:studentId/classe/:classId/issue",
    name: "bulletin-issue",
    component: View,
  }
];

export default bulletinRoutes;
