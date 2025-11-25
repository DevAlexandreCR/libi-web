<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, RouterLink, RouterView } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'

const { t, locale } = useI18n()
const route = useRoute()

const toggleLocale = () => {
  locale.value = locale.value === 'es' ? 'en' : 'es'
}

const isAuthPage = computed(() => route.name === 'login' || route.name === 'demo')
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="sticky top-0 z-20 backdrop-blur bg-white/80 border-b border-border">
      <div class="section py-4 flex items-center justify-between gap-4">
        <RouterLink to="/" class="flex items-center gap-2 font-bold text-lg">
          <span class="h-10 w-10 rounded-xl bg-primary-600 text-white grid place-content-center font-semibold">L</span>
          <span>libi</span>
        </RouterLink>
        <div class="flex items-center gap-3">
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

    <footer v-if="!isAuthPage" class="border-t border-border bg-white/80 backdrop-blur py-8">
      <div class="section flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
        <div class="flex items-center gap-2">
          <span class="font-semibold">libi</span>
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
