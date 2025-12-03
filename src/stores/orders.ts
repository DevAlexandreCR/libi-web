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
    awaitingPaymentProof?: boolean
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
      to: undefined,
      awaitingPaymentProof: undefined
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
          phone: this.filters.phone,
          awaitingPaymentProof: this.filters.awaitingPaymentProof
        })
      } finally {
        this.loadingList = false
      }
    },
    async fetchById(merchantId: string, id: string) {
      this.loadingDetail = true
      try {
        this.selected = await ordersApi.get(id, merchantId)
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
    async verifyPayment(merchantId: string, id: string, verified: boolean) {
      this.loadingDetail = true
      try {
        const order = await ordersApi.verifyPayment(merchantId, id, verified)
        this.selected = order
        this.list = this.list.map((o) => (o.id === id ? order : o))
        useNotificationStore().push({
          id: crypto.randomUUID(),
          type: 'success',
          title: 'Success',
          message: 'orders.paymentVerificationSuccess'
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
      const handleOrderEvent = (event: MessageEvent) => {
        try {
          const payload = JSON.parse(event.data) as Order
          this.list = [payload, ...this.list.filter((o) => o.id !== payload.id)]
          this.liveNewOrders.add(payload.id)
          if (this.selected?.id === payload.id) {
            this.selected = payload
          }
        } catch (error) {
          console.error('Failed to parse live order', error)
        }
      }
      const handlePaymentProof = (event: MessageEvent) => {
        try {
          const payload = JSON.parse(event.data) as { orderId: string; paymentProofUrl?: string }
          this.list = this.list.map((o) =>
            o.id === payload.orderId
              ? { ...o, paymentProofUrl: payload.paymentProofUrl, awaitingPaymentProof: true, paymentVerified: false }
              : o
          )
          this.liveNewOrders.add(payload.orderId)
          if (this.selected?.id === payload.orderId) {
            this.selected = {
              ...this.selected,
              paymentProofUrl: payload.paymentProofUrl,
              awaitingPaymentProof: true,
              paymentVerified: false
            }
          }
          useNotificationStore().push({
            id: crypto.randomUUID(),
            type: 'info',
            title: 'Info',
            message: 'orders.paymentProofReceived'
          })
        } catch (error) {
          console.error('Failed to parse payment proof event', error)
        }
      }
      this.eventSource.onmessage = handleOrderEvent
      this.eventSource.addEventListener('order_created', handleOrderEvent)
      this.eventSource.addEventListener('order_updated', handleOrderEvent)
      this.eventSource.addEventListener('payment_verified', handleOrderEvent)
      this.eventSource.addEventListener('payment_proof_uploaded', handlePaymentProof)
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
