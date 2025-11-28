<script setup lang="ts">
const modelValue = defineModel<string | number | undefined>()

defineProps<{
  label?: string
  options: { label: string; value: string | number }[]
  placeholder?: string
}>()
</script>

<template>
  <label class="block space-y-1.5">
    <span v-if="label" class="text-sm font-medium text-slate-700 dark:text-slate-200">{{ label }}</span>
    <select
      v-model="modelValue"
      class="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:focus:border-primary-300 dark:focus:ring-primary-900/40"
    >
      <option value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </label>
</template>
