<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import { useWhatsappLinesStore } from '@/stores/whatsappLines'

const { t } = useI18n()
const route = useRoute()
const whatsappLinesStore = useWhatsappLinesStore()

const line = computed(() => whatsappLinesStore.lines.find((l) => l.id === route.params.id))

onMounted(async () => {
  if (!line.value) {
    await whatsappLinesStore.fetchAll()
  }
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">{{ t('admin.whatsappLineDetail') }}</h1>
      <p class="text-slate-600">{{ line?.displayPhoneNumber || line?.phone }}</p>
    </div>
    <BaseCard v-if="line">
      <div class="grid sm:grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-slate-500 mb-1">{{ t('common.phone') }}</p>
          <p class="font-semibold">{{ line.displayPhoneNumber || line.phone }}</p>
        </div>
        <div>
          <p class="text-xs text-slate-500 mb-1">{{ t('navigation.merchants') }}</p>
          <p class="font-semibold">{{ line.merchantName || '—' }}</p>
        </div>
        <div>
          <p class="text-xs text-slate-500 mb-1">{{ t('common.status') }}</p>
          <BaseBadge :variant="line.status === 'ACTIVE' ? 'success' : 'neutral'">
            {{ t(`statuses.${line.status}`) }}
          </BaseBadge>
        </div>
        <div>
          <p class="text-xs text-slate-500 mb-1">IDs</p>
          <p class="text-sm text-slate-700">phoneNumberId: {{ line.phoneNumberId || '—' }}</p>
          <p class="text-sm text-slate-700">wabaId: {{ line.wabaId || '—' }}</p>
        </div>
        <div class="sm:col-span-2">
          <p class="text-xs text-slate-500 mb-1">Access token length</p>
          <p class="text-sm text-slate-700">{{ line.accessToken ? line.accessToken.length : 0 }} chars (masked)</p>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
