import type { User, UserRole } from '@/types'
import http from './http'

export interface CreateUserPayload {
  email: string
  password: string
  role: UserRole
  merchantId?: string
}

export const usersApi = {
  async list(): Promise<User[]> {
    const { data } = await http.get('/users')
    return data
  },
  async create(payload: CreateUserPayload): Promise<User> {
    const { data } = await http.post('/users', payload)
    return data
  },
}
