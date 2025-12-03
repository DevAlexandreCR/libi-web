<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { useOrdersStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'
import type { OrderStatus } from '@/types'

const { t } = useI18n()
const route = useRoute()
const ordersStore = useOrdersStore()
const auth = useAuthStore()
const notifications = useNotificationStore()

const orderId = computed(() => route.params.id as string)
const proofPreview = ref<string | null>(null)
const proofSrc = computed(() => resolveProofUrl(order.value?.paymentProofUrl))

onMounted(async () => {
  if (auth.merchantId && orderId.value) {
    await ordersStore.fetchById(auth.merchantId, orderId.value)
    ordersStore.markAsSeen(orderId.value)
  }
})

const order = computed(() => ordersStore.selected)

const nextStatuses: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['IN_PREPARATION', 'CANCELLED'],
  IN_PREPARATION: ['READY', 'CANCELLED'],
  DELIVERING: ['DELIVERED'],
  READY: ['DELIVERING', 'DELIVERED'],
  DELIVERED: [],
  CANCELLED: []
}

const updateStatus = async (status: OrderStatus) => {
  if (!auth.merchantId || !order.value) return
  await ordersStore.updateStatus(auth.merchantId, order.value.id, status)
}

const lastInteraction = computed(() => {
  const current = order.value
  if (!current) return ''
  const messages = current.session.messages ?? []
  if (messages.length) {
    const lastMessage = messages[messages.length - 1]
    return lastMessage?.createdAt ?? current.updatedAt
  }
  return current.updatedAt
})

const paymentState = computed(() => {
  const current = order.value
  if (!current) return { label: '', variant: 'neutral' as const }
  if (current.paymentVerified) return { label: t('orders.paymentStatus.verified'), variant: 'success' as const }
  if (current.awaitingPaymentProof && current.paymentProofUrl)
    return { label: t('orders.paymentStatus.proofReceived'), variant: 'info' as const }
  if (current.awaitingPaymentProof) return { label: t('orders.paymentStatus.awaitingProof'), variant: 'warning' as const }
  if (current.paymentProofUrl && !current.paymentVerified)
    return { label: t('orders.paymentStatus.rejected'), variant: 'error' as const }
  return { label: t('orders.paymentStatus.awaitingProof'), variant: 'neutral' as const }
})

const verifyPayment = async (verified: boolean) => {
  if (!auth.merchantId || !order.value) return
  if (verified && !order.value.paymentProofUrl) {
    notifications.push({
      id: crypto.randomUUID(),
      type: 'error',
      title: 'Error',
      message: 'orders.paymentProofMissing'
    })
    return
  }
  await ordersStore.verifyPayment(auth.merchantId, order.value.id, verified)
}

const resolveProofUrl = (url?: string | null) => {
  if (!url) return null
    return `${import.meta.env.VITE_API_BASE_URL}/${url}`
}
</script>

