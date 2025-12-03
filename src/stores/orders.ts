import { defineStore } from 'pinia'
import { ordersApi } from '@/services/api'
import type { Order, OrderStatus } from '@/types'
import { useNotificationStore } from './notifications'
import { useAuthStore } from './auth'
import { useMerchantStore } from './merchants'
import http from '@/services/api/http'
import { notificationSoundService } from '@/services/notificationSound'

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
        console.log('[Orders] Closing existing EventSource connection')
        this.eventSource.close()
      }

      const auth = useAuthStore()
      const merchantStore = useMerchantStore()

      // Inicializar el servicio de sonido con la configuración del merchant
      if (merchantStore.selected) {
        notificationSoundService.initialize(
          merchantStore.selected.notificationSoundEnabled ?? true,
          merchantStore.selected.notificationSoundVolume ?? 0.7
        )
      }

      const base = (http.defaults.baseURL || window.location.origin).replace(/\/$/, '')
      const url = new URL(`${base}/merchants/${merchantId}/orders/stream`)
      if (auth.token) {
        url.searchParams.set('token', auth.token)
      }

      console.log('[Orders] Connecting to SSE:', url.toString())
      this.eventSource = new EventSource(url.toString())

      const handleOrderEvent = (event: MessageEvent) => {
        try {
          console.log('[Orders] Received order event:', event.type, event.data)
          const payload = JSON.parse(event.data) as Order
          this.list = [payload, ...this.list.filter((o) => o.id !== payload.id)]
          this.liveNewOrders.add(payload.id)
          if (this.selected?.id === payload.id) {
            this.selected = payload
          }

          // Mostrar notificación visual
          const notificationStore = useNotificationStore()
          if (event.type === 'order_created') {
            notificationStore.push({
              id: crypto.randomUUID(),
              type: 'info',
              title: '🔔 Nuevo Pedido',
              message: `Pedido #${payload.id} - $${Number(payload.estimatedTotal).toFixed(2)}`,
              durationMs: 8000
            })
            // Reproducir sonido
            notificationSoundService.play('order_created')
          } else if (event.type === 'payment_verified') {
            notificationStore.push({
              id: crypto.randomUUID(),
              type: 'success',
              title: '✅ Pago Verificado',
              message: `Pedido #${payload.id} - Pago confirmado`,
              durationMs: 6000
            })
            notificationSoundService.play('payment_verified')
          }
        } catch (error) {
          console.error('[Orders] Failed to parse live order event:', error, event)
        }
      }

      const handlePaymentProof = (event: MessageEvent) => {
        try {
          console.log('[Orders] Received payment proof event:', event.data)
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

          // Mostrar notificación visual y sonido
          useNotificationStore().push({
            id: crypto.randomUUID(),
            type: 'info',
            title: '📸 Comprobante Recibido',
            message: `Pedido #${payload.orderId} - Comprobante de pago cargado`,
            durationMs: 8000
          })
          notificationSoundService.play('payment_proof_uploaded')
        } catch (error) {
          console.error('[Orders] Failed to parse payment proof event:', error, event)
        }
      }

      // Event handlers
      this.eventSource.onopen = () => {
        console.log('[Orders] SSE connection opened successfully')
      }

      this.eventSource.onmessage = handleOrderEvent
      this.eventSource.addEventListener('order_created', handleOrderEvent)
      this.eventSource.addEventListener('order_updated', handleOrderEvent)
      this.eventSource.addEventListener('payment_verified', handleOrderEvent)
      this.eventSource.addEventListener('payment_proof_uploaded', handlePaymentProof)

      this.eventSource.onerror = (error) => {
        console.error('[Orders] SSE connection error:', error)
        console.log('[Orders] EventSource readyState:', this.eventSource?.readyState)
        // EventSource.CONNECTING = 0, EventSource.OPEN = 1, EventSource.CLOSED = 2
        if (this.eventSource?.readyState === EventSource.CLOSED) {
          console.warn('[Orders] SSE connection closed, will attempt reconnection')
        }
      }
    },
    disconnectLiveUpdates() {
      console.log('[Orders] Disconnecting SSE')
      this.eventSource?.close()
      this.eventSource = undefined
    },
    markAsSeen(id: string) {
      this.liveNewOrders.delete(id)
    }
  }
})
