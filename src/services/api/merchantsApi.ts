import type { Merchant } from '@/types'
import http from './http'

export interface MerchantFilters {
  search?: string
}

export const merchantsApi = {
  async list(filters: MerchantFilters = {}): Promise<Merchant[]> {
    const { data } = await http.get('/merchants', { params: filters })
    return data
  },
  async get(id: string): Promise<Merchant> {
    const { data } = await http.get(`/merchants/${id}`)
    return data
  },
  async create(payload: Partial<Merchant>): Promise<Merchant> {
    const { data } = await http.post('/merchants', payload)
    return data
  },
  async update(id: string, payload: Partial<Merchant>): Promise<Merchant> {
    const { data } = await http.put(`/merchants/${id}`, payload)
    return data
  },
  async remove(id: string): Promise<void> {
    await http.delete(`/merchants/${id}`)
  }
}
