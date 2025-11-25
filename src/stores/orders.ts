import { defineStore } from 'pinia'
import { ordersApi } from '@/services/api'
import type { Order, OrderStatus } from '@/types'
import { useNotificationStore } from './notifications'
import { useAuthStore } from './auth'
import http from '@/services/api/http'

interface OrdersState {
  list: Order[]
  selected: Order | null
  loadingList: boolean
  loadingDetail: boolean
  filters: {
    status?: OrderStatus | ''
    phone?: string
    from?: string
    to?: string
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
      status: '',
      phone: '',
      from: undefined,
      to: undefined
    },
    liveNewOrders: new Set<string>(),
    eventSource: undefined
  }),
  actions: {
    async fetch(merchantId: string) {
      this.loadingList = true
      try {
        this.list = await ordersApi.list(merchantId, {
          status: this.filters.status || undefined,
          from: this.filters.from,
          to: this.filters.to,
          phone: this.filters.phone
        })
      } finally {
        this.loadingList = false
      }
    },
    async fetchById(_merchantId: string, id: string) {
      this.loadingDetail = true
      try {
        this.selected = await ordersApi.get(id)
      } finally {
        this.loadingDetail = false
      }
    },
    async updateStatus(_merchantId: string, id: string, status: OrderStatus) {
      this.loadingDetail = true
      try {
        const order = await ordersApi.updateStatus(id, status)
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
      const auth = useAuthStore()
      const base = (http.defaults.baseURL || window.location.origin).replace(/\/$/, '')
      const url = new URL(`${base}/merchants/${merchantId}/orders/stream`)
      if (auth.token) {
        url.searchParams.set('token', auth.token)
      }

      this.eventSource = new EventSource(url.toString())
      const handleEvent = (event: MessageEvent) => {
        try {
          const payload = JSON.parse(event.data) as Order
          this.list = [payload, ...this.list.filter((o) => o.id !== payload.id)]
          this.liveNewOrders.add(payload.id)
        } catch (error) {
          console.error('Failed to parse live order', error)
        }
      }
      this.eventSource.onmessage = handleEvent
      this.eventSource.addEventListener('order_created', handleEvent)
      this.eventSource.addEventListener('order_updated', handleEvent)
      this.eventSource.onerror = (error) => {
        console.error('Order stream error', error)
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
