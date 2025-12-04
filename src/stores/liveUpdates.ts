import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { useOrdersStore } from './orders'
import { useSessionsStore } from './sessions'
import { useMerchantStore } from './merchants'
import { useNotificationStore } from './notifications'
import { notificationSoundService } from '@/services/notificationSound'
import http from '@/services/api/http'
import type { Order, Session } from '@/types'

interface LiveUpdatesState {
  eventSource?: EventSource
  connected: boolean
  merchantId: string | null
}

export const useLiveUpdatesStore = defineStore('liveUpdates', {
  state: (): LiveUpdatesState => ({
    eventSource: undefined,
    connected: false,
    merchantId: null
  }),
  actions: {
    connect(merchantId: string) {
      // Si ya está conectado al mismo merchant, no reconectar
      if (this.eventSource && this.merchantId === merchantId && this.connected) {
        console.log('[LiveUpdates] Already connected to merchant:', merchantId)
        return
      }

      // Desconectar cualquier conexión existente
      this.disconnect()

      const auth = useAuthStore()
      const merchantStore = useMerchantStore()

      // Inicializar el servicio de sonido con la configuración del merchant
      if (merchantStore.selected) {
        notificationSoundService.initialize(
          merchantStore.selected.notificationSoundEnabled ?? true,
          merchantStore.selected.notificationSoundVolume ?? 0.7
        )
      }

      const base = http.defaults.baseURL
      const url = new URL(`${base}/merchants/${merchantId}/stream`)
      if (auth.token) {
        url.searchParams.set('token', auth.token)
      }

      console.log('[LiveUpdates] Connecting to SSE:', url.toString())
      this.eventSource = new EventSource(url.toString())
      this.merchantId = merchantId

      console.log('[LiveUpdates] EventSource created, readyState:', this.eventSource.readyState)

      // Handlers para diferentes tipos de eventos
      const handleOrderEvent = (event: MessageEvent) => {
        try {
          console.log('[LiveUpdates] Received order event:', event.type, event.data)
          const payload = JSON.parse(event.data) as Order
          const ordersStore = useOrdersStore()

          // order_updated NO incluye items según la API, hacer merge con datos existentes
          const existingOrder = ordersStore.list.find((o) => o.id === payload.id)
          const mergedPayload =
            event.type === 'order_updated' && existingOrder
              ? { ...payload, items: existingOrder.items }
              : payload

          ordersStore.list = [mergedPayload, ...ordersStore.list.filter((o) => o.id !== payload.id)]
          ordersStore.liveNewOrders.add(payload.id)

          // Hacer merge también para el pedido seleccionado
          if (ordersStore.selected?.id === payload.id) {
            ordersStore.selected =
              event.type === 'order_updated'
                ? { ...ordersStore.selected, ...payload, items: ordersStore.selected.items }
                : mergedPayload
          }

          // Mostrar notificación visual
          const notificationStore = useNotificationStore()
          if (event.type === 'order_created') {
            notificationStore.push({
              id: crypto.randomUUID(),
              type: 'order',
              title: '🔔 Nuevo Pedido',
              message: `Pedido #${payload.id} - $${Number(payload.estimatedTotal).toFixed(2)}`,
              durationMs: 10000
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
          console.error('[LiveUpdates] Failed to parse order event:', error, event)
        }
      }

      const handlePaymentProof = (event: MessageEvent) => {
        try {
          console.log('[LiveUpdates] Received payment proof event:', event.data)
          const payload = JSON.parse(event.data) as { orderId: string; paymentProofUrl?: string }
          const ordersStore = useOrdersStore()

          ordersStore.list = ordersStore.list.map((o) =>
            o.id === payload.orderId
              ? { ...o, paymentProofUrl: payload.paymentProofUrl, awaitingPaymentProof: true, paymentVerified: false }
              : o
          )
          ordersStore.liveNewOrders.add(payload.orderId)

          if (ordersStore.selected?.id === payload.orderId) {
            ordersStore.selected = {
              ...ordersStore.selected,
              paymentProofUrl: payload.paymentProofUrl,
              awaitingPaymentProof: true,
              paymentVerified: false
            }
          }

          // Mostrar notificación visual y sonido
          useNotificationStore().push({
            id: crypto.randomUUID(),
            type: 'order',
            title: '📸 Comprobante Recibido',
            message: `Pedido #${payload.orderId} - Comprobante de pago cargado`,
            durationMs: 10000
          })
          notificationSoundService.play('payment_proof_uploaded')
        } catch (error) {
          console.error('[LiveUpdates] Failed to parse payment proof event:', error, event)
        }
      }

      const handleSessionEvent = (event: MessageEvent) => {
        try {
          console.log('[LiveUpdates] Received session event:', event.type, event.data)
          const payload = JSON.parse(event.data) as Session
          const sessionsStore = useSessionsStore()

          // Actualizar o agregar la sesión en la lista
          const existingIndex = sessionsStore.list.findIndex((s) => s.id === payload.id)
          if (existingIndex !== -1) {
            sessionsStore.list[existingIndex] = payload
          } else {
            sessionsStore.list = [payload, ...sessionsStore.list]
          }

          // Actualizar sesión seleccionada si corresponde
          if (sessionsStore.selected?.id === payload.id) {
            sessionsStore.selected = payload
          }

          // Notificaciones según el tipo de evento
          const notificationStore = useNotificationStore()
          if (event.type === 'session_created') {
            notificationStore.push({
              id: crypto.randomUUID(),
              type: 'info',
              title: '💬 Nueva Conversación',
              message: `Cliente: ${payload.customerPhone}`,
              durationMs: 8000
            })
            notificationSoundService.play('session_created')
          } else if (event.type === 'session_updated') {
            console.log('[LiveUpdates] Session updated:', payload.id)
          }
        } catch (error) {
          console.error('[LiveUpdates] Failed to parse session event:', error, event)
        }
      }

      const handleMessageEvent = (event: MessageEvent) => {
        try {
          console.log('[LiveUpdates] Received message event:', event.data)
          const payload = JSON.parse(event.data) as {
            sessionId: string
            message: {
              id: string
              role: 'user' | 'assistant'
              content: string
              createdAt: string
            }
          }
          const sessionsStore = useSessionsStore()

          // Actualizar la sesión con el nuevo mensaje
          const session = sessionsStore.list.find((s) => s.id === payload.sessionId)
          if (session && session.messages) {
            session.messages.push(payload.message)
            session.lastInteractionAt = payload.message.createdAt
          }

          // Actualizar sesión seleccionada si corresponde
          if (sessionsStore.selected?.id === payload.sessionId && sessionsStore.selected.messages) {
            sessionsStore.selected.messages.push(payload.message)
            sessionsStore.selected.lastInteractionAt = payload.message.createdAt
          }

          // Notificación solo para mensajes de usuario
          if (payload.message.role === 'user') {
            useNotificationStore().push({
              id: crypto.randomUUID(),
              type: 'info',
              title: '📨 Nuevo Mensaje',
              message: `Cliente: ${session?.customerPhone || 'Desconocido'}`,
              durationMs: 6000
            })
            notificationSoundService.play('message_received')
          }
        } catch (error) {
          console.error('[LiveUpdates] Failed to parse message event:', error, event)
        }
      }

      const handleConnected = (event: MessageEvent) => {
        console.log('[LiveUpdates] SSE connected event received:', event.data)
        this.connected = true
        try {
          const data = JSON.parse(event.data)
          console.log('[LiveUpdates] Connection confirmed:', data)
        } catch (error) {
          console.log('[LiveUpdates] Connected with message:', event.data)
        }
      }

      // Event handlers
      this.eventSource.onopen = () => {
        console.log('[LiveUpdates] SSE connection opened (onopen fired)')
        this.connected = true
      }

      // IMPORTANTE: El evento 'message' sin tipo específico captura eventos sin 'event: ' prefix
      this.eventSource.onmessage = (event) => {
        console.log('[LiveUpdates] Received default message event:', event.data)
        // Podría ser el mensaje inicial de conexión
        try {
          const data = JSON.parse(event.data)
          console.log('[LiveUpdates] Default message data:', data)
        } catch (error) {
          console.log('[LiveUpdates] Default message (not JSON):', event.data)
        }
      }

      // Event listeners para eventos tipados
      this.eventSource.addEventListener('connected', handleConnected)

      // Eventos de pedidos
      this.eventSource.addEventListener('order_created', handleOrderEvent)
      this.eventSource.addEventListener('order_updated', handleOrderEvent)
      this.eventSource.addEventListener('payment_verified', handleOrderEvent)
      this.eventSource.addEventListener('payment_proof_uploaded', handlePaymentProof)

      // Eventos de sesiones
      this.eventSource.addEventListener('session_created', handleSessionEvent)
      this.eventSource.addEventListener('session_updated', handleSessionEvent)

      // Eventos de mensajes
      this.eventSource.addEventListener('message_received', handleMessageEvent)

      // Debug: Verificar estado después de 2 segundos
      setTimeout(() => {
        console.log('[LiveUpdates] EventSource state after 2s:', {
          readyState: this.eventSource?.readyState,
          url: this.eventSource?.url,
          withCredentials: this.eventSource?.withCredentials,
          connected: this.connected
        })
      }, 2000)

      this.eventSource.onerror = (error) => {
        console.error('[LiveUpdates] SSE connection error:', error)
        console.log('[LiveUpdates] EventSource readyState:', this.eventSource?.readyState)
        this.connected = false

        // EventSource.CONNECTING = 0, EventSource.OPEN = 1, EventSource.CLOSED = 2
        if (this.eventSource?.readyState === EventSource.CLOSED) {
          console.warn('[LiveUpdates] SSE connection closed, EventSource will auto-reconnect')
        } else if (this.eventSource?.readyState === EventSource.CONNECTING) {
          console.log('[LiveUpdates] SSE reconnecting...')
        }
      }
    },

    disconnect() {
      if (this.eventSource) {
        console.log('[LiveUpdates] Disconnecting SSE')
        this.eventSource.close()
        this.eventSource = undefined
        this.connected = false
        this.merchantId = null
      }
    }
  }
})
