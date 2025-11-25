<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { dashboardApi } from '@/services/api'
import type { StatsSummary } from '@/types'
import StatCard from '@/components/StatCard.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BaseSkeleton from '@/components/base/BaseSkeleton.vue'

const { t } = useI18n()
const stats = ref<StatsSummary | null>(null)
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    stats.value = await dashboardApi.adminStats()
  } finally {
    loading.value = false
  }
})

const labels = computed(() => stats.value?.dailyOrders?.map((d) => d.date) ?? [])
const data = computed(() => stats.value?.dailyOrders?.map((d) => d.count) ?? [])
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold mb-2">{{ t('admin.overviewTitle') }}</h1>
      <p class="text-slate-600">{{ t('landing.heroSubtitle') }}</p>
    </div>
    <div class="grid md:grid-cols-3 gap-4">
      <StatCard v-if="!loading" :label="t('admin.merchants')" :value="stats?.merchants ?? 0" icon="users" accent="blue" />
      <StatCard v-if="!loading" :label="t('admin.totalOrders')" :value="stats?.orders ?? 0" icon="bag-shopping" accent="green" />
      <StatCard
        v-if="!loading"
        :label="t('admin.totalLines')"
        :value="stats?.whatsappLines ?? 0"
        icon="phone"
        accent="orange"
      />
      <template v-if="loading">
        <BaseSkeleton v-for="i in 3" :key="i" height="120px" />
      </template>
    </div>

    <BaseCard :title="t('admin.dailyOrders')" class="h-80">
      <div v-if="loading" class="h-full grid place-content-center">
        <BaseSkeleton width="200px" height="32px" />
      </div>
      <div v-else class="h-64">
        <LineChart :labels="labels" :data="data" :dataset-label="t('admin.dailyOrders')" />
      </div>
    </BaseCard>
  </div>
</template>
