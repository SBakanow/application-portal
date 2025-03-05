import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ApplicationsView from '@/views/ApplicationsView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import ApplicationView from '@/views/ApplicationView.vue'
import AddApplicationView from '@/views/AddApplicationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/applications',
      name: 'applications',
      component: ApplicationsView,
    },
    {
      path: '/applications/:id',
      name: 'application',
      component: ApplicationView,
    },
    {
      path: '/applications/add',
      name: 'add-application',
      component: AddApplicationView,
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

export default router