<template>
  <div v-if="order" class="space-y-6">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold">
          {{ t('orders.detail') }} - #{{ order.id }}
        </h1>
        <p class="text-slate-600">{{ new Date(order.createdAt).toLocaleString() }}</p>
      </div>
      <div class="flex gap-2">
        <BaseButton
          v-for="status in nextStatuses[order.status]"
          :key="status"
          size="sm"
          icon="arrow-right"
          @click="updateStatus(status)"
        >
          {{ t(`statuses.${status}`) }}
        </BaseButton>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-4">
      <BaseCard :title="t('orders.items')" class="lg:col-span-2">
        <div class="space-y-3">
          <div v-for="item in order.items" :key="item.id" class="flex items-start justify-between border-b border-border pb-3">
            <div>
              <p class="font-semibold">{{ item.name }}</p>
              <p class="text-xs text-slate-500" v-if="item.options?.length">
                {{ item.options.map((o) => `${o.name} (+$${Number(o.extraPrice).toFixed(2)})`).join(', ') }}
              </p>
            </div>
            <div class="text-right">
              <p class="font-semibold">x{{ item.quantity }}</p>
              <p class="text-sm text-slate-600">${{ (item.quantity * Number(item.unitPrice)).toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </BaseCard>

      <div class="space-y-4">
        <BaseCard :title="t('orders.detail')">
          <div class="space-y-3 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-slate-600">{{ t('orders.customer') }}</span>
              <span class="font-semibold">{{ order.session.customerPhone }}</span>
            </div>
            <div class="flex items-center justify-between" v-if="order.deliveryType">
              <span class="text-slate-600">{{ t('orders.deliveryType') }}</span>
              <span class="font-semibold">{{ order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup' }}</span>
            </div>
            <div v-if="order.address" class="flex items-start justify-between">
              <span class="text-slate-600">{{ t('orders.address') }}</span>
              <span class="font-semibold text-right">{{ order.address }}</span>
            </div>
            <div v-if="order.paymentMethod" class="flex items-center justify-between">
              <span class="text-slate-600">{{ t('orders.paymentMethod') }}</span>
              <span class="font-semibold">{{ order.paymentMethod }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-600">{{ t('orders.total') }}</span>
              <span class="text-lg font-bold">${{ Number(order.estimatedTotal).toFixed(2) }}</span>
            </div>
          </div>
        </BaseCard>

        <BaseCard :title="t('orders.paymentProof')">
          <div class="space-y-3 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-slate-600">{{ t('orders.paymentStatusLabel') }}</span>
              <BaseBadge :variant="paymentState.variant">
                {{ paymentState.label }}
              </BaseBadge>
            </div>
            <div v-if="order.paymentProofUrl" class="space-y-2">
              <img
                :src="proofSrc"
                :alt="t('orders.paymentProof')"
                class="w-full rounded-lg border border-border cursor-pointer hover:opacity-90 transition"
                @click="proofPreview = proofSrc"
              />
              <div class="flex justify-between items-center">
                <span class="text-xs text-slate-500">{{ paymentState.label }}</span>
                <BaseButton size="sm" variant="ghost" icon="eye" @click="proofPreview = proofSrc">
                  {{ t('common.view') }}
                </BaseButton>
              </div>
            </div>
            <p v-else class="text-slate-500">
              {{ order.awaitingPaymentProof ? t('orders.paymentStatus.awaitingProof') : t('orders.paymentStatus.rejected') }}
            </p>
            <div
              v-if="order.awaitingPaymentProof && order.paymentProofUrl"
              class="flex items-center gap-2 pt-2 border-t border-border"
            >
              <BaseButton size="sm" icon="check" :disabled="ordersStore.loadingDetail" @click="verifyPayment(true)">
                {{ t('orders.verifyPayment') }}
              </BaseButton>
              <BaseButton
                size="sm"
                variant="ghost"
                icon="times"
                :disabled="ordersStore.loadingDetail"
                @click="verifyPayment(false)"
              >
                {{ t('orders.rejectPayment') }}
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <BaseCard :title="t('orders.statusTimeline')">
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <BaseBadge :variant="order.status === 'DELIVERED' ? 'success' : 'info'">
            {{ t(`statuses.${order.status}`) }}
          </BaseBadge>
          <span class="text-sm text-slate-600">{{ new Date(order.createdAt).toLocaleString() }}</span>
        </div>
        <div class="flex items-center gap-3">
          <BaseBadge variant="neutral">
            {{ t(`statuses.${order.session.status}`) }}
          </BaseBadge>
          <span class="text-sm text-slate-600">
            {{ t('sessions.lastInteraction') }}:
            {{ new Date(lastInteraction).toLocaleString() }}
          </span>
        </div>
      </div>
    </BaseCard>
    <BaseModal :open="!!proofPreview" :title="t('orders.paymentProof')" @close="proofPreview = null">
      <img v-if="proofPreview" :src="proofPreview" :alt="t('orders.paymentProof')" class="w-full rounded-xl" />
    </BaseModal>
  </div>
  <div v-else class="text-center text-slate-500 py-6">{{ t('common.loading') }}</div>
</template>
