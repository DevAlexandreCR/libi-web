import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router'
import PublicLayout from '@/layouts/PublicLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import MerchantLayout from '@/layouts/MerchantLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { pinia } from '@/stores'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      component: PublicLayout,
      children: [
        {
          path: '',
          name: 'landing',
          component: () => import('@/views/LandingView.vue')
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/LoginView.vue')
        },
        {
          path: 'demo',
          name: 'demo',
          component: () => import('@/views/LoginView.vue')
        }
      ]
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, roles: ['SUPER_ADMIN'] },
      children: [
        { path: '', redirect: { name: 'admin-overview' } },
        {
          path: 'overview',
          name: 'admin-overview',
          component: () => import('@/views/admin/AdminOverviewView.vue')
        },
        {
          path: 'merchants',
          name: 'admin-merchants',
          component: () => import('@/views/admin/AdminMerchantsView.vue')
        },
        {
          path: 'merchants/create',
          name: 'admin-merchants-create',
          component: () => import('@/views/admin/AdminMerchantFormView.vue')
        },
        {
          path: 'merchants/:id',
          name: 'admin-merchants-edit',
          component: () => import('@/views/admin/AdminMerchantFormView.vue')
        },
        {
          path: 'whatsapp-lines',
          name: 'admin-whatsapp-lines',
          component: () => import('@/views/admin/AdminWhatsAppLinesView.vue')
        },
        {
          path: 'whatsapp-lines/:id',
          name: 'admin-whatsapp-line-detail',
          component: () => import('@/views/admin/AdminWhatsAppLineDetailView.vue')
        }
      ]
    },
    {
      path: '/app',
      component: MerchantLayout,
      meta: { requiresAuth: true, roles: ['MERCHANT_ADMIN'] },
      children: [
        { path: '', redirect: { name: 'merchant-overview' } },
        {
          path: 'overview',
          name: 'merchant-overview',
          component: () => import('@/views/merchant/MerchantOverviewView.vue')
        },
        {
          path: 'orders',
          name: 'merchant-orders',
          component: () => import('@/views/merchant/MerchantOrdersView.vue')
        },
        {
          path: 'orders/:id',
          name: 'merchant-order-detail',
          component: () => import('@/views/merchant/MerchantOrderDetailView.vue')
        },
        {
          path: 'sessions',
          name: 'merchant-sessions',
          component: () => import('@/views/merchant/MerchantSessionsView.vue')
        },
        {
          path: 'sessions/:id',
          name: 'merchant-session-detail',
          component: () => import('@/views/merchant/MerchantSessionDetailView.vue')
        },
        {
          path: 'menu',
          name: 'merchant-menu',
          component: () => import('@/views/merchant/MerchantMenuView.vue')
        },
        {
          path: 'menu/import',
          name: 'merchant-menu-import',
          component: () => import('@/views/merchant/MerchantMenuImportView.vue')
        },
        {
          path: 'whatsapp-lines',
          name: 'merchant-whatsapp-lines',
          component: () => import('@/views/merchant/MerchantWhatsappLinesView.vue')
        },
        {
          path: 'settings',
          name: 'merchant-settings',
          component: () => import('@/views/merchant/MerchantSettingsView.vue')
        }
      ]
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

router.beforeEach(async (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const auth = useAuthStore(pinia)
  if (!auth.initialized) {
    await auth.restoreSession()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  const allowedRoles = (to.meta.roles as string[] | undefined) ?? []
  if (allowedRoles.length && (!auth.role || !allowedRoles.includes(auth.role))) {
    return next({ name: 'landing' })
  }

  if ((to.name === 'login' || to.name === 'demo') && auth.isAuthenticated) {
    if (auth.role === 'SUPER_ADMIN') return next({ name: 'admin-overview' })
    if (auth.role === 'MERCHANT_ADMIN') return next({ name: 'merchant-overview' })
  }

  return next()
})

export default router
