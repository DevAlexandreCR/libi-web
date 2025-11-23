import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authAPI } from '../api'
import { useRouter } from 'vue-router'

interface User {
  id: string
  email: string
  name?: string
  type: 'admin' | 'business'
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const login = async (email: string, password: string, userType: 'admin' | 'business' = 'business') => {
    loading.value = true
    error.value = null

    try {
      const response = userType === 'admin'
        ? await authAPI.loginAdmin(email, password)
        : await authAPI.loginBusiness(email, password)

      token.value = response.data.token
      user.value = response.data.user

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      return true
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al iniciar sesión'
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const checkAuth = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
      return true
    }
    return false
  }

  return {
    user,
    token,
    loading,
    error,
    login,
    logout,
    checkAuth,
  }
})
