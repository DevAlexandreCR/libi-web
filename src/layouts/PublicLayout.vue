<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, RouterLink, RouterView } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import { useThemeStore } from '@/stores/theme'

const { t, locale } = useI18n()
const route = useRoute()
const theme = useThemeStore()

const toggleLocale = () => {
  locale.value = locale.value === 'es' ? 'en' : 'es'
}

const isAuthPage = computed(() => route.name === 'login' || route.name === 'demo')
const isDark = computed(() => theme.mode === 'dark')
const toggleTheme = () => theme.toggle()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[var(--bg)] text-slate-900 dark:text-slate-100 transition-colors duration-200">
    <header class="sticky top-0 z-20 backdrop-blur bg-[var(--panel)] border-b border-border">
      <div class="section py-4 flex items-center justify-between gap-4">
        <RouterLink to="/" class="flex items-center gap-3 font-bold text-lg">
          <img
            src="/logo.png"
            alt="LiBi"
            class="h-10 w-10 rounded-xl ring-1 ring-primary-400/60 shadow-[0_0_18px_rgba(20,184,255,0.35)] bg-[#05070f] object-contain"
          />
          <span class="tracking-tight">LiBi</span>
        </RouterLink>
        <div class="flex items-center gap-3">
          <button
            class="h-10 w-10 grid place-items-center rounded-xl border border-border hover:border-primary-200 transition"
            type="button"
            :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
            @click="toggleTheme"
          >
            <FaIcon :icon="isDark ? 'sun' : 'moon'" />
          </button>
          <button
            class="text-sm px-3 py-1.5 rounded-lg border border-border hover:border-primary-200"
            @click="toggleLocale"
          >
            <FaIcon icon="language" class="mr-2" />
            {{ locale === 'es' ? 'ES' : 'EN' }}
          </button>
          <RouterLink to="/login">
            <BaseButton variant="ghost" class="hidden sm:inline-flex" icon="sign-in-alt">
              {{ t('common.signIn') }}
            </BaseButton>
          </RouterLink>
          <RouterLink to="/demo">
            <BaseButton>
              {{ t('common.requestDemo') }}
            </BaseButton>
          </RouterLink>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <RouterView />
    </main>

    <footer v-if="!isAuthPage" class="border-t border-border bg-[var(--panel)] backdrop-blur py-8">
      <div class="section flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
        <div class="flex items-center gap-2">
          <img src="/logo.png" alt="LiBi" class="h-8 w-8 rounded-lg object-contain bg-[#05070f]" />
          <span class="font-semibold">LiBi</span>
          <span>©</span>
          <span>{{ new Date().getFullYear() }}</span>
        </div>
        <div class="flex gap-3">
          <a href="#" class="hover:text-primary-600">{{ t('landing.footer.terms') }}</a>
          <a href="#" class="hover:text-primary-600">{{ t('landing.footer.privacy') }}</a>
          <a href="mailto:hello@libi.ai" class="hover:text-primary-600">{{ t('landing.footer.contact') }}</a>
        </div>
      </div>
    </footer>
  </div>
</template>
