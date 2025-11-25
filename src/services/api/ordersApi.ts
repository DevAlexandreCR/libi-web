import type { Order, OrderStatus, PaginationMeta } from '@/types'
import http from './http'

export interface OrderFilters {
  status?: OrderStatus[] | string[]
  fromDate?: string
  toDate?: string
  search?: string
  page?: number
  pageSize?: number
}

export interface OrderListResponse {
  data: Order[]
  meta?: PaginationMeta
}

export const ordersApi = {
  async list(merchantId: string, filters: OrderFilters = {}): Promise<OrderListResponse> {
    const params = { ...filters, status: filters.status?.join(',') }
    const { data } = await http.get(`/api/merchants/${merchantId}/orders`, { params })
    return data
  },
  async get(merchantId: string, orderId: string): Promise<Order> {
    const { data } = await http.get(`/api/merchants/${merchantId}/orders/${orderId}`)
    return data
  },
  async updateStatus(merchantId: string, orderId: string, status: OrderStatus): Promise<Order> {
    const { data } = await http.post(`/api/merchants/${merchantId}/orders/${orderId}/status`, {
      status
    })
    return data
  }
}
