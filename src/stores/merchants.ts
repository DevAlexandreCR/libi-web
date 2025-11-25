import { defineStore } from 'pinia'
import { merchantsApi } from '@/services/api'
import type { Merchant } from '@/types'
import { useNotificationStore } from './notifications'

interface MerchantState {
  merchants: Merchant[]
  selected: Merchant | null
  loading: boolean
}

export const useMerchantStore = defineStore('merchants', {
  state: (): MerchantState => ({
    merchants: [],
    selected: null,
    loading: false
  }),
  actions: {
    async fetch(filters?: { search?: string }) {
      this.loading = true
      try {
        this.merchants = await merchantsApi.list(filters)
      } finally {
        this.loading = false
      }
    },
    async fetchById(id: string) {
      this.loading = true
      try {
        this.selected = await merchantsApi.get(id)
      } finally {
        this.loading = false
      }
    },
    async save(payload: Partial<Merchant>) {
      this.loading = true
      try {
        let merchant: Merchant
        if (payload.id) {
          merchant = await merchantsApi.update(payload.id, payload)
        } else {
          merchant = await merchantsApi.create(payload)
        }
        useNotificationStore().push({
          id: crypto.randomUUID(),
          type: 'success',
          title: 'Success',
          message: 'notifications.updateSuccess'
        })
        return merchant
      } finally {
        this.loading = false
      }
    },
    async remove(id: string) {
      await merchantsApi.remove(id)
      this.merchants = this.merchants.filter((m) => m.id !== id)
      useNotificationStore().push({
        id: crypto.randomUUID(),
        type: 'success',
        title: 'Success',
        message: 'notifications.updateSuccess'
      })
    }
  }
})
