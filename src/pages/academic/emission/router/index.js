const emissionRoutes = [
  /* Rotas de Tarefas*/
  {
    path: "emission/certicate/student/:studentId/course/:courseId",
    name: "emission-certificate",
    component: () => import("src/pages/academic/emission/pages/Certificate.vue"),
    meta: {title: 'Certificate'}
  },
  {
    path: "emission/informative-note/student/:studentId/cicle/:cicle",
    name: "emission-informative-note",
    component: () => import("src/pages/academic/emission/pages/InformativeNote.vue"),
    meta: {title: 'Informative note'}
  }
]

export default emissionRoutes