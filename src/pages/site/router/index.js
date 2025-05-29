const siteRoutes = [
  {
    path: '/:schoolSlug',
    component: () => import('../institution/main.vue'),
    children: [
      { path: '', component: () => import('../institution/pages/Home.vue') },
      { path: '/:schoolSlug/about-us', component: () => import('../institution/pages/AboutUs.vue') },
      { path: '/:schoolSlug/educations', component: () => import('../institution/pages/Educations.vue') },
      { path: '/:schoolSlug/education/:education', component: () => import('../institution/pages/EducationDetalhes.vue') },
      { path: '/:schoolSlug/extensions', component: () => import('../institution/pages/Extension.vue') },
      { path: '/:schoolSlug/contact', component: () => import('../institution/pages/Contact.vue') },
    ]
  }
]
export default siteRoutes;
