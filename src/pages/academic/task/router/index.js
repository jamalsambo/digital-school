const taskRoutes = [
  /* Rotas de Tarefas*/
  {
    path: "class/:classeId/discipline/:disciplineId/tasks",
    name: "tasks",
    component: () => import("src/pages/academic/task/pages/List.vue"),
    meta: {title: 'Tasks class'}
  },
  {
    path: "class/:classeId/discipline/:disciplineId/task/create",
    name: "task-create",
    component: () => import("src/pages/academic/task/pages/New.vue"),
    meta: {title: 'Task create'}
  },
  {
    path: "/task/edit/:id",
    name: "task-edit",
    component: () => import("src/pages/academic/task/pages/New.vue"),
    meta: {title: 'Task edit'}
  },
  {
    path: "/task/:id/:entity/add",
    name: "task-add-groups",
    component: () => import("src/pages/academic/task/pages/AddToGroup.vue"),
    meta: {title: 'Task Add Group'}
  },
  {
    path: "/task/:id/:entity/add",
    name: "task-add-students",
    component: () => import("src/pages/academic/task/pages/AddToGroup.vue"),
    meta: {title: 'Task Add Student'}
  },
];

export default taskRoutes;
