import { defineStore } from 'pinia'
import { ordersApi } from '@/services/api'
import type { Order, OrderStatus } from '@/types'
import { useNotificationStore } from './notifications'

interface OrdersState {
  list: Order[]
  selected: Order | null
  loadingList: boolean
  loadingDetail: boolean
  filters: {
    status: OrderStatus[]
    search: string
    fromDate?: string
    toDate?: string
  }
  liveNewOrders: Set<string>
  eventSource?: EventSource
}

export const useOrdersStore = defineStore('orders', {
  state: (): OrdersState => ({
    list: [],
    selected: null,
    loadingList: false,
    loadingDetail: false,
    filters: {
      status: [],
      search: '',
      fromDate: undefined,
      toDate: undefined
    },
    liveNewOrders: new Set<string>(),
    eventSource: undefined
  }),
  actions: {
    async fetch(merchantId: string) {
      this.loadingList = true
      try {
        const { data } = await ordersApi.list(merchantId, {
          status: this.filters.status,
          search: this.filters.search,
          fromDate: this.filters.fromDate,
          toDate: this.filters.toDate
        })
        this.list = data
      } finally {
        this.loadingList = false
      }
    },
    async fetchById(merchantId: string, id: string) {
      this.loadingDetail = true
      try {
        this.selected = await ordersApi.get(merchantId, id)
      } finally {
        this.loadingDetail = false
      }
    },
    async updateStatus(merchantId: string, id: string, status: OrderStatus) {
      this.loadingDetail = true
      try {
        const order = await ordersApi.updateStatus(merchantId, id, status)
        this.selected = order
        this.list = this.list.map((o) => (o.id === id ? order : o))
        useNotificationStore().push({
          id: crypto.randomUUID(),
          type: 'success',
          title: 'Success',
          message: 'notifications.updateSuccess'
        })
      } finally {
        this.loadingDetail = false
      }
    },
    connectLiveUpdates(merchantId: string) {
      if (this.eventSource) {
        this.eventSource.close()
      }
      const base = import.meta.env.VITE_API_BASE_URL || window.location.origin
      const streamUrl = `${base}/api/merchants/${merchantId}/orders/stream`
      this.eventSource = new EventSource(streamUrl)
      this.eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as Order
          this.list = [payload, ...this.list.filter((o) => o.id !== payload.id)]
          this.liveNewOrders.add(payload.id)
        } catch (error) {
          console.error('Failed to parse live order', error)
        }
      }
    },
    disconnectLiveUpdates() {
      this.eventSource?.close()
      this.eventSource = undefined
    },
    markAsSeen(id: string) {
      this.liveNewOrders.delete(id)
    }
  }
})
