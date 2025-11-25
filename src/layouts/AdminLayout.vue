<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/base/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const auth = useAuthStore()

const nav = computed(() => [
  { label: t('navigation.overview'), icon: 'chart-line', to: { name: 'admin-overview' } },
  { label: t('navigation.merchants'), icon: 'users', to: { name: 'admin-merchants' } },
  { label: t('navigation.whatsappLines'), icon: 'phone', to: { name: 'admin-whatsapp-lines' } },
  { label: t('navigation.settings'), icon: 'sliders', to: '/admin/settings', disabled: true }
])

const toggleLocale = () => {
  locale.value = locale.value === 'es' ? 'en' : 'es'
}

const logout = () => {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen flex bg-surface">
    <aside class="w-64 hidden lg:flex flex-col border-r border-border bg-white/90 backdrop-blur">
      <div class="px-5 py-6 flex items-center gap-3">
        <RouterLink to="/" class="flex items-center gap-2 font-bold text-lg">
          <span class="h-10 w-10 rounded-xl bg-primary-600 text-white grid place-content-center font-semibold">L</span>
          <span>libi</span>
        </RouterLink>
      </div>
      <nav class="px-3 space-y-1">
        <RouterLink
          v-for="item in nav"
          :key="item.label"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition"
          :class="
            route.name === (item.to as any).name
              ? 'bg-primary-50 text-primary-700'
              : 'text-slate-600 hover:bg-slate-100'
          "
        >
          <FaIcon :icon="item.icon" class="w-4" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
      <div class="mt-auto p-4">
        <BaseButton variant="ghost" class="w-full justify-start" icon="power-off" @click="logout">
          {{ t('common.signOut') }}
        </BaseButton>
      </div>
    </aside>

    <div class="flex-1 flex flex-col">
      <header class="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-border">
        <div class="flex items-center justify-between px-4 sm:px-6 py-3">
          <button class="lg:hidden text-slate-600">
            <FaIcon icon="bars" />
          </button>
          <div class="flex-1" />
          <div class="flex items-center gap-3">
            <button
              class="text-sm px-3 py-1.5 rounded-lg border border-border hover:border-primary-200"
              @click="toggleLocale"
            >
              <FaIcon icon="language" class="mr-2" />
              {{ locale === 'es' ? 'ES' : 'EN' }}
            </button>
            <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface border border-border">
              <div>
                <p class="text-xs text-slate-500">{{ auth.user?.email }}</p>
                <p class="text-sm font-semibold">{{ auth.user?.name }}</p>
              </div>
              <BaseButton variant="ghost" icon="power-off" @click="logout">
                {{ t('common.signOut') }}
              </BaseButton>
            </div>
          </div>
        </div>
      </header>
      <main class="p-4 sm:p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
