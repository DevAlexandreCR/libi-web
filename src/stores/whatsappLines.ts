import { defineStore } from 'pinia'
import { whatsappLinesApi, type EmbeddedSignupPayload } from '@/services/api/whatsappLinesApi'
import { merchantsApi } from '@/services/api'
import type { WhatsAppLine } from '@/types'
import { useNotificationStore } from './notifications'

interface WhatsappLinesState {
  lines: WhatsAppLine[]
  loading: boolean
  connecting: boolean
}

export const useWhatsappLinesStore = defineStore('whatsappLines', {
  state: (): WhatsappLinesState => ({
    lines: [],
    loading: false,
    connecting: false
  }),
  actions: {
    async fetchAll() {
      this.loading = true
      try {
        const merchants = await merchantsApi.list()
        const all = await Promise.all(
          merchants.map(async (merchant) => {
            const lines = await whatsappLinesApi.listByMerchant(merchant.id)
            return lines.map((line) => ({ ...line, merchantName: merchant.name }))
          })
        )
        this.lines = all.flat()
      } finally {
        this.loading = false
      }
    },
    async fetchByMerchant(merchantId: string) {
      this.loading = true
      try {
        this.lines = await whatsappLinesApi.listByMerchant(merchantId)
      } finally {
        this.loading = false
      }
    },
    async completeEmbeddedSignup(merchantId: string, payload: EmbeddedSignupPayload) {
      this.connecting = true
      try {
        const line = await whatsappLinesApi.completeEmbeddedSignup(merchantId, payload)
        const existingName = this.lines.find((l) => l.merchantId === merchantId)?.merchantName
        const merchantName = existingName ?? (await merchantsApi.get(merchantId)).name
        const enriched = { ...line, merchantName }
        this.lines = [enriched, ...this.lines.filter((l) => l.id !== line.id)]
        useNotificationStore().push({
          id: crypto.randomUUID(),
          type: 'success',
          title: 'Success',
          message: 'whatsapp.success'
        })
      } finally {
        this.connecting = false
      }
    }
  }
})
