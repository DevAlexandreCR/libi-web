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
        this.list = await sessionsApi.list(merchantId, this.filters)
      } finally {
        this.loadingList = false
      }
    },
    async fetchById(_merchantId: string, id: string) {
      this.loadingDetail = true
      try {
        this.selected = await sessionsApi.get(id)
      } finally {
        this.loadingDetail = false
      }
    },
    async pauseSession(sessionId: string) {
      const updated = await sessionsApi.pause(sessionId)
      console.log('🔴 Respuesta de pause:', updated)
      console.log('🔴 manualMode en respuesta:', updated.manualMode)
      if (this.selected?.id === sessionId) {
        // Forzar reactividad actualizando el objeto completo
        const messages = updated.messages || this.selected.messages
        const orders = updated.orders || this.selected.orders
        // ⚠️ WORKAROUND: Si manualMode viene undefined, forzar a true (ya que pauseSession debería activarlo)
        const manualMode = updated.manualMode !== undefined ? updated.manualMode : true
        this.selected = { ...updated, manualMode, messages, orders }
        console.log('🔴 Session después de actualizar:', this.selected)
        console.log('🔴 manualMode después:', this.selected.manualMode)
      }
      const index = this.list.findIndex(s => s.id === sessionId)
      if (index !== -1) {
        const messages = updated.messages || this.list[index].messages
        const orders = updated.orders || this.list[index].orders
        const manualMode = updated.manualMode !== undefined ? updated.manualMode : true
        this.list[index] = { ...updated, manualMode, messages, orders }
      }
      return updated
    },
    async resumeSession(sessionId: string) {
      const updated = await sessionsApi.resume(sessionId)
      console.log('🟢 Respuesta de resume:', updated)
      console.log('🟢 manualMode en respuesta:', updated.manualMode)
      if (this.selected?.id === sessionId) {
        // Forzar reactividad actualizando el objeto completo
        const messages = updated.messages || this.selected.messages
        const orders = updated.orders || this.selected.orders
        // ⚠️ WORKAROUND: Si manualMode viene undefined, forzar a false (ya que resumeSession debería desactivarlo)
        const manualMode = updated.manualMode !== undefined ? updated.manualMode : false
        this.selected = { ...updated, manualMode, messages, orders }
        console.log('🟢 Session después de actualizar:', this.selected)
        console.log('🟢 manualMode después:', this.selected.manualMode)
      }
      const index = this.list.findIndex(s => s.id === sessionId)
      if (index !== -1) {
        const messages = updated.messages || this.list[index].messages
        const orders = updated.orders || this.list[index].orders
        const manualMode = updated.manualMode !== undefined ? updated.manualMode : false
        this.list[index] = { ...updated, manualMode, messages, orders }
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
