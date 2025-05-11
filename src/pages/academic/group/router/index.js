
const groupRoutes = [
  {
    path: "classe/:classe/discipline/:disciplineId/groups",
    name: "groups",
    component: () => import("src/pages/academic/group/pages/List.vue"),
    meta: {title: 'Work groups'}
  },
  { path: "classe/:classeId/group/:groupId/team-leader",
    name: "group-team-leader",
    component: () => import("src/pages/academic/group/pages/Edit.vue"),
    meta: {title: 'Group Team Leader'}
  },
  {
    path: "/groups/members/distribution",
    name: "group-distribution",
    component: () => import("src/pages/academic/group/pages/Distribution.vue"),
    meta: {title: 'Group distribution'}
  },
];

export default groupRoutes;

