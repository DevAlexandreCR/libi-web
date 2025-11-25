import { defineStore } from 'pinia'
import { menuApi } from '@/services/api'
import type { Menu, MenuItem } from '@/types'
import { useNotificationStore } from './notifications'

interface MenuState {
  menu: Menu | null
  preview: Menu | null
  previewJson: unknown | null
  loading: boolean
  processing: boolean
}

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    menu: null,
    preview: null,
    previewJson: null,
    loading: false,
    processing: false
  }),
  actions: {
    async fetch(merchantId: string) {
      this.loading = true
      try {
        this.menu = await menuApi.getMenu(merchantId)
      } finally {
        this.loading = false
      }
    },
    async toggleAvailability(itemId: string, isAvailable: boolean) {
      if (this.menu) {
        this.menu = {
          ...this.menu,
          categories: this.menu.categories.map((category) => ({
            ...category,
            items: category.items.map((item) =>
              item.id === itemId ? { ...item, isAvailable } : item
            )
          }))
        }
      }
      const updated = await menuApi.toggleAvailability(itemId, isAvailable)
      const updateItem = (item: MenuItem) => (item.id === itemId ? updated : item)
      if (this.menu) {
        this.menu = {
          ...this.menu,
          categories: this.menu.categories.map((category) => ({
            ...category,
            items: category.items.map(updateItem)
          }))
        }
      }
    },
    async uploadAndProcess(merchantId: string, files: File[]) {
      this.processing = true
      try {
        const uploads = await menuApi.uploadImages(merchantId, files)
        const uploadIds = uploads.map((u) => u.id)
        const result = await menuApi.processImport(merchantId, uploadIds)
        this.preview = result.menu
        this.previewJson = result.menuJson
        this.menu = result.menu
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
