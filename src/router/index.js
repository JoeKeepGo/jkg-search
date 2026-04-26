import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import Results from '@/components/Results.vue'
import Login from '@/components/Login.vue'
import Admin from '@/components/Admin.vue'
import AdminSettings from '@/components/AdminSettings.vue'
import { getCurrentUser } from '@/lib/api'

const router = createRouter({
  mode: "history",
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/search',
      name: 'Results',
      component: Results,
      props: route => ({ query: route.query.q })
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/settings',
      name: 'AdminSettings',
      component: AdminSettings,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true

  try {
    await getCurrentUser()
    return true
  } catch {
    return {
      path: '/login',
      query: { redirect: to.fullPath }
    }
  }
})

export default router
