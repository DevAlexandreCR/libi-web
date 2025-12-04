export type UserRole = 'SUPER_ADMIN' | 'MERCHANT_ADMIN'
export type WhatsAppLineStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING_CONFIG'
export type OrderStatus =
  | 'PENDING'
  | 'IN_PREPARATION'
  | 'READY'
  | 'DELIVERING'
  | 'DELIVERED'
  | 'CANCELLED'
export type SessionStatus =
  | 'NEW'
  | 'COLLECTING_ITEMS'
  | 'REVIEWING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'EXPIRED'
export type DeliveryType = 'delivery' | 'pickup'
export type MessageRole = 'user' | 'assistant' | 'system'

export interface User {
  id: string
  email: string
  role: UserRole
  merchantId: string | null
}

export interface Merchant {
  id: string
  name: string
  slug: string
  description?: string | null
  address?: string | null
  phone?: string | null
  timezone?: string | null
  notificationSoundEnabled?: boolean
  notificationSoundVolume?: number
  createdAt: string
  updatedAt: string
}

export interface WhatsAppLine {
  id: string
  merchantId: string
  wabaId?: string | null
  phoneNumberId?: string | null
  phoneNumber?: string | null
  phoneDisplayName?: string | null
  metaBusinessId?: string | null
  metaAccessToken?: string | null
  status: WhatsAppLineStatus
  createdAt: string
  updatedAt: string
  merchantName?: string
}

export interface MenuOption {
  id: string
  name: string
  extraPrice: string
  position: number
}

export interface MenuOptionGroup {
  id: string
  name: string
  type: 'SINGLE' | 'MULTIPLE'
  isRequired: boolean
  min: number
  max: number
  position: number
  options: MenuOption[]
}

export interface MenuItem {
  id: string
  name: string
  description?: string | null
  basePrice: string
  isAvailable: boolean
  position: number
  imageUrl?: string | null
  optionGroups: MenuOptionGroup[]
}

export interface MenuCategory {
  id: string
  name: string
  description?: string | null
  position: number
  items: MenuItem[]
}

export interface Menu {
  id: string
  merchantId: string
  name: string
  isActive: boolean
  categories: MenuCategory[]
}

export interface MenuImportResult {
  menuJson: unknown
  menu: Menu
}

export type PaymentAccountType = 'NEQUI' | 'BANCOLOMBIA' | 'DAVIPLATA' | 'BANK_ACCOUNT' | 'OTHER'

export interface PaymentAccount {
  id: string
  merchantId: string
  type: PaymentAccountType
  accountNumber: string
  accountHolder: string
  bankName?: string | null
  description?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Upload {
  id: string
  merchantId: string
  fileName: string
  filePath: string
  mimeType: string
  size: number
  createdAt: string
}

export interface OrderItemOption {
  id: string
  menuItemOptionId?: string | null
  name: string
  extraPrice: string
}

export interface OrderItem {
  id: string
  menuItemId?: string | null
  name: string
  quantity: number
  unitPrice: string
  subtotal: string
  options: OrderItemOption[]
}

export interface SessionMessage {
  id: string
  role: MessageRole
  content: string
  createdAt: string
}

export interface OrderSessionSummary {
  id: string
  customerPhone: string
  status: SessionStatus
  state: Record<string, unknown> | null
  messages?: SessionMessage[]
}

export interface Order {
  id: string
  merchantId: string
  sessionId: string
  status: OrderStatus
  deliveryType: DeliveryType
  address?: string | null
  paymentMethod?: string | null
  notes?: string | null
  estimatedTotal: string
  paymentProofUrl?: string | null
  paymentVerified: boolean
  awaitingPaymentProof: boolean
  items: OrderItem[]
  session: OrderSessionSummary
  createdAt: string
  updatedAt: string
}

export interface SessionOrderSummary {
  id: string
  status: OrderStatus
  estimatedTotal: string
  createdAt: string
}

export interface Session {
  id: string
  merchantId: string
  whatsappLineId: string
  customerPhone: string
  status: SessionStatus
  state: Record<string, unknown> | null
  isManualMode: boolean
  lastInteractionAt: string
  messages?: SessionMessage[]
  orders?: SessionOrderSummary[]
}

export interface StatsSummary {
  merchants?: number
  orders?: number
  whatsappLines?: number
  dailyOrders?: { date: string; count: number }[]
  ordersByStatus?: Partial<Record<OrderStatus, number>>
}
