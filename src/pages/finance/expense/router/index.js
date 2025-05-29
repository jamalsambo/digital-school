const expenseRoutes = [
  {
        path: "/finance/expenses-categories",
        name: "expenses-categories",
        component: () => import("src/pages/finance/expense/pages/Categories.vue"),
      },
      {
        path: "/finance/expenses",
        name: "expenses",
        component: () => import("src/pages/finance/expense/pages/Expenses.vue"),
      },
]

export default expenseRoutes
