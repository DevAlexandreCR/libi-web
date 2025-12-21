import type { WhatsAppLine, BusinessHours } from '@/types'
import http from './http'

export interface EmbeddedSignupPayload {
  access_token: string
  phone_number_id: string
  waba_id: string
  business_id?: string
  phone_number?: string
  display_phone_number?: string
  phone_display_name?: string
}

export interface WhatsappLinePayload {
  access_token?: string
  phone_number_id?: string
  waba_id?: string
  business_id?: string
  phone_number?: string
  phone_display_name?: string
  status?: WhatsAppLine['status']
}

export interface BusinessHoursInput {
  dayOfWeek: BusinessHours['dayOfWeek']
  isEnabled: boolean
  openTime: string
  closeTime: string
  crossesMidnight: boolean
}

export const whatsappLinesApi = {
  async listByMerchant(merchantId: string): Promise<WhatsAppLine[]> {
    const { data } = await http.get(`/merchants/${merchantId}/whatsapp-lines`)
    return data
  },
  async completeEmbeddedSignup(merchantId: string, payload: EmbeddedSignupPayload): Promise<WhatsAppLine> {
    const { data } = await http.post(
      `/merchants/${merchantId}/whatsapp-lines/embedded-signup/complete`,
      payload
    )
    return data
  },
  async create(merchantId: string, payload: WhatsappLinePayload): Promise<WhatsAppLine> {
    const { data } = await http.post(`/merchants/${merchantId}/whatsapp-lines`, payload)
    return data
  },
  async update(lineId: string, payload: WhatsappLinePayload): Promise<WhatsAppLine> {
    const { data } = await http.put(`/whatsapp-lines/${lineId}`, payload)
    return data
  },
  async toggleBotEnabled(lineId: string, botEnabled: boolean): Promise<WhatsAppLine> {
    const { data } = await http.patch(`/whatsapp-lines/${lineId}/bot-enabled`, { botEnabled })
    return data
  }
}
