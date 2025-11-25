<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  icon?: string
  accent?: 'blue' | 'orange' | 'green'
}>()
</script>

<template>
  <div class="card p-5 flex items-center gap-4">
    <div
      class="h-12 w-12 rounded-2xl flex items-center justify-center text-white"
      :class="{
        'bg-primary-500': accent === 'blue' || !accent,
        'bg-accent-500': accent === 'orange',
        'bg-green-500': accent === 'green'
      }"
    >
      <FaIcon :icon="icon || 'chart-line'" />
    </div>
    <div class="flex-1">
      <p class="text-sm text-slate-500">{{ label }}</p>
      <p class="text-2xl font-bold">{{ value }}</p>
    </div>
  </div>
</template>
