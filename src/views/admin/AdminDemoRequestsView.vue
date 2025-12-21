<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import type { DemoRequestStatus } from '@/types'
import { useDemoRequestsStore } from '@/stores'

const { t } = useI18n()
const demoRequestsStore = useDemoRequestsStore()
const search = ref('')
const statusFilter = ref<DemoRequestStatus | ''>('')

const statusOptions = computed(() =>
  (['NEW', 'CONTACTED', 'QUALIFIED', 'DISCARDED'] as DemoRequestStatus[]).map((status) => ({
    value: status,
    label: t(`demoRequests.status.${status}`)
  }))
)

const filteredLeads = computed(() => {
  const term = search.value.toLowerCase()
  return demoRequestsStore.items.filter((lead) => {
    const matchesStatus = statusFilter.value ? lead.status === statusFilter.value : true
    const matchesSearch =
      !term ||
      [lead.name, lead.email, lead.phone, lead.company, lead.message]
        .filter(Boolean)
        .some((field) => field?.toLowerCase().includes(term))
    return matchesStatus && matchesSearch
  })
})

const statusVariant: Record<DemoRequestStatus, 'info' | 'success' | 'warning' | 'neutral'> = {
  NEW: 'info',
  CONTACTED: 'warning',
  QUALIFIED: 'success',
  DISCARDED: 'neutral'
}

const updateStatus = async (id: string, status: DemoRequestStatus) => {
  await demoRequestsStore.updateStatus(id, status)
}

onMounted(() => {
  demoRequestsStore.fetch()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold">{{ t('demoRequests.title') }}</h1>
        <p class="text-slate-600 dark:text-slate-300">{{ t('demoRequests.subtitle') }}</p>
      </div>
    </div>

    <BaseCard>
      <div class="flex flex-wrap gap-3 mb-4">
        <div class="flex-1 min-w-[220px]">
          <BaseInput v-model="search" :label="t('common.search')" icon="search" />
        </div>
        <div class="w-48">
          <BaseSelect
            v-model="statusFilter"
            :label="t('common.status')"
            :options="[{ value: '', label: t('common.reset') }, ...statusOptions]"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-slate-500">
              <th class="py-2">#</th>
              <th class="py-2">{{ t('common.email') }}</th>
              <th class="py-2">{{ t('common.phone') }}</th>
              <th class="py-2">{{ t('common.description') }}</th>
              <th class="py-2">{{ t('demoRequests.source') }}</th>
              <th class="py-2">{{ t('common.status') }}</th>
              <th class="py-2">{{ t('common.createdAt') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lead in filteredLeads" :key="lead.id" class="border-t border-border/60">
              <td class="py-3">
                <div class="font-semibold">{{ lead.name }}</div>
                <div class="text-xs text-slate-500">{{ lead.company || '—' }}</div>
              </td>
              <td class="py-3">
                <div class="flex items-center gap-2">
                  <FaIcon icon="envelope" class="text-slate-400" />
                  <span>{{ lead.email }}</span>
                </div>
              </td>
              <td class="py-3">
                <div class="flex items-center gap-2">
                  <FaIcon icon="phone" class="text-slate-400" />
                  <span>{{ lead.phone || '—' }}</span>
                </div>
              </td>
              <td class="py-3 max-w-sm">
                <p class="text-slate-700 dark:text-slate-200">{{ lead.message || '—' }}</p>
              </td>
              <td class="py-3">
                <BaseBadge variant="neutral">{{ lead.source || 'landing' }}</BaseBadge>
              </td>
              <td class="py-3">
                <div class="flex items-center gap-2">
                  <BaseBadge :variant="statusVariant[lead.status]">{{ t(`demoRequests.status.${lead.status}`) }}</BaseBadge>
                  <BaseSelect
                    :model-value="lead.status"
                    :options="statusOptions"
                    :placeholder="t('common.update')"
                    @update:model-value="(value) => updateStatus(lead.id, value as DemoRequestStatus)"
                  />
                </div>
              </td>
              <td class="py-3 whitespace-nowrap">
                {{ new Date(lead.createdAt).toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!demoRequestsStore.items.length" class="text-center text-slate-500 py-6">
          {{ t('common.loading') }}
        </div>
      </div>
    </BaseCard>
  </div>
</template>
