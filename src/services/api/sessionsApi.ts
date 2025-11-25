import type { Session } from '@/types'
import http from './http'

export interface SessionFilters {
  status?: string
  fromDate?: string
  toDate?: string
}

export const sessionsApi = {
  async list(merchantId: string, filters: SessionFilters = {}): Promise<Session[]> {
    const { data } = await http.get(`/merchants/${merchantId}/sessions`, { params: filters })
    return data
  },
  async get(sessionId: string): Promise<Session> {
    const { data } = await http.get(`/sessions/${sessionId}`)
    return data
  }
}
