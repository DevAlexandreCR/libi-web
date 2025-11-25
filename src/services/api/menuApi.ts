import type { Menu, MenuImportResult, MenuItem, Upload } from '@/types'
import http from './http'

export const menuApi = {
  async getMenu(merchantId: string): Promise<Menu> {
    const { data } = await http.get(`/merchants/${merchantId}/menus/current`)
    return data
  },
  async toggleAvailability(itemId: string, isAvailable: boolean): Promise<MenuItem> {
    const { data } = await http.patch(`/menu-items/${itemId}/availability`, { isAvailable })
    return data
  },
  async uploadImages(merchantId: string, files: File[]): Promise<Upload[]> {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    const { data } = await http.post(`/merchants/${merchantId}/menu-import/uploads`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  },
  async processImport(merchantId: string, uploadIds: string[]): Promise<MenuImportResult> {
    const { data } = await http.post(`/merchants/${merchantId}/menu-import/process`, {
      uploadIds
    })
    return data
  }
}
