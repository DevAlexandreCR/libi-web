<script setup lang="ts">
defineProps<{
  height?: string
  width?: string
  rounded?: string
}>()
</script>

<template>
  <div
    class="animate-pulse bg-slate-200 dark:bg-slate-700"
    :style="{ height: height || '1rem', width: width || '100%', borderRadius: rounded || '0.5rem' }"
  ></div>
</template>
