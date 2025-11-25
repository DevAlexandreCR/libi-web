<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
}>()
</script>

<template>
  <div class="card p-6">
    <header v-if="title || subtitle" class="mb-4">
      <h3 v-if="title" class="text-lg font-semibold">{{ title }}</h3>
      <p v-if="subtitle" class="text-sm text-muted">{{ subtitle }}</p>
    </header>
    <slot />
  </div>
</template>
