<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import { useOrdersStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'
import type { OrderStatus } from '@/types'

const { t } = useI18n()
const router = useRouter()
const ordersStore = useOrdersStore()
const auth = useAuthStore()
const statusFilter = ref<OrderStatus | ''>('')

const fetchOrders = async () => {
  if (!auth.merchantId) return
  ordersStore.filters.status = statusFilter.value
  await ordersStore.fetch(auth.merchantId)
}

onMounted(() => {
  fetchOrders()
  if (auth.merchantId) ordersStore.connectLiveUpdates(auth.merchantId)
})

onUnmounted(() => {
  ordersStore.disconnectLiveUpdates()
})

const statusVariant = (status: string) => {
  if (status === 'PENDING') return 'warning'
  if (status === 'IN_PREPARATION' || status === 'READY') return 'info'
  if (status === 'DELIVERED') return 'success'
  return 'neutral'
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold">{{ t('orders.title') }}</h1>
        <p class="text-slate-600">{{ t('landing.heroSubtitle') }}</p>
      </div>
      <BaseButton variant="secondary" icon="arrow-right" @click="fetchOrders">
        {{ t('common.apply') }}
      </BaseButton>
    </div>

      <BaseCard>
        <div class="grid sm:grid-cols-3 gap-4 mb-4">
          <BaseInput v-model="ordersStore.filters.phone" :label="t('orders.filters.search')" icon="search" />
          <BaseInput v-model="ordersStore.filters.from" :label="t('orders.filters.dateRange')" type="date" />
          <BaseInput v-model="ordersStore.filters.to" :label="' '" type="date" />
        <BaseSelect
          v-model="statusFilter"
          :label="t('orders.filters.status')"
          :options="[
            { label: t('statuses.PENDING'), value: 'PENDING' },
            { label: t('statuses.IN_PREPARATION'), value: 'IN_PREPARATION' },
            { label: t('statuses.READY'), value: 'READY' },
            { label: t('statuses.DELIVERED'), value: 'DELIVERED' },
            { label: t('statuses.CANCELLED'), value: 'CANCELLED' }
          ]"
          :placeholder="t('common.status')"
        />
        <div class="flex items-end">
          <BaseButton class="w-full" @click="fetchOrders">{{ t('common.apply') }}</BaseButton>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-slate-500">
              <th class="py-2">{{ t('orders.orderId') }}</th>
              <th class="py-2">{{ t('orders.customer') }}</th>
              <th class="py-2">{{ t('orders.total') }}</th>
              <th class="py-2">{{ t('orders.status') }}</th>
              <th class="py-2">{{ t('orders.createdAt') }}</th>
              <th class="py-2 text-right">{{ t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in ordersStore.list"
              :key="order.id"
              class="border-t border-border/60"
              :class="ordersStore.liveNewOrders.has(order.id) ? 'bg-primary-50/50 animate-pulseSoft' : ''"
            >
              <td class="py-3 font-semibold">#{{ order.id }}</td>
              <td class="py-3">
                {{ order.session.customerPhone.slice(0, -4).replace(/[0-9]/g, '*') + order.session.customerPhone.slice(-4) }}
              </td>
              <td class="py-3 font-semibold">${{ Number(order.estimatedTotal).toFixed(2) }}</td>
              <td class="py-3">
                <BaseBadge :variant="statusVariant(order.status)">
                  {{ t(`statuses.${order.status}`) }}
                </BaseBadge>
              </td>
              <td class="py-3">{{ new Date(order.createdAt).toLocaleString() }}</td>
              <td class="py-3 text-right">
                <BaseButton
                  variant="ghost"
                  size="sm"
                  icon="eye"
                  @click="router.push({ name: 'merchant-order-detail', params: { id: order.id } })"
                >
                  {{ t('common.view') }}
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="ordersStore.loadingList" class="text-center text-slate-500 py-6">
          {{ t('common.loading') }}
        </div>
      </div>
    </BaseCard>
  </div>
</template>
