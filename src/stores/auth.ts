import { defineStore } from 'pinia'
import { authApi } from '@/services/api'
import type { User, UserRole } from '@/types'
import { useNotificationStore } from './notifications'

const TOKEN_KEY = 'libi_token'
const USER_KEY = 'libi_user'

interface AuthState {
  user: User | null
  token: string
  loading: boolean
  initialized: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: '',
    loading: false,
    initialized: false
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.user),
    role: (state): UserRole | null => state.user?.role ?? null,
    merchantId: (state): string | null => state.user?.merchantId ?? null
  },
  actions: {
    async login(payload: { email: string; password: string }) {
      this.loading = true
      try {
        const result = await authApi.login(payload)
        this.token = result.token
        this.user = result.user
        localStorage.setItem(TOKEN_KEY, result.token)
        localStorage.setItem(USER_KEY, JSON.stringify(result.user))
        useNotificationStore().push({
          id: crypto.randomUUID(),
          type: 'success',
          title: 'Success',
          message: 'notifications.loginSuccess'
        })
      } finally {
        this.loading = false
      }
    },
    async restoreSession() {
      const savedToken = localStorage.getItem(TOKEN_KEY)
      const savedUser = localStorage.getItem(USER_KEY)
      if (savedToken && savedUser) {
        this.token = savedToken
        try {
          this.user = JSON.parse(savedUser)
        } catch {
          this.user = null
          this.token = ''
        }
      } else {
        this.user = null
        this.token = ''
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      }
      this.initialized = true
    },
    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      useNotificationStore().push({
        id: crypto.randomUUID(),
        type: 'info',
        title: 'Info',
        message: 'notifications.logoutSuccess'
      })
    }
  }
})
