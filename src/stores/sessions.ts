import { defineStore } from 'pinia'
import { sessionsApi } from '@/services/api'
import type { Session, SessionStatus } from '@/types'

interface SessionState {
  list: Session[]
  selected: Session | null
  loadingList: boolean
  loadingDetail: boolean
  sendingMessage: boolean
  filters: {
    status?: SessionStatus | ''
    from?: string
    to?: string
  }
}

export const useSessionsStore = defineStore('sessions', {
  state: (): SessionState => ({
    list: [],
    selected: null,
    loadingList: false,
    loadingDetail: false,
    sendingMessage: false,
    filters: {}
  }),
  actions: {
    async fetch(merchantId: string) {
      this.loadingList = true
      try {
        const sessions = await sessionsApi.list(merchantId, this.filters)
        // ⚠️ WORKAROUND: Si isManualMode viene undefined, asumir false
        this.list = sessions.map(session => ({
          ...session,
          isManualMode: session.isManualMode !== undefined ? session.isManualMode : false
        }))
      } finally {
        this.loadingList = false
      }
    },
    async fetchById(_merchantId: string, id: string) {
      this.loadingDetail = true
      try {
        const session = await sessionsApi.get(id)
        // ⚠️ WORKAROUND: Si isManualMode viene undefined, asumir false (modo automático por defecto)
        if (session.isManualMode === undefined) {
          console.warn('⚠️ isManualMode undefined en GET, asumiendo false')
          this.selected = { ...session, isManualMode: false }
        } else {
          this.selected = session
        }
      } finally {
        this.loadingDetail = false
      }
    },
    async pauseSession(sessionId: string) {
      const updated = await sessionsApi.pause(sessionId)
      console.log('🔴 Respuesta de pause:', updated)
      console.log('🔴 isManualMode en respuesta:', updated.isManualMode)
      if (this.selected?.id === sessionId) {
        // Forzar reactividad actualizando el objeto completo
        const messages = updated.messages || this.selected.messages
        const orders = updated.orders || this.selected.orders
        // ⚠️ WORKAROUND: Si isManualMode viene undefined, forzar a true (ya que pauseSession debería activarlo)
        const isManualMode = updated.isManualMode !== undefined ? updated.isManualMode : true
        this.selected = { ...updated, isManualMode, messages, orders }
        console.log('🔴 Session después de actualizar:', this.selected)
        console.log('🔴 isManualMode después:', this.selected.isManualMode)
      }
      const index = this.list.findIndex(s => s.id === sessionId)
      if (index !== -1) {
        const messages = updated.messages || this.list[index].messages
        const orders = updated.orders || this.list[index].orders
        const isManualMode = updated.isManualMode !== undefined ? updated.isManualMode : true
        this.list[index] = { ...updated, isManualMode, messages, orders }
      }
      return updated
    },
    async resumeSession(sessionId: string) {
      const updated = await sessionsApi.resume(sessionId)
      console.log('🟢 Respuesta de resume:', updated)
      console.log('🟢 isManualMode en respuesta:', updated.isManualMode)
      if (this.selected?.id === sessionId) {
        // Forzar reactividad actualizando el objeto completo
        const messages = updated.messages || this.selected.messages
        const orders = updated.orders || this.selected.orders
        // ⚠️ WORKAROUND: Si isManualMode viene undefined, forzar a false (ya que resumeSession debería desactivarlo)
        const isManualMode = updated.isManualMode !== undefined ? updated.isManualMode : false
        this.selected = { ...updated, isManualMode, messages, orders }
        console.log('🟢 Session después de actualizar:', this.selected)
        console.log('🟢 isManualMode después:', this.selected.isManualMode)
      }
      const index = this.list.findIndex(s => s.id === sessionId)
      if (index !== -1) {
        const messages = updated.messages || this.list[index].messages
        const orders = updated.orders || this.list[index].orders
        const isManualMode = updated.isManualMode !== undefined ? updated.isManualMode : false
        this.list[index] = { ...updated, isManualMode, messages, orders }
      }
      return updated
    },
    async sendMessage(sessionId: string, message: string) {
      this.sendingMessage = true
      try {
        const result = await sessionsApi.sendMessage(sessionId, message)
        if (this.selected?.id === sessionId && this.selected.messages) {
          this.selected.messages.push({
            id: result.messageId,
            role: 'assistant',
            content: message,
            createdAt: new Date().toISOString()
          })
        }
        return result
      } finally {
        this.sendingMessage = false
      }
    }
  }
})
