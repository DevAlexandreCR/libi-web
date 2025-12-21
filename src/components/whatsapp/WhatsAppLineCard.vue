<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import type { WhatsAppLine } from '@/types'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useWhatsappLinesStore } from '@/stores/whatsappLines'

const props = defineProps<{
  line: WhatsAppLine
}>()

const { t } = useI18n()
const router = useRouter()
const whatsappLinesStore = useWhatsappLinesStore()
const toggling = ref(false)

const toggleBot = async () => {
  toggling.value = true
  try {
    await whatsappLinesStore.toggleBotEnabled(props.line.id, !props.line.botEnabled)
  } finally {
    toggling.value = false
  }
}

const openSettings = () => {
  router.push({ name: 'merchant-business-hours' })
}
</script>

<template>
  <div class="border border-border rounded-xl p-4 space-y-3">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <p class="font-semibold text-lg">{{ line.phoneDisplayName || line.phoneNumber }}</p>
          <BaseBadge 
            :variant="line.status === 'ACTIVE' ? 'success' : line.status === 'PENDING_CONFIG' ? 'warning' : 'neutral'"
          >
            {{ t(`statuses.${line.status}`) }}
          </BaseBadge>
        </div>
        <p class="text-xs text-slate-500">WABA: {{ line.wabaId || '—' }}</p>
      </div>
    </div>

    <div class="flex items-center justify-between pt-2 border-t border-border/60">
      <div class="flex items-center gap-2">
        <span class="text-sm text-slate-600">{{ t('whatsapp.botStatus') }}:</span>
        <BaseBadge :variant="line.botEnabled ? 'success' : 'neutral'">
          {{ line.botEnabled ? '🟢 ' + t('whatsapp.botEnabled') : '🔴 ' + t('whatsapp.botDisabled') }}
        </BaseBadge>
      </div>
      <div class="flex gap-2">
        <BaseButton
          :variant="line.botEnabled ? 'secondary' : 'primary'"
          size="sm"
          :loading="toggling"
          @click="toggleBot"
        >
          {{ line.botEnabled ? t('whatsapp.disableBot') : t('whatsapp.enableBot') }}
        </BaseButton>
        <BaseButton
          variant="secondary"
          size="sm"
          @click="openSettings"
        >
          ⚙️ {{ t('common.settings') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>
