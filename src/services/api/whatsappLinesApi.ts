import type { WhatsAppLine } from '@/types'
import http from './http'

export interface EmbeddedSignupPayload {
  access_token: string
  phone_number_id: string
  waba_id: string
  business_id?: string
  phone_number?: string
  display_phone_number?: string
}

export const whatsappLinesApi = {
  async listAll(): Promise<WhatsAppLine[]> {
    const { data } = await http.get('/api/whatsapp-lines')
    return data
  },
  async listByMerchant(merchantId: string): Promise<WhatsAppLine[]> {
    const { data } = await http.get(`/api/merchants/${merchantId}/whatsapp-lines`)
    return data
  },
  async completeEmbeddedSignup(merchantId: string, payload: EmbeddedSignupPayload): Promise<WhatsAppLine> {
    const { data } = await http.post(
      `/api/merchants/${merchantId}/whatsapp-lines/embedded-signup/complete`,
      payload
    )
    return data
  }
}
