import { defineStore } from 'pinia'
import { sessionsApi } from '@/services/api'
import type { Session } from '@/types'

interface SessionState {
  list: Session[]
  selected: Session | null
  loadingList: boolean
  loadingDetail: boolean
  filters: {
    status?: string
    fromDate?: string
    toDate?: string
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
        const { data } = await sessionsApi.list(merchantId, this.filters)
        this.list = data
      } finally {
        this.loadingList = false
      }
    },
    async fetchById(merchantId: string, id: string) {
      this.loadingDetail = true
      try {
        this.selected = await sessionsApi.get(merchantId, id)
      } finally {
        this.loadingDetail = false
      }
    }
  }
})
