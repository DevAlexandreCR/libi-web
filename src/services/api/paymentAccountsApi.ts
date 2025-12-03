import type { PaymentAccount, PaymentAccountType } from '@/types'
import http from './http'

export interface PaymentAccountInput {
  type: PaymentAccountType
  accountNumber: string
  accountHolder: string
  bankName?: string
  description?: string
  isActive: boolean
}

export const paymentAccountsApi = {
  async list(merchantId: string): Promise<PaymentAccount[]> {
    const { data } = await http.get(`/merchants/${merchantId}/payment-accounts`)
    return data
  },
  async get(merchantId: string, id: string): Promise<PaymentAccount> {
    const { data } = await http.get(`/merchants/${merchantId}/payment-accounts/${id}`)
    return data
  },
  async create(merchantId: string, payload: PaymentAccountInput): Promise<PaymentAccount> {
    const { data } = await http.post(`/merchants/${merchantId}/payment-accounts`, payload)
    return data
  },
  async update(merchantId: string, id: string, payload: Partial<PaymentAccountInput>): Promise<PaymentAccount> {
    const { data } = await http.put(`/merchants/${merchantId}/payment-accounts/${id}`, payload)
    return data
  },
  async remove(merchantId: string, id: string): Promise<void> {
    await http.delete(`/merchants/${merchantId}/payment-accounts/${id}`)
  }
}
