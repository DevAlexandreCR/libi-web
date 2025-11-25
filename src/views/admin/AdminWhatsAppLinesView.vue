<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import { useWhatsappLinesStore } from '@/stores/whatsappLines'

const { t } = useI18n()
const router = useRouter()
const whatsappLinesStore = useWhatsappLinesStore()

onMounted(() => {
  whatsappLinesStore.fetchAll()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold">{{ t('admin.whatsappLinesTitle') }}</h1>
        <p class="text-slate-600">{{ t('landing.heroSubtitle') }}</p>
      </div>
    </div>
    <BaseCard>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-slate-500">
              <th class="py-2">{{ t('common.phone') }}</th>
              <th class="py-2">{{ t('navigation.merchants') }}</th>
              <th class="py-2">{{ t('common.status') }}</th>
              <th class="py-2">{{ t('common.createdAt') }}</th>
              <th class="py-2 text-right">{{ t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="line in whatsappLinesStore.lines" :key="line.id" class="border-t border-border/60">
              <td class="py-3 font-semibold">{{ line.phoneDisplayName || line.phoneNumber || '—' }}</td>
              <td class="py-3">{{ line.merchantName || '—' }}</td>
              <td class="py-3">
                <BaseBadge :variant="line.status === 'ACTIVE' ? 'success' : line.status === 'PENDING_CONFIG' ? 'warning' : 'neutral'">
                  {{ t(`statuses.${line.status}`) }}
                </BaseBadge>
              </td>
              <td class="py-3">{{ new Date(line.createdAt).toLocaleDateString() }}</td>
              <td class="py-3 text-right">
                <BaseButton
                  variant="ghost"
                  size="sm"
                  icon="eye"
                  @click="router.push({ name: 'admin-whatsapp-line-detail', params: { id: line.id } })"
                >
                  {{ t('common.view') }}
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>
  </div>
</template>
