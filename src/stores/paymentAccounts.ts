import { defineStore } from 'pinia'
import { paymentAccountsApi } from '@/services/api'
import type { PaymentAccount } from '@/types'
import type { PaymentAccountInput } from '@/services/api/paymentAccountsApi'
import { useNotificationStore } from './notifications'

interface PaymentAccountsState {
  list: PaymentAccount[]
  loading: boolean
}

export const usePaymentAccountsStore = defineStore('paymentAccounts', {
  state: (): PaymentAccountsState => ({
    list: [],
    loading: false
  }),
  actions: {
    async fetch(merchantId: string) {
      this.loading = true
      try {
        this.list = await paymentAccountsApi.list(merchantId)
      } finally {
        this.loading = false
      }
    },
    async create(merchantId: string, payload: PaymentAccountInput) {
      const account = await paymentAccountsApi.create(merchantId, payload)
      this.list = [account, ...this.list]
      useNotificationStore().push({
        id: crypto.randomUUID(),
        type: 'success',
        title: 'Success',
        message: 'notifications.updateSuccess'
      })
      return account
    },
    async update(merchantId: string, id: string, payload: Partial<PaymentAccountInput>) {
      const updated = await paymentAccountsApi.update(merchantId, id, payload)
      this.list = this.list.map((acc) => (acc.id === id ? updated : acc))
      useNotificationStore().push({
        id: crypto.randomUUID(),
        type: 'success',
        title: 'Success',
        message: 'notifications.updateSuccess'
      })
      return updated
    },
    async remove(merchantId: string, id: string) {
      await paymentAccountsApi.remove(merchantId, id)
      this.list = this.list.filter((acc) => acc.id !== id)
      useNotificationStore().push({
        id: crypto.randomUUID(),
        type: 'success',
        title: 'Success',
        message: 'notifications.updateSuccess'
      })
    }
  }
})
