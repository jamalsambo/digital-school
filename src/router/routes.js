import authGuard from "./authGuard";
import {
  courseRoutes,
  institutionRoutes,
  employeeRoutes,
  disciplineRoutes,
  curriculumRoutes,
  developmentAreaRoutes,
  roomRoutes,
  classeRoutes,
  periodsRoutes,
  enrollmentRoutes,
  paymentsRoutes,
  scheduleRoutes,
  invoiceRoutes,
  receiptsRoutes,
  planRoutes,
  studentRoutes,
  stockRoutes,
  bulletinRoutes,
  evolutionsRoutes,
  assetsRoutes,
  academicCalendarRoutes,
  attendanceRoutes,
  groupRoutes,
  taskRoutes
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

      /* Rotas do funcionario */

      {
        path: "/education/:educationId/schedule/class/:classId/",
        name: "schedule-class",
        component: () => import("pages/schedule/pages/Create.vue"),
      },



      /* Rotas de Pagamentos */
      {
        path: "/payment/create/student/:id",
        name: "payment-create",
        component: () =>
          import("src/pages/finance/payments/pages/PaymentCreate.vue"),
      },
      {
        path: "/extras-fees",
        name: "extras-fees",
        component: () => import("src/pages/finance/extra-fees/pages/List.vue"),
      },
      {
        path: "/financial-control/expenses-categories",
        name: "expenses-categories",
        component: () => import("src/pages/finance/expense/pages/Categories.vue"),
      },
      {
        path: "/financial-control/expenses",
        name: "expenses",
        component: () => import("src/pages/finance/expense/pages/Expenses.vue"),
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
      ...roomRoutes,
      ...classeRoutes,
      ...periodsRoutes,
      ...enrollmentRoutes,
      ...paymentsRoutes,
      ...scheduleRoutes,
      ...invoiceRoutes,
      ...receiptsRoutes,
      ...planRoutes,
      ...studentRoutes,
      ...stockRoutes,
      ...bulletinRoutes,
      ...evolutionsRoutes,
      ...assetsRoutes,
      ...academicCalendarRoutes,
      ...attendanceRoutes,
      ...groupRoutes,
      ...taskRoutes
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
    name: "school-site",
    component: () => import("pages/site/institution/main.vue"),
  },
];

export default routes;
