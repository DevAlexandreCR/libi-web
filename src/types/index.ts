export type UserRole = 'SUPER_ADMIN' | 'MERCHANT_ADMIN'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  merchantId?: string
}

export type MerchantStatus = 'ACTIVE' | 'INACTIVE'

export interface Merchant {
  id: string
  name: string
  slug: string
  address?: string
  status: MerchantStatus
  createdAt: string
}

export interface WhatsAppLine {
  id: string
  merchantId: string
  merchantName?: string
  phone: string
  displayPhoneNumber?: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  phoneNumberId?: string
  wabaId?: string
  accessToken?: string
}

export type OrderStatus = 'PENDING' | 'IN_PREPARATION' | 'READY' | 'DELIVERED' | 'CANCELLED'

export interface OrderItemOption {
  name: string
  value: string
}

export interface OrderItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
  options?: OrderItemOption[]
}

export interface OrderTimeline {
  status: OrderStatus
  timestamp: string
}

export interface Order {
  id: string
  merchantId: string
  customerPhone: string
  status: OrderStatus
  total: number
  createdAt: string
  deliveryType?: 'DELIVERY' | 'PICKUP'
  address?: string
  paymentMethod?: string
  notes?: string
  items: OrderItem[]
  timeline?: OrderTimeline[]
}

export type SessionStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'

export interface SessionMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export interface Session {
  id: string
  merchantId: string
  customerPhone: string
  status: SessionStatus
  orderId?: string
  lastInteractionAt: string
  messages?: SessionMessage[]
}

export interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  isAvailable: boolean
  imageUrl?: string
}

export interface MenuCategory {
  id: string
  name: string
  items: MenuItem[]
}

export interface MenuImportPreview {
  categories: MenuCategory[]
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
}

export interface StatsSummary {
  merchants?: number
  orders?: number
  whatsappLines?: number
  dailyOrders?: { date: string; count: number }[]
  ordersByStatus?: Record<string, number>
}
