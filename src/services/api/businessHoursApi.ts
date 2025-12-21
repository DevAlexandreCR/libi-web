import type { BusinessHours } from '@/types'
import type { BusinessHoursInput } from './whatsappLinesApi'
import http from './http'

export const businessHoursApi = {
  async getByMerchant(merchantId: string): Promise<BusinessHours[]> {
    const { data } = await http.get(`/merchants/${merchantId}/business-hours`)
    return data
  },
  async update(merchantId: string, hours: BusinessHoursInput[]): Promise<BusinessHours[]> {
    const { data } = await http.put(`/merchants/${merchantId}/business-hours`, hours)
    return data
  },
  async checkStatus(merchantId: string): Promise<{ shouldRespond: boolean; message?: string }> {
    const { data } = await http.get(`/merchants/${merchantId}/business-hours/status`)
    return data
  }
}
