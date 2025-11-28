<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant?: 'success' | 'warning' | 'info' | 'neutral' | 'error'
}>()

const colors: Record<string, string> = {
  success: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800',
  info: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-primary-900/40 dark:text-primary-100 dark:border-primary-800',
  neutral: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/40 dark:text-slate-200 dark:border-slate-700',
  error: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-800'
}

const classes = computed(() => `px-3 py-1 rounded-full text-xs font-semibold border ${colors[props.variant || 'neutral']}`)
</script>

<template>
  <span :class="classes"><slot /></span>
</template>
