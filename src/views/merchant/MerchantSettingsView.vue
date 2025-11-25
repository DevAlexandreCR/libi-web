<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const save = () => {
  // placeholder for settings save
}
</script>

<template>
  <div class="space-y-6 max-w-3xl">
    <div>
      <h1 class="text-2xl font-bold">{{ t('navigation.settings') }}</h1>
      <p class="text-slate-600">{{ t('landing.heroSubtitle') }}</p>
    </div>
    <BaseCard>
      <form class="space-y-4" @submit.prevent="save">
        <BaseInput :label="t('common.name')" placeholder="Store display name" />
        <BaseInput :label="t('common.email')" placeholder="Notifications email" />
        <BaseButton type="submit">{{ t('common.save') }}</BaseButton>
      </form>
    </BaseCard>
  </div>
</template>
