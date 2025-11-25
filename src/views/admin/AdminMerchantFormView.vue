<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useMerchantStore } from '@/stores/merchants'
import type { MerchantStatus } from '@/types'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const merchantsStore = useMerchantStore()

const form = reactive<{
  id?: string
  name?: string
  slug?: string
  address?: string
  status: MerchantStatus
}>({
  id: '',
  name: '',
  slug: '',
  address: '',
  status: 'ACTIVE'
})

onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    await merchantsStore.fetchById(id)
    Object.assign(form, merchantsStore.selected)
  }
})

const handleSubmit = async () => {
  await merchantsStore.save(form)
  router.push({ name: 'admin-merchants' })
}
</script>

<template>
  <div class="space-y-6 max-w-3xl">
    <div>
      <h1 class="text-2xl font-bold">{{ t('admin.merchantFormTitle') }}</h1>
      <p class="text-slate-600">{{ t('landing.heroSubtitle') }}</p>
    </div>
    <BaseCard>
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <BaseInput v-model="form.name" :label="t('common.name')" placeholder="Mi restaurante" />
        <BaseInput v-model="form.slug" label="Slug" placeholder="mi-restaurante" />
        <BaseInput v-model="form.address" :label="t('orders.address')" placeholder="Calle 123" />
        <BaseSelect
          v-model="form.status"
          :label="t('common.status')"
          :options="[
            { label: t('statuses.ACTIVE'), value: 'ACTIVE' },
            { label: t('statuses.INACTIVE'), value: 'INACTIVE' }
          ]"
          :placeholder="t('common.status')"
        />
        <div class="flex gap-3">
          <BaseButton type="submit">{{ t('common.save') }}</BaseButton>
          <BaseButton variant="ghost" @click="router.back()">{{ t('common.cancel') }}</BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
