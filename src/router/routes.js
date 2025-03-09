import authGuard from "./authGuard";
import {
  courseRoutes,
  institutionRoutes,
  employeeRoutes,
  disciplineRoutes,
  curriculumRoutes,
  developmentAreaRoutes,
} from "./pageRoutes";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    beforeEnter: authGuard,
    children: [
      {
        path: "",
        name: "home",
        component: () => import("pages/Dashboard.vue"),
      },

      /* Rotas de Turma */
      { path: "/class", component: () => import("pages/class/pages/List.vue") },
      {
        path: "/class/create",
        name: "class-create",
        component: () => import("pages/class/pages/Create.vue"),
      },

      /* Rotas do Estudante */
      {
        path: "/students",
        name: "students",
        component: () => import("pages/student/pages/List.vue"),
      },
      {
        path: "/student/:created/:id",
        name: "student-space",
        component: () => import("pages/student/pages/Create.vue"),
      },
      {
        path: "/student/:id/evolutions/:type",
        name: "student-evolution",
        component: () => import("pages/student/pages/Evolutions.vue"),
      },
      {
        path: "/student/:id/enrollments",
        name: "student-enrollments",
        component: () => import("pages/student/pages/Enrollments.vue"),
      },
      {
        path: "/student/:id/payments/:view",
        name: "student-payments",
        component: () =>
          import("pages/financial/payments/pages/PaymentCreate.vue"),
      },

      /* Rotas do funcionario */

      {
        path: "/class/:id/teachings/add",
        name: "class-teachings-add",
        component: () => import("pages/employee/pages/Teachings-Add.vue"),
      },

      {
        path: "/education/:educationId/schedule/class/:classId/",
        name: "schedule-class",
        component: () => import("pages/schedule/pages/Create.vue"),
      },

      /* Rotas de Evolução */
      {
        path: "/evolution/class/:classe/discipline/:discipline",
        name: "evolution-create",
        component: () => import("pages/evolution/pages/Create.vue"),
      },
      {
        path: "/evolution/types",
        name: "evolution-types",
        component: () => import("pages/evolution/pages/Types.vue"),
      },

      /* Rotas de Pagamentos */
      {
        path: "/payment/create/student/:id",
        name: "payment-create",
        component: () =>
          import("pages/financial/payments/pages/PaymentCreate.vue"),
      },
      {
        path: "/extras-fees",
        name: "extras-fees",
        component: () => import("pages/financial/extra-fees/pages/List.vue"),
      },
      {
        path: "/financial-control/expenses-categories",
        name: "expenses-categories",
        component: () => import("pages/financial/expense/pages/Categories.vue"),
      },
      {
        path: "/financial-control/expenses",
        name: "expenses",
        component: () => import("pages/financial/expense/pages/Expenses.vue"),
      },

      /* Rotas de salas */
      {
        path: "/rooms/",
        name: "rooms",
        component: () => import("pages/room/pages/List.vue"),
      },
      {
        path: "/room/create",
        name: "room-create",
        component: () => import("pages/room/pages/Create.vue"),
      },
      {
        path: "/room/edit/:id",
        name: "room-edit",
        component: () => import("pages/room/pages/Create.vue"),
      },

      /* Rotas de Tarefas*/
      {
        path: "/tasks",
        name: "tasks",
        component: () => import("pages/task/pages/List.vue"),
      },
      {
        path: "class/:classe/discipline/:discipline/task/create",
        name: "task-create",
        component: () => import("src/pages/task/pages/New.vue"),
      },
      {
        path: "/task/edit/:id",
        name: "task-edit",
        component: () => import("src/pages/task/pages/New.vue"),
      },
      {
        path: "/task/:id/:entity/add",
        name: "task-add-groups",
        component: () => import("src/pages/task/pages/AddToGroup.vue"),
      },
      {
        path: "/task/:id/:entity/add",
        name: "task-add-students",
        component: () => import("src/pages/task/pages/AddToGroup.vue"),
      },

      /* Rotas de Grupos */
      {
        path: "classe/:classe/groups",
        name: "groups",
        component: () => import("pages/group/pages/List.vue"),
      },
      {
        path: "classe/:classe/group/create",
        name: "group-create",
        component: () => import("pages/group/pages/New.vue"),
      },
      {
        path: "/group/edit/:id",
        name: "group-edit",
        component: () => import("pages/group/pages/New.vue"),
      },

      /* Rotas de Presenca */
      {
        path: "/class/:classe/discipline/:discipline/attendances",
        name: "class-attendances",
        component: () =>
          import("src/pages/attendance/pages/ClassAttendance.vue"),
      },
      {
        path: "/class/:classe/discipline/:discipline/attendance/:attendance",
        name: "create-attendance",
        component: () => import("src/pages/attendance/pages/Attendance.vue"),
      },
      {
        path: "/student/:id/attendances/",
        name: "student-attendances",
        component: () => import("src/pages/attendance/pages/Student.vue"),
      },

      /* Rotas de Horarios */
      {
        path: "/schedule/create",
        name: "schedule-create",
        component: () => import("pages/schedule/pages/Create.vue"),
      },

      /* Rotas de Notificações */
      {
        path: "/notifications",
        name: "notifications",
        component: () => import("pages/notification/pages/List.vue"),
      },
      {
        path: "/notification/create",
        name: "notification-create",
        component: () => import("pages/notification/pages/Create.vue"),
      },

      /* Rotas de Configurações do site */
      {
        path: "/institution/:id/settings-site",
        name: "settings-site",
        component: () =>
          import("pages/institution/components/SettingsSite.vue"),
      },

      /* Rotas de Configurações do sistema infantil*/

      ...institutionRoutes,
      ...courseRoutes,
      ...employeeRoutes,
      ...disciplineRoutes,
      ...curriculumRoutes,
      ...developmentAreaRoutes,
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
  {
    path: "/Maintenance",
    component: () => import("pages/Maintenance.vue"),
  },
  {
    path: "/login",
    name: "login",
    beforeEnter: authGuard,
    component: () => import("pages/auth/pages/Login.vue"),
  },
  {
    path: "/sige",
    name: "main-site",
    component: () => import("pages/site/main.vue"),
  },
  {
    path: "/sige/:schoolSlug",
    name: "logout",
    component: () => import("pages/site/institution/main.vue"),
  },
];

export default routes;
