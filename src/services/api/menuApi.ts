import type { MenuCategory, MenuImportPreview, MenuItem } from '@/types'
import http from './http'

export const menuApi = {
  async getMenu(merchantId: string): Promise<MenuCategory[]> {
    const { data } = await http.get(`/api/merchants/${merchantId}/menu`)
    return data
  },
  async toggleAvailability(merchantId: string, itemId: string, isAvailable: boolean): Promise<MenuItem> {
    const { data } = await http.patch(
      `/api/merchants/${merchantId}/menu/items/${itemId}`,
      { isAvailable }
    )
    return data
  },
  async uploadImages(merchantId: string, files: File[]): Promise<{ uploadIds: string[] }> {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    const { data } = await http.post(
      `/api/merchants/${merchantId}/menu-import/uploads`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return data
  },
  async processImport(merchantId: string, uploadIds: string[]): Promise<MenuImportPreview> {
    const { data } = await http.post(`/api/merchants/${merchantId}/menu-import/process`, {
      uploadIds
    })
    return data
  },
  async acceptImported(merchantId: string): Promise<void> {
    await http.post(`/api/merchants/${merchantId}/menu-import/accept`)
  }
}
