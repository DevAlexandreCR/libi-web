<script setup lang="ts">
const modelValue = defineModel<boolean>({ required: true })
</script>

<template>
  <button
    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
    :class="modelValue ? 'bg-primary-500' : 'bg-slate-300'"
    @click="modelValue = !modelValue"
  >
    <span
      class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200"
      :class="modelValue ? 'translate-x-5' : 'translate-x-1'"
    />
  </button>
</template>
