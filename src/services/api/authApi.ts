import http from './http'
import type { User } from '@/types'

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await http.post('/api/auth/login', payload)
    return data
  },
  async currentUser(): Promise<User> {
    const { data } = await http.get('/api/auth/me')
    return data
  }
}
