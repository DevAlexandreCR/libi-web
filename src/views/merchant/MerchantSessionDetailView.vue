<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import { useSessionsStore } from '@/stores/sessions'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const route = useRoute()
const sessionsStore = useSessionsStore()
const auth = useAuthStore()

const sessionId = computed(() => route.params.id as string)
const session = computed(() => sessionsStore.selected)

onMounted(async () => {
  if (auth.merchantId && sessionId.value) {
    await sessionsStore.fetchById(auth.merchantId, sessionId.value)
  }
})
</script>

<template>
  <div v-if="session" class="space-y-6">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold">
          {{ t('sessions.sessionId') }}: {{ session.id }}
        </h1>
        <p class="text-slate-600 dark:text-slate-300">{{ session.customerPhone }}</p>
      </div>
      <BaseBadge
        :variant="
          session.status === 'CONFIRMED'
            ? 'success'
            : session.status === 'CANCELLED' || session.status === 'EXPIRED'
              ? 'neutral'
              : 'info'
        "
      >
        {{ t(`statuses.${session.status}`) }}
      </BaseBadge>
    </div>

    <div class="grid lg:grid-cols-3 gap-4">
      <BaseCard :title="t('sessions.conversation')" class="lg:col-span-2">
        <div class="space-y-3 max-h-[480px] overflow-y-auto pr-2">
          <div
            v-for="message in session.messages || []"
            :key="message.createdAt + message.role"
            class="flex"
            :class="message.role === 'assistant' ? 'justify-end' : 'justify-start'"
          >
            <div
            class="px-4 py-3 rounded-2xl max-w-[80%] shadow-soft"
            :class="
              message.role === 'assistant'
                ? 'bg-primary-600 text-white rounded-tr-sm dark:bg-primary-500 dark:text-slate-900'
                : message.role === 'system'
                  ? 'bg-slate-100 text-slate-800 border border-border dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700'
                  : 'bg-white text-slate-900 rounded-tl-sm border border-border dark:bg-slate-800 dark:text-slate-50 dark:border-slate-700'
            "
          >
            <p class="text-sm leading-relaxed">{{ message.content }}</p>
            <span class="text-[10px] opacity-70">{{ new Date(message.createdAt).toLocaleTimeString() }}</span>
          </div>
          </div>
        </div>
      </BaseCard>

      <BaseCard :title="t('sessions.metadata')">
        <div class="space-y-3 text-sm">
          <div class="flex items-center justify-between">
            <span class="text-slate-600">{{ t('common.status') }}</span>
            <span class="font-semibold">{{ t(`statuses.${session.status}`) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-600">{{ t('sessions.lastInteraction') }}</span>
            <span class="font-semibold">{{ new Date(session.lastInteractionAt).toLocaleString() }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-600">{{ t('sessions.linkedOrder') }}</span>
            <span class="font-semibold">{{ session.orders?.[0]?.id || '—' }}</span>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
  <div v-else class="text-center text-slate-500 dark:text-slate-300 py-6">{{ t('common.loading') }}</div>
</template>
