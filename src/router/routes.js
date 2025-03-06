import authGuard from "./authGuard";
import { internshipRoutes, activitiesRoutes, developmentAreaRoutes, childhoodClasseRoutes } from "../pages/childhood/routes"

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

      {
        path: "/institution",
        name: "institutions",
        component: () => import("pages/institution/pages/List.vue"),
      },

      {
        path: "/institution/create",
        name: "institution-create",
        component: () => import("pages/institution/pages/Create.vue"),
      },
      {
        path: "/institution/edit/:id",
        name: "institution-edit",
        component: () => import("pages/institution/pages/Create.vue"),
      },
      {
        path: "/institution/create/:parent/branch",
        name: "create-branch",
        component: () => import("pages/institution/pages/Create.vue"),
      },
      {
        path: "/institution/:institution/:entity/create/education/:education",
        name: "course-create",
        component: () => import("pages/course/pages/Create.vue"),
      },

      {
        path: "/institution/:institution/settings/payment/education/:education",
        name: "settings-payment",
        component: () =>
          import("pages/financial/payments/pages/PaymentSettings.vue"),
      },
     /* Routas de calendario academico  */
     {
      path: "/academic-calendar",
      name: "academic-calendar",
      component: () => import("pages/calendar/pages/List.vue"),
    },
      {
        path: "/academic-calendar/create",
        name: "academic-calendar-create",
        component: () => import("pages/academic-calendar/pages/Create.vue"),
      },


      {
        path: "/courses",
        name: "courses",
        component: () => import("pages/course/pages/List.vue"),
      },
      {
        path: "/course/:id/settings/:settingsEntity?/:settingsEntityId?/:purpose?/:entity?/:purposeId?",
        name: "course-settings",
        component: () => import("pages/course/components/SettingsCourse.vue"),
      },

      /* Rotas de Turma */
      { path: "/class", component: () => import("pages/class/pages/List.vue") },
      {
        path: "/class/create",
        name: "class-create",
        component: () => import("pages/class/pages/Create.vue"),
      },

      {
        path: "/discipline",
        component: () => import("pages/discipline/pages/List.vue"),
      },
      {
        path: "/discipline/create",
        name: "discipline-create",
        component: () => import("pages/discipline/pages/Create.vue"),
      },

      {
        path: "/curriculum-plan",
        component: () => import("pages/curriculum-plan/pages/List.vue"),
      },
      {
        path: "/curriculum-plan/create",
        name: "curriculum-create",
        component: () => import("pages/curriculum-plan/pages/Create.vue"),
      },
      {
        path: "/curriculum-plan/edit/:id",
        name: "curriculum-edit",
        component: () => import("pages/curriculum-plan/pages/Create.vue"),
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
        path: "/employees",
        name: "employees",
        component: () => import("pages/employee/pages/List.vue"),
      },
      {
        path: "/employee/:created/:id",
        name: "employee-space",
        component: () => import("pages/employee/pages/Create.vue"),
      },
      {
        path: "/employee/:id/teachings",
        name: "employee-teachings",
        component: () => import("pages/employee/pages/Teachings.vue"),
      },
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

      /* Rotas de Relatorios */
      {
        path: "/reports",
        name: "reports",
        component: () => import("pages/report/pages/List.vue"),
      },
      {
        path: "/report/create",
        name: "report-create",
        component: () => import("pages/report/pages/Create.vue"),
      },
      /* Rotas de Usuários */
      {
        path: "/users",
        name: "users",
        component: () => import("pages/user/pages/List.vue"),
      },
      {
        path: "/user/create",
        name: "user-create",
        component: () => import("pages/user/pages/Create.vue"),
      },

      /* Rotas de Horarios */
      {
        path: "/schedule",
        name: "schedule",
        component: () => import("pages/schedule/pages/List.vue"),
      },
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
        component: () => import("pages/institution/components/SettingsSite.vue"),
      },

      /* Rotas de Configurações do sistema infantil*/

      ...internshipRoutes,
      ...activitiesRoutes,
      ...developmentAreaRoutes,
      ...childhoodClasseRoutes

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
  }

];

export default routes;
