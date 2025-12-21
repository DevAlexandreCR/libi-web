import http from './http'
import type { DemoRequest, DemoRequestStatus } from '@/types'

export const demoRequestsApi = {
  async create(payload: {
    name: string
    email: string
    phone?: string
    company?: string
    message?: string
    source?: string
  }): Promise<DemoRequest> {
    const { data } = await http.post('/demo-requests', payload)
    return data
  },
  async list(filters?: { status?: DemoRequestStatus }): Promise<DemoRequest[]> {
    const { data } = await http.get('/demo-requests', { params: filters })
    return data
  },
  async update(id: string, payload: { status?: DemoRequestStatus }): Promise<DemoRequest> {
    const { data } = await http.patch(`/demo-requests/${id}`, payload)
    return data
  }
}
