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
    status?: OrderStatus | ''
    phone?: string
    from?: string
    to?: string
    awaitingPaymentProof?: boolean
  }
  liveNewOrders: Set<string>
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
    liveNewOrders: new Set<string>()
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
    markAsSeen(id: string) {
      this.liveNewOrders.delete(id)
    }
  }
})
