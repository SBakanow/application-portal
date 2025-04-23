import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/authStore'
import HomeView from '@/views/HomeView.vue'
import ApplicationsView from '@/views/ApplicationsView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import ApplicationView from '@/views/ApplicationView.vue'
import AddApplicationView from '@/views/AddApplicationView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/applications',
      name: 'applications',
      component: ApplicationsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/applications/:id',
      name: 'application',
      component: ApplicationView,
      meta: { requiresAuth: true },
    },
    {
      path: '/applications/add',
      name: 'add-application',
      component: AddApplicationView,
      meta: { requiresAuth: true },
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    try {
      await authStore.checkAuth()

      if (authStore.isAuthenticated) {
        return next()
      }
    } catch (error) {
      console.warn('Authentication failed. Redirecting to login.')
    }
    return next({ name: 'login' })
  }
  next()
})

export default router
