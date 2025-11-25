<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/base/BaseButton.vue'
import StatCard from '@/components/StatCard.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BaseSkeleton from '@/components/base/BaseSkeleton.vue'
import { dashboardApi } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import type { StatsSummary } from '@/types'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const stats = ref<StatsSummary | null>(null)
const loading = ref(false)

onMounted(async () => {
  if (!auth.merchantId) return
  loading.value = true
  try {
    stats.value = await dashboardApi.merchantStats(auth.merchantId)
  } finally {
    loading.value = false
  }
})

const labels = computed(() => stats.value?.dailyOrders?.map((d) => d.date) ?? [])
const data = computed(() => stats.value?.dailyOrders?.map((d) => d.count) ?? [])
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold">{{ t('merchant.overviewTitle') }}</h1>
        <p class="text-slate-600">{{ t('landing.heroSubtitle') }}</p>
      </div>
      <div class="flex gap-3">
        <BaseButton variant="secondary" icon="arrow-right" @click="router.push({ name: 'merchant-orders' })">
          {{ t('merchant.orders') }}
        </BaseButton>
        <BaseButton variant="ghost" icon="comments" @click="router.push({ name: 'merchant-sessions' })">
          {{ t('merchant.sessions') }}
        </BaseButton>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-4">
      <StatCard v-if="!loading" :label="t('merchant.ordersToday')" :value="stats?.orders ?? 0" icon="bag-shopping" />
      <StatCard v-if="!loading" :label="t('merchant.ordersWeek')" :value="stats?.orders ?? 0" icon="chart-line" accent="orange" />
      <StatCard
        v-if="!loading"
        :label="t('merchant.ordersByStatus')"
        :value="stats?.ordersByStatus?.PENDING ?? 0"
        icon="bell"
        accent="green"
      />
      <template v-if="loading">
        <BaseSkeleton v-for="i in 3" :key="i" height="120px" />
      </template>
    </div>

    <BaseCard :title="t('merchant.lastSevenDays')" class="h-80">
      <div v-if="loading" class="h-full grid place-content-center">
        <BaseSkeleton width="200px" height="32px" />
      </div>
      <div v-else class="h-64">
        <LineChart :labels="labels" :data="data" :dataset-label="t('merchant.lastSevenDays')" />
      </div>
    </BaseCard>
  </div>
</template>
