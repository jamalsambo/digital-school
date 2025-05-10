
const groupRoutes = [
  {
    path: "classe/:classe/discipline/:disciplineId/groups",
    name: "groups",
    component: () => import("src/pages/academic/group/pages/List.vue"),
    meta: {title: 'Work groups'}
  },
  { path: "group/:groupId/members",
    name: "group-member",
    component: () => import("src/pages/academic/group/pages/Member.vue"),
    meta: {title: 'Group members'}
  },
  {
    path: "/groups/members/distribution",
    name: "group-distribution",
    component: () => import("src/pages/academic/group/pages/Distribution.vue"),
    meta: {title: 'Group distribution'}
  },
];

export default groupRoutes;

