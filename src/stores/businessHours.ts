import { defineStore } from 'pinia'
import { businessHoursApi } from '@/services/api/businessHoursApi'
import type { BusinessHours } from '@/types'
import type { BusinessHoursInput } from '@/services/api/whatsappLinesApi'
import { useNotificationStore } from './notifications'

interface BusinessHoursState {
  hours: Record<string, BusinessHours[]>
  loading: boolean
}

export const useBusinessHoursStore = defineStore('businessHours', {
  state: (): BusinessHoursState => ({
    hours: {},
    loading: false
  }),
  actions: {
    async fetchByMerchant(merchantId: string) {
      this.loading = true
      try {
        const hours = await businessHoursApi.getByMerchant(merchantId)
        this.hours[merchantId] = hours
        return hours
      } catch (error) {
        console.error('Error fetching business hours:', error)
        return []
      } finally {
        this.loading = false
      }
    },
    async updateByMerchant(merchantId: string, hours: BusinessHoursInput[]) {
      try {
        const updated = await businessHoursApi.update(merchantId, hours)
        this.hours[merchantId] = updated
        useNotificationStore().push({
          id: crypto.randomUUID(),
          type: 'success',
          title: 'Success',
          message: 'Horarios actualizados correctamente'
        })
        return updated
      } catch (error) {
        useNotificationStore().push({
          id: crypto.randomUUID(),
          type: 'error',
          title: 'Error',
          message: 'Error al actualizar los horarios'
        })
        throw error
      }
    },
    getHours(merchantId: string): BusinessHours[] {
      return this.hours[merchantId] || []
    }
  }
})
