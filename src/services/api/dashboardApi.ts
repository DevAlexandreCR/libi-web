import type { OrderStatus, StatsSummary } from '@/types'
import { merchantsApi } from './merchantsApi'
import { ordersApi } from './ordersApi'
import { whatsappLinesApi } from './whatsappLinesApi'

export const dashboardApi = {
  async adminStats(): Promise<StatsSummary> {
    const merchants = await merchantsApi.list()
    let whatsappLines = 0

    // Aggregate WhatsApp lines per merchant without relying on an admin-specific endpoint.
    await Promise.all(
      merchants.map(async (merchant) => {
        const lines = await whatsappLinesApi.listByMerchant(merchant.id)
        whatsappLines += lines.length
      })
    )

    return {
      merchants: merchants.length,
      whatsappLines,
      orders: undefined,
      dailyOrders: [],
      ordersByStatus: {}
    }
  },
  async merchantStats(merchantId: string): Promise<StatsSummary> {
    const orders = await ordersApi.list(merchantId)
    const ordersByStatus = orders.reduce<Partial<Record<OrderStatus, number>>>((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {})

    const dailyBuckets = orders.reduce<Record<string, number>>((acc, order) => {
      const date = new Date(order.createdAt).toISOString().slice(0, 10)
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    const dailyOrders = Object.entries(dailyBuckets)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([date, count]) => ({ date, count }))

    return {
      orders: orders.length,
      ordersByStatus,
      dailyOrders
    }
  }
}
