import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import BusinessDashboard from '../views/BusinessDashboard.vue'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/admin', component: AdminDashboard },
    { path: '/dashboard', component: BusinessDashboard },
  ]
})

export default router
