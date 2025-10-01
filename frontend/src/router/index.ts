import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ApiTest from '../views/ApiTest.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/api-test',
      name: 'api-test',
      component: ApiTest,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    // Fetch user if not already loaded
    if (authStore.user === null && !authStore.loading) {
      await authStore.fetchUser()
    }

    // Redirect to home if not authenticated
    if (!authStore.isAuthenticated) {
      next({ name: 'home' })
      return
    }
  }

  next()
})

export default router
