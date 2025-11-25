import { defineStore } from 'pinia'
import { menuApi } from '@/services/api'
import type { MenuCategory, MenuImportPreview } from '@/types'
import { useNotificationStore } from './notifications'

interface MenuState {
  categories: MenuCategory[]
  preview: MenuImportPreview | null
  loading: boolean
  processing: boolean
}

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    categories: [],
    preview: null,
    loading: false,
    processing: false
  }),
  actions: {
    async fetch(merchantId: string) {
      this.loading = true
      try {
        this.categories = await menuApi.getMenu(merchantId)
      } finally {
        this.loading = false
      }
    },
    async toggleAvailability(merchantId: string, itemId: string, isAvailable: boolean) {
      const existing = this.categories.flatMap((c) => c.items).find((i) => i.id === itemId)
      if (existing) existing.isAvailable = isAvailable
      const updated = await menuApi.toggleAvailability(merchantId, itemId, isAvailable)
      this.categories = this.categories.map((category) => ({
        ...category,
        items: category.items.map((item) => (item.id === itemId ? updated : item))
      }))
    },
    async uploadAndProcess(merchantId: string, files: File[]) {
      this.processing = true
      try {
        const { uploadIds } = await menuApi.uploadImages(merchantId, files)
        this.preview = await menuApi.processImport(merchantId, uploadIds)
      } finally {
        this.processing = false
      }
    },
    async acceptImport(merchantId: string) {
      this.processing = true
      try {
        await menuApi.acceptImported(merchantId)
        this.preview = null
        await this.fetch(merchantId)
        useNotificationStore().push({
          id: crypto.randomUUID(),
          type: 'success',
          title: 'Success',
          message: 'notifications.updateSuccess'
        })
      } finally {
        this.processing = false
      }
    }
  }
})
