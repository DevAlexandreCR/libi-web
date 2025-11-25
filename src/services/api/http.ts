import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'
import { pinia } from '@/stores'

const apiOrigin = import.meta.env.VITE_API_ORIGIN ?? window.location.origin
const apiPrefix = import.meta.env.VITE_API_PREFIX ?? '/api'
const baseURL =
  import.meta.env.VITE_API_BASE_URL ??
  `${apiOrigin.replace(/\/$/, '')}${apiPrefix.startsWith('/') ? apiPrefix : `/${apiPrefix}`}`

const http = axios.create({ baseURL, withCredentials: false })

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
