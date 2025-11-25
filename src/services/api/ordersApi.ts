import type { Order, OrderStatus } from '@/types'
import http from './http'

export interface OrderFilters {
  status?: OrderStatus
  from?: string
  to?: string
  phone?: string
}

export const ordersApi = {
  async list(merchantId: string, filters: OrderFilters = {}): Promise<Order[]> {
    const { data } = await http.get(`/merchants/${merchantId}/orders`, { params: filters })
    return data
  },
  async get(orderId: string): Promise<Order> {
    const { data } = await http.get(`/orders/${orderId}`)
    return data
  },
  async updateStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const { data } = await http.patch(`/orders/${orderId}/status`, {
      status
    })
    return data
  }
}
