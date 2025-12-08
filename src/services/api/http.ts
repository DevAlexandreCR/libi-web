import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'
import { pinia } from '@/stores'

const rawBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
const rawPrefix = import.meta.env.VITE_API_PREFIX || '/api'
const normalizedPrefix = `/${rawPrefix.replace(/^\/+/, '').replace(/\/+$/, '')}`

export const apiBaseUrl = `${rawBase}${normalizedPrefix}`

const http = axios.create({ baseURL: apiBaseUrl, withCredentials: false })

http.interceptors.request.use((config) => {
  const auth = useAuthStore(pinia)
  if (auth.token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message || 'Unexpected error'
    const auth = useAuthStore(pinia)
    if (status === 401) {
      auth.logout()
    }
    const notifications = useNotificationStore(pinia)
    notifications.push({
      id: crypto.randomUUID(),
      type: 'error',
      title: 'Error',
      message
    })
    return Promise.reject(error)
  }
)

export default http
