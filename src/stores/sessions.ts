import { defineStore } from 'pinia'
import { sessionsApi } from '@/services/api'
import type { Session, SessionStatus } from '@/types'

interface SessionState {
  list: Session[]
  selected: Session | null
  loadingList: boolean
  loadingDetail: boolean
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
    }
  }
})
