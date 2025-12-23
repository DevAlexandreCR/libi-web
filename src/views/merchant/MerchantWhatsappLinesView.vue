<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import EmbeddedSignup from '@/components/whatsapp/EmbeddedSignup.vue'
import WhatsAppLineCard from '@/components/whatsapp/WhatsAppLineCard.vue'
import { useWhatsappLinesStore } from '@/stores/whatsappLines'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const whatsappLinesStore = useWhatsappLinesStore()
const auth = useAuthStore()
const embeddedSignupConfigId =
  import.meta.env.VITE_META_CONFIG_ID ||
  import.meta.env.VITE_FACEBOOK_APP_ID ||
  import.meta.env.VITE_META_APP_ID ||
  ''

onMounted(() => {
  if (auth.merchantId) whatsappLinesStore.fetchByMerchant(auth.merchantId)
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold">{{ t('whatsapp.lines') }}</h1>
        <p class="text-slate-600">{{ t('landing.heroSubtitle') }}</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-4">
      <BaseCard>
        <h3 class="text-lg font-semibold mb-2">{{ t('whatsapp.embeddedTitle') }}</h3>
        <p class="text-sm text-slate-600 mb-3">{{ t('whatsapp.embeddedSubtitle') }}</p>
        <EmbeddedSignup
          :config-id="embeddedSignupConfigId"
          :merchant-id="auth.merchantId"
        >
          {{ t('whatsapp.signupCta') }}
        </EmbeddedSignup>
      </BaseCard>

      <BaseCard>
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold">{{ t('whatsapp.lines') }}</h3>
          <BaseBadge variant="info">{{ whatsappLinesStore.lines.length }}</BaseBadge>
        </div>
        <div class="space-y-3">
          <WhatsAppLineCard
            v-for="line in whatsappLinesStore.lines"
            :key="line.id"
            :line="line"
          />
          <p v-if="!whatsappLinesStore.lines.length" class="text-sm text-slate-500">
            {{ t('common.loading') }}
          </p>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
