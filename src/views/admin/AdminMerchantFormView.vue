<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useMerchantStore } from '@/stores/merchants'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const merchantsStore = useMerchantStore()

const form = reactive<{
  id?: string
  name?: string
  slug?: string
  description?: string
  address?: string
  phone?: string
  timezone?: string
}>({
  id: '',
  name: '',
  slug: '',
  description: '',
  address: '',
  phone: '',
  timezone: ''
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
        <BaseInput v-model="form.description" :label="t('common.description') || 'Descripción'" placeholder="Descripción" />
        <BaseInput v-model="form.address" :label="t('orders.address')" placeholder="Calle 123" />
        <BaseInput v-model="form.phone" :label="t('common.phone')" placeholder="+1 555 123456" />
        <BaseInput v-model="form.timezone" label="Timezone" placeholder="America/Mexico_City" />
        <div class="flex gap-3">
          <BaseButton type="submit">{{ t('common.save') }}</BaseButton>
          <BaseButton variant="ghost" @click="router.back()">{{ t('common.cancel') }}</BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
