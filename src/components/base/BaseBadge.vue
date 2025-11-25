<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant?: 'success' | 'warning' | 'info' | 'neutral' | 'error'
}>()

const colors: Record<string, string> = {
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  neutral: 'bg-slate-50 text-slate-700 border-slate-200',
  error: 'bg-red-50 text-red-700 border-red-200'
}

const classes = computed(() => `px-3 py-1 rounded-full text-xs font-semibold border ${colors[props.variant || 'neutral']}`)
</script>

<template>
  <span :class="classes"><slot /></span>
</template>
