<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useOrdersStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'
import type { OrderStatus } from '@/types'

const { t } = useI18n()
const route = useRoute()
const ordersStore = useOrdersStore()
const auth = useAuthStore()

const orderId = computed(() => route.params.id as string)

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
  READY: ['DELIVERED'],
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
  </div>
  <div v-else class="text-center text-slate-500 py-6">{{ t('common.loading') }}</div>
</template>
