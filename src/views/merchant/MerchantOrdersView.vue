<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseToggle from '@/components/base/BaseToggle.vue'
import { useOrdersStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'
import type { Order, OrderStatus } from '@/types'

const { t } = useI18n()
const router = useRouter()
const ordersStore = useOrdersStore()
const auth = useAuthStore()
const statusFilter = ref<OrderStatus | ''>('')
const awaitingProofOnly = ref(false)
const activeOrderStatuses: OrderStatus[] = ['PENDING', 'IN_PREPARATION', 'READY', 'DELIVERING']

const maskPhone = (phone: string) => phone.slice(0, -4).replace(/[0-9]/g, '*') + phone.slice(-4)
const activeOrdersByStatus = computed(() => {
  const list = Array.isArray(ordersStore.list) ? ordersStore.list : []
  const active = list.filter(order => order && activeOrderStatuses.includes(order.status))
  return activeOrderStatuses.map(status => ({
    status,
    orders: active.filter(order => order.status === status)
  }))
})
const activeOrdersTotal = computed(() =>
  activeOrdersByStatus.value.reduce((count, group) => count + group.orders.length, 0)
)
const liveNewCount = computed(() => ordersStore.liveNewOrders.size)

const fetchOrders = async () => {
  if (!auth.merchantId) return
  ordersStore.filters.status = statusFilter.value
  ordersStore.filters.awaitingPaymentProof = awaitingProofOnly.value ? true : undefined
  await ordersStore.fetch(auth.merchantId)
}

// Watch merchantId to load data when it becomes available
watch(() => auth.merchantId, (newMerchantId) => {
  if (newMerchantId) {
    fetchOrders()
  }
}, { immediate: true })

onMounted(() => {
  if (auth.merchantId) {
    fetchOrders()
  }
})

const statusVariant = (status: string) => {
  if (status === 'PENDING') return 'warning'
  if (status === 'IN_PREPARATION' || status === 'READY' || status === 'DELIVERING') return 'info'
  if (status === 'DELIVERED') return 'success'
  return 'neutral'
}

const paymentStatus = (order: Order) => {
  if (order.paymentVerified) return { label: t('orders.paymentStatus.verified'), variant: 'success' as const }
  if (order.awaitingPaymentProof && order.paymentProofUrl)
    return { label: t('orders.paymentStatus.proofReceived'), variant: 'info' as const }
  if (order.awaitingPaymentProof) return { label: t('orders.paymentStatus.awaitingProof'), variant: 'warning' as const }
  if (order.paymentProofUrl && !order.paymentVerified)
    return { label: t('orders.paymentStatus.rejected'), variant: 'error' as const }
  return { label: t('orders.paymentStatus.awaitingProof'), variant: 'neutral' as const }
}

const openOrder = (id: string) => {
  ordersStore.markAsSeen(id)
  router.push({ name: 'merchant-order-detail', params: { id } })
}
</script>

<template>
  <div v-if="!auth.merchantId" class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <p class="text-slate-500">{{ t('common.loading') }}</p>
    </div>
  </div>
  <div v-else class="space-y-6">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold">{{ t('orders.title') }}</h1>
        <p class="text-slate-600">{{ t('landing.heroSubtitle') }}</p>
      </div>
    </div>

    <BaseCard
      class="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-none shadow-2xl ring-1 ring-white/10"
    >
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary-500/30 blur-3xl" />
        <div class="absolute -bottom-12 left-10 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl" />
      </div>
      <div class="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">{{ t('orders.liveBoard.pulse') }}</p>
          <h2 class="text-2xl font-bold">{{ t('orders.liveBoard.title') }}</h2>
          <p class="text-sm text-white/70">{{ t('orders.liveBoard.subtitle') }}</p>
        </div>
        <div class="flex items-center gap-3 flex-wrap justify-end">
          <div class="px-3 py-2 rounded-xl bg-white/10 backdrop-blur text-sm font-semibold border border-white/10">
            {{ t('orders.liveBoard.activeCount', { count: activeOrdersTotal }) }}
          </div>
          <div class="px-3 py-2 rounded-xl bg-amber-400/20 text-amber-50 font-semibold border border-amber-100/40">
            {{ t('orders.liveBoard.newCount', { count: liveNewCount }) }}
          </div>
          <BaseButton
            size="sm"
            variant="ghost"
            class="text-white border border-white/30 hover:bg-white/10"
            icon="arrow-rotate-right"
            @click="fetchOrders"
          >
            {{ t('orders.liveBoard.refresh') }}
          </BaseButton>
        </div>
      </div>

      <div class="relative mt-5 grid md:grid-cols-2 xl:grid-cols-4 gap-3">
        <div
          v-for="group in activeOrdersByStatus"
          :key="group.status"
          class="rounded-2xl bg-white/5 border border-white/10 p-3 backdrop-blur"
        >
          <div class="flex items-center justify-between gap-2 mb-2">
            <div class="flex items-center gap-2">
              <span
                class="h-2.5 w-2.5 rounded-full"
                :class="{
                  'bg-amber-300 shadow-[0_0_0_4px_rgba(251,191,36,0.15)]': group.status === 'PENDING',
                  'bg-sky-300 shadow-[0_0_0_4px_rgba(125,211,252,0.18)]': group.status === 'IN_PREPARATION',
                  'bg-emerald-300 shadow-[0_0_0_4px_rgba(74,222,128,0.18)]': group.status === 'READY',
                  'bg-indigo-300 shadow-[0_0_0_4px_rgba(165,180,252,0.18)]': group.status === 'DELIVERING'
                }"
              />
              <p class="font-semibold text-sm">{{ t(`statuses.${group.status}`) }}</p>
            </div>
            <span class="text-xs text-white/70 px-2 py-1 rounded-full bg-white/5 border border-white/10">
              {{ group.orders.length }}
            </span>
          </div>
          <div class="space-y-2 max-h-64 overflow-y-auto pr-1">
            <div
              v-if="!group.orders.length"
              class="text-xs text-white/60 py-3 text-center border border-dashed border-white/15 rounded-xl"
            >
              {{ t('orders.liveBoard.emptyStatus') }}
            </div>
            <div
              v-for="order in group.orders"
              :key="order.id"
              class="rounded-xl bg-white/10 border border-white/10 p-3 space-y-3 shadow-inner"
            >
              <div class="flex items-center justify-between gap-2">
                <p class="text-sm font-semibold">#{{ order.id.slice(-6) }}</p>
                <span
                  v-if="ordersStore.liveNewOrders.has(order.id)"
                  class="text-[11px] px-2 py-1 rounded-full bg-emerald-400/20 text-emerald-50 border border-emerald-100/30"
                >
                  {{ t('orders.liveBoard.newLabel') }}
                </span>
              </div>
              <div class="flex items-center flex-wrap gap-2 text-xs text-white/80">
                <span class="px-2 py-1 rounded-full bg-white/10 border border-white/10">
                  {{ maskPhone(order.session.customerPhone) }}
                </span>
                <span class="px-2 py-1 rounded-full bg-white/10 border border-white/10 flex items-center gap-1">
                  <span class="text-[10px] uppercase tracking-wide">{{ t('orders.total') }}</span>
                  ${{ Number(order.estimatedTotal).toFixed(2) }}
                </span>
                <span
                  v-if="order.awaitingPaymentProof && !order.paymentVerified"
                  class="px-2 py-1 rounded-full bg-amber-400/20 border border-amber-200/40 text-amber-50"
                >
                  {{ t('orders.paymentStatus.awaitingProof') }}
                </span>
              </div>
              <div class="flex items-center justify-between text-xs text-white/60">
                <span>{{ t('orders.createdAt') }}: {{ new Date(order.createdAt).toLocaleTimeString() }}</span>
                <BaseBadge :variant="statusVariant(order.status)">
                  {{ t(`statuses.${order.status}`) }}
                </BaseBadge>
              </div>
              <BaseButton class="w-full" size="sm" variant="ghost" icon="arrow-right" @click="openOrder(order.id)">
                {{ t('orders.liveBoard.open') }}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>

    <BaseCard>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
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
            { label: t('statuses.DELIVERING'), value: 'DELIVERING' },
            { label: t('statuses.DELIVERED'), value: 'DELIVERED' },
            { label: t('statuses.CANCELLED'), value: 'CANCELLED' }
          ]"
          :placeholder="t('common.status')"
        />
        <div class="flex items-center gap-3 border border-border rounded-xl px-3 py-2 bg-surface">
          <BaseToggle v-model="awaitingProofOnly" />
          <div>
            <p class="text-sm font-semibold">{{ t('orders.awaitingPaymentProofFilter') }}</p>
            <p class="text-xs text-slate-500">
              {{ awaitingProofOnly ? t('orders.paymentStatus.awaitingProof') : t('orders.paymentStatus.verified') }}
            </p>
          </div>
        </div>
      </div>
      <div class="flex justify-end">
        <BaseButton class="w-full sm:w-auto" @click="fetchOrders">{{ t('common.apply') }}</BaseButton>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-slate-500">
              <th class="py-2">{{ t('orders.orderId') }}</th>
              <th class="py-2">{{ t('orders.customer') }}</th>
              <th class="py-2">{{ t('orders.total') }}</th>
              <th class="py-2">{{ t('orders.status') }}</th>
              <th class="py-2">{{ t('orders.paymentProof') }}</th>
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
                {{ maskPhone(order.session.customerPhone) }}
              </td>
              <td class="py-3 font-semibold">${{ Number(order.estimatedTotal).toFixed(2) }}</td>
              <td class="py-3">
                <BaseBadge :variant="statusVariant(order.status)">
                  {{ t(`statuses.${order.status}`) }}
                </BaseBadge>
              </td>
              <td class="py-3">
                <BaseBadge :variant="paymentStatus(order).variant">
                  {{ paymentStatus(order).label }}
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
