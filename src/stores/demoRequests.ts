import { defineStore } from 'pinia'
import { demoRequestsApi } from '@/services/api'
import type { DemoRequest, DemoRequestStatus } from '@/types'
import { useNotificationStore } from './notifications'

interface DemoRequestState {
  items: DemoRequest[]
  loading: boolean
}

export const useDemoRequestsStore = defineStore('demoRequests', {
  state: (): DemoRequestState => ({
    items: [],
    loading: false
  }),
  actions: {
    async fetch(filters?: { status?: DemoRequestStatus }) {
      this.loading = true
      try {
        this.items = await demoRequestsApi.list(filters)
      } finally {
        this.loading = false
      }
    },
    async updateStatus(id: string, status: DemoRequestStatus) {
      const updated = await demoRequestsApi.update(id, { status })
      this.items = this.items.map((lead) => (lead.id === id ? updated : lead))
      useNotificationStore().push({
        id: crypto.randomUUID(),
        type: 'success',
        title: 'Success',
        message: 'demoRequests.updateSuccess'
      })
    }
  }
})
