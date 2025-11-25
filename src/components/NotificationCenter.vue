<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useNotificationStore } from '@/stores/notifications'
import { useI18n } from 'vue-i18n'

const notifications = useNotificationStore()
const { t } = useI18n()

const toasts = computed(() => notifications.toasts)

watchEffect(() => {
  toasts.value.forEach((toast) => {
    const timeout = toast.durationMs ?? 4000
    setTimeout(() => notifications.remove(toast.id), timeout)
  })
})

const bgMap: Record<string, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
}
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-3">
    <TransitionGroup name="fade">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="w-80 card shadow-soft px-4 py-3 border-l-4"
        :class="bgMap[toast.type]"
      >
        <div class="flex items-start gap-3">
          <FaIcon
            :icon="toast.type === 'success' ? 'circle-check' : toast.type === 'error' ? 'circle-exclamation' : 'bell'"
            class="mt-1"
          />
          <div class="flex-1">
            <p class="font-semibold text-sm">
              {{ toast.title || t(`common.${toast.type === 'error' ? 'error' : 'success'}`) }}
            </p>
            <p class="text-sm opacity-80">{{ t(toast.message) }}</p>
          </div>
          <button class="text-xs opacity-60 hover:opacity-100" @click="notifications.remove(toast.id)">✕</button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
