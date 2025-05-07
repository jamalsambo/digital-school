import List from "../pages/List.vue";
import View from "../pages/View.vue";

const bulletinRoutes = [
  {
    path: "academic-control",
    name: "academic control",
    component: List,
  },
  {
    path: "bulletin/student/:studentId/classe/:classId/issue",
    name: "bulletin-issue",
    component: View,
  }
];

export default bulletinRoutes;
