<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseToggle from '@/components/base/BaseToggle.vue'
import { useMenuStore } from '@/stores/menu'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const menuStore = useMenuStore()
const auth = useAuthStore()

onMounted(() => {
  if (auth.merchantId) {
    menuStore.fetch(auth.merchantId)
  }
})

const categories = computed(() => menuStore.menu?.categories ?? [])

const toggle = async (itemId: string, value: boolean) => {
  await menuStore.toggleAvailability(itemId, value)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold">{{ t('menu.title') }}</h1>
        <p class="text-slate-600">{{ t('landing.heroSubtitle') }}</p>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <BaseCard v-for="category in categories" :key="category.id" :title="category.name">
        <div class="space-y-4">
          <div v-for="item in category.items" :key="item.id" class="flex items-start justify-between">
            <div>
              <p class="font-semibold">{{ item.name }}</p>
              <p class="text-xs text-slate-500">{{ item.description }}</p>
              <p class="text-sm font-semibold mt-1">${{ Number(item.basePrice).toFixed(2) }}</p>
            </div>
            <div class="flex flex-col items-end gap-2">
              <BaseBadge :variant="item.isAvailable ? 'success' : 'neutral'">
                {{ item.isAvailable ? t('menu.markAvailable') : t('menu.markUnavailable') }}
              </BaseBadge>
              <BaseToggle :model-value="item.isAvailable" @update:model-value="(value) => toggle(item.id, value)" />
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
    <div v-if="!categories.length" class="text-center text-slate-500 py-6">
      {{ t('common.loading') }}
    </div>
  </div>
</template>
