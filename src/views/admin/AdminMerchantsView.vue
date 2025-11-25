<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import { useMerchantStore } from '@/stores/merchants'

const { t } = useI18n()
const router = useRouter()
const merchantsStore = useMerchantStore()
const search = ref('')

onMounted(() => {
  merchantsStore.fetch()
})

const filteredMerchants = computed(() =>
  merchantsStore.merchants.filter((merchant) =>
    merchant.name.toLowerCase().includes(search.value.toLowerCase()) ||
    merchant.slug.toLowerCase().includes(search.value.toLowerCase())
  )
)

const statusVariant = (status: string) => (status === 'ACTIVE' ? 'success' : 'neutral')
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold">{{ t('admin.merchantsListTitle') }}</h1>
        <p class="text-slate-600">{{ t('landing.heroSubtitle') }}</p>
      </div>
      <BaseButton icon="plus" @click="router.push({ name: 'admin-merchants-create' })">
        {{ t('common.create') }}
      </BaseButton>
    </div>

    <BaseCard>
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <BaseInput v-model="search" :label="t('common.search')" icon="search" />
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-slate-500">
              <th class="py-2">#</th>
              <th class="py-2">{{ t('common.status') }}</th>
              <th class="py-2">{{ t('orders.address') }}</th>
              <th class="py-2">{{ t('common.createdAt') }}</th>
              <th class="py-2 text-right">{{ t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="merchant in filteredMerchants" :key="merchant.id" class="border-t border-border/60">
              <td class="py-3">
                <div class="font-semibold">{{ merchant.name }}</div>
                <div class="text-xs text-slate-500">{{ merchant.slug }}</div>
              </td>
              <td class="py-3">
                <BaseBadge :variant="statusVariant(merchant.status)">{{ t(`statuses.${merchant.status}`) }}</BaseBadge>
              </td>
              <td class="py-3">{{ merchant.address || '—' }}</td>
              <td class="py-3">{{ new Date(merchant.createdAt).toLocaleDateString() }}</td>
              <td class="py-3 text-right space-x-2">
                <BaseButton variant="ghost" size="sm" icon="eye" @click="router.push({ name: 'admin-merchants-edit', params: { id: merchant.id } })">
                  {{ t('common.view') }}
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  size="sm"
                  icon="trash"
                  @click="merchantsStore.remove(merchant.id)"
                >
                  {{ t('common.delete') }}
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!merchantsStore.merchants.length" class="text-center text-slate-500 py-6">
          {{ t('common.loading') }}
        </div>
      </div>
    </BaseCard>
  </div>
</template>
