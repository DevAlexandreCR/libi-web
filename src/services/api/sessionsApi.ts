import type { Session } from '@/types'
import http from './http'

export interface SessionFilters {
  status?: string
  fromDate?: string
  toDate?: string
}

export interface SendMessageResponse {
  success: boolean
  messageId: string
}

export const sessionsApi = {
  async list(merchantId: string, filters: SessionFilters = {}): Promise<Session[]> {
    const { data } = await http.get(`/merchants/${merchantId}/sessions`, { params: filters })
    return data
  },
  async get(sessionId: string): Promise<Session> {
    const { data } = await http.get(`/sessions/${sessionId}`)
    return data
  },
  async pause(sessionId: string): Promise<Session> {
    const { data } = await http.post(`/sessions/${sessionId}/pause`)
    return data
  },
  async resume(sessionId: string): Promise<Session> {
    const { data } = await http.post(`/sessions/${sessionId}/resume`)
    return data
  },
  async sendMessage(sessionId: string, message: string): Promise<SendMessageResponse> {
    const { data } = await http.post(`/sessions/${sessionId}/send-message`, { message })
    return data
  }
}
