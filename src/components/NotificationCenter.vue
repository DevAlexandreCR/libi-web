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
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-100',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-100',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-primary-900/40 dark:border-primary-800 dark:text-primary-100',
  order: 'bg-orange-50 border-orange-400 text-orange-900 dark:bg-orange-900/40 dark:border-orange-600 dark:text-orange-100'
}

const getIconClass = (toast: any) => {
  if (toast.type === 'order') return 'text-2xl animate-bounce'
  return 'mt-1'
}

const getIcon = (toast: any) => {
  if (toast.type === 'success') return 'circle-check'
  if (toast.type === 'error') return 'circle-exclamation'
  if (toast.type === 'order') return 'bell'
  return 'bell'
}

const getCardClass = (toast: any) => {
  if (toast.type === 'order') return 'w-96 card shadow-2xl px-5 py-4 border-l-8 transform hover:scale-105 transition-transform'
  return 'w-80 card shadow-soft px-4 py-3 border-l-4'
}
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-3">
    <TransitionGroup name="fade">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[getCardClass(toast), bgMap[toast.type]]"
      >
        <div class="flex items-start gap-3">
          <FaIcon
            :icon="getIcon(toast)"
            :class="getIconClass(toast)"
          />
          <div class="flex-1">
            <p :class="toast.type === 'order' ? 'font-bold text-lg' : 'font-semibold text-sm'">
              {{ toast.title || t(`common.${toast.type === 'error' ? 'error' : 'success'}`) }}
            </p>
            <p :class="toast.type === 'order' ? 'text-base font-medium opacity-90 mt-1' : 'text-sm opacity-80'">
              {{ t(toast.message) }}
            </p>
          </div>
          <button class="text-xs opacity-60 hover:opacity-100" @click="notifications.remove(toast.id)">✕</button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.fade-enter-active {
  animation: slideIn 0.4s ease-out;
}

.fade-leave-active {
  animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(100%) scale(0.8);
  }
}
</style>
