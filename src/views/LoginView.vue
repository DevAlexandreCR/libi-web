<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const demoForm = reactive({
  email: '',
  phone: ''
})

const handleLogin = async () => {
  await auth.login({ email: form.email, password: form.password })
  if (auth.role === 'SUPER_ADMIN') {
    router.push({ name: 'admin-overview' })
  } else if (auth.role === 'MERCHANT_ADMIN') {
    router.push({ name: 'merchant-overview' })
  } else {
    router.push((route.query.redirect as string) || '/')
  }
}
</script>

<template>
  <div class="section flex items-center justify-center">
    <div class="grid lg:grid-cols-2 gap-10 w-full max-w-5xl items-center">
      <div class="space-y-6">
        <p class="text-sm uppercase tracking-wide text-primary-600 font-semibold">
          {{ t('auth.title') }}
        </p>
        <h1 class="text-4xl font-bold">{{ t('auth.subtitle') }}</h1>
        <p class="text-slate-600">{{ t('landing.heroSubtitle') }}</p>
        <div class="flex gap-3">
          <BaseButton variant="secondary" icon="arrow-right" @click="router.push({ name: 'demo' })">
            {{ t('auth.demoTitle') }}
          </BaseButton>
        </div>
      </div>

      <BaseCard class="p-6 shadow-card">
        <form class="space-y-4" @submit.prevent="handleLogin">
          <BaseInput v-model="form.email" :label="t('common.email')" type="email" placeholder="you@restaurant.com" />
          <BaseInput v-model="form.password" :label="t('common.password')" type="password" placeholder="••••••••" />
          <label class="flex items-center gap-2 text-sm text-slate-600">
            <input v-model="form.remember" type="checkbox" class="rounded border-border text-primary-600 focus:ring-primary-500" />
            <span>{{ t('common.rememberMe') }}</span>
          </label>
          <BaseButton :loading="auth.loading" block type="submit">
            {{ t('auth.submit') }}
          </BaseButton>
        </form>
        <div class="mt-6 border-t border-border pt-4">
          <h3 class="font-semibold mb-2">{{ t('auth.demoTitle') }}</h3>
          <p class="text-sm text-slate-600 mb-3">{{ t('auth.demoSubtitle') }}</p>
          <div class="space-y-3">
            <BaseInput v-model="demoForm.email" :label="t('common.email')" type="email" placeholder="you@restaurant.com" />
            <BaseInput v-model="demoForm.phone" :label="t('common.phone')" placeholder="+34 600 000 000" />
            <BaseButton variant="secondary" block icon="arrow-right">
              {{ t('auth.request') }}
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
