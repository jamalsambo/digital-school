import ManageAccount from "../pages/ManageAccount.vue"

const userRoutes = [
 {
    path: "user/:userId/manage-account",
    name: "manage-account",
    component: ManageAccount,
    meta: { title: "Manage Account"}
  },
]

export default userRoutes
