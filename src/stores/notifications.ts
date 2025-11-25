import { defineStore } from 'pinia'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  title?: string
  message: string
  type: ToastType
  durationMs?: number
}

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    toasts: [] as Toast[]
  }),
  actions: {
    push(toast: Toast) {
      this.toasts.push({ durationMs: 4000, ...toast })
    },
    remove(id: string) {
      this.toasts = this.toasts.filter((t) => t.id !== id)
    }
  }
})
