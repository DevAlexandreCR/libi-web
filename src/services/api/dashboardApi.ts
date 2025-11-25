import type { StatsSummary } from '@/types'
import http from './http'

export const dashboardApi = {
  async adminStats(): Promise<StatsSummary> {
    const { data } = await http.get('/api/admin/overview')
    return data
  },
  async merchantStats(merchantId: string): Promise<StatsSummary> {
    const { data } = await http.get(`/api/merchants/${merchantId}/overview`)
    return data
  }
}
