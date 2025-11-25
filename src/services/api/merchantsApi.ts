import type { Merchant, PaginationMeta } from '@/types'
import http from './http'

export interface MerchantFilters {
  search?: string
  status?: string
  page?: number
  pageSize?: number
}

export interface MerchantListResponse {
  data: Merchant[]
  meta?: PaginationMeta
}

export const merchantsApi = {
  async list(filters: MerchantFilters = {}): Promise<MerchantListResponse> {
    const { data } = await http.get('/api/merchants', { params: filters })
    return data
  },
  async get(id: string): Promise<Merchant> {
    const { data } = await http.get(`/api/merchants/${id}`)
    return data
  },
  async create(payload: Partial<Merchant>): Promise<Merchant> {
    const { data } = await http.post('/api/merchants', payload)
    return data
  },
  async update(id: string, payload: Partial<Merchant>): Promise<Merchant> {
    const { data } = await http.put(`/api/merchants/${id}`, payload)
    return data
  },
  async remove(id: string): Promise<void> {
    await http.delete(`/api/merchants/${id}`)
  }
}
