import type { PaginationMeta, Session } from '@/types'
import http from './http'

export interface SessionFilters {
  status?: string
  fromDate?: string
  toDate?: string
  page?: number
  pageSize?: number
}

export interface SessionListResponse {
  data: Session[]
  meta?: PaginationMeta
}

export const sessionsApi = {
  async list(merchantId: string, filters: SessionFilters = {}): Promise<SessionListResponse> {
    const { data } = await http.get(`/api/merchants/${merchantId}/sessions`, { params: filters })
    return data
  },
  async get(merchantId: string, sessionId: string): Promise<Session> {
    const { data } = await http.get(`/api/merchants/${merchantId}/sessions/${sessionId}`)
    return data
  }
}
