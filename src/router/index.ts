import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { title: 'Dashboard - ToolTrack' }
      },
      {
        path: 'producao',
        name: 'producao',
        component: () => import('@/views/ProducaoView.vue'),
        meta: { title: 'Produção - ToolTrack' }
      },
      {
        path: 'perfil',
        name: 'perfil',
        component: () => import('@/views/PerfilView.vue'),
        meta: { title: 'Perfil - ToolTrack' }
      },
      {
        path: 'usuarios',
        name: 'usuarios',
        component: () => import('@/views/GerenciadorUsuariosView.vue'),
        meta: { title: 'Gerenciador de Usuários - ToolTrack', requiresAdmin: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Login - ToolTrack' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  const isAuth = !!token

  if (to.name !== 'login' && !isAuth) {
    next({ name: 'login' })
  } else if (to.name === 'login' && isAuth) {
    next({ name: 'dashboard' })
  } else if (to.meta.requiresAdmin) {
    const rawUser = localStorage.getItem('user')
    const user = rawUser ? JSON.parse(rawUser) : null
    const role = (user?.role || '').toLowerCase()
    if (role !== 'admin') {
      next({ name: 'dashboard' })
    } else {
      next()
    }
  } else {
    next()
  }
})

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = String(to.meta.title)
  }
})

export default router
