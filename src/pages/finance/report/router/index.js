const financeReportRoutes = [
  {
    path: "finance/report",
    meta: {titlte: 'Finance Report'},
    component: () => import("src/pages/finance/report/pages/ReportGeral.vue"),
  },
];

export default financeReportRoutes;
