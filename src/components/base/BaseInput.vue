<script setup lang="ts">
import { computed } from 'vue'

const modelValue = defineModel<string | number>({ default: '' })
const props = defineProps<{
  label?: string
  placeholder?: string
  type?: string
  error?: string
  icon?: string
}>()

const inputClasses = computed(() => {
  const base =
    'w-full rounded-xl border bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder-slate-500 dark:focus:border-primary-300 dark:focus:ring-primary-900/40'
  return `${base} ${props.error ? 'border-red-400 focus:ring-red-100 dark:border-red-400 dark:focus:ring-red-900/30' : 'border-border'}`
})
</script>

<template>
  <label class="block space-y-1.5">
    <span v-if="label" class="text-sm font-medium text-slate-700 dark:text-slate-200">{{ label }}</span>
    <div class="relative">
      <input
        v-model="modelValue"
        :type="type || 'text'"
        :placeholder="placeholder"
        :class="inputClasses"
      />
      <FaIcon v-if="icon" :icon="icon" class="absolute right-4 top-3.5 text-slate-400 dark:text-slate-500" />
    </div>
    <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
  </label>
</template>
