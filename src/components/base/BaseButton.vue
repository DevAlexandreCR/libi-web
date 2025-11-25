<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
  block?: boolean
  type?: 'button' | 'submit' | 'reset'
  icon?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}>()

const variantClasses: Record<string, string> = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-card',
  secondary: 'bg-white text-primary-700 border border-primary-100 hover:border-primary-200 shadow-soft',
  ghost: 'bg-transparent border border-border text-slate-700 hover:border-primary-300'
}

const classes = computed(
  () =>
    `${variantClasses[props.variant || 'primary']} ${
      props.block ? 'w-full' : ''
    } inline-flex items-center justify-center gap-2 ${
      props.size === 'lg' ? 'px-5 py-3 text-base' : props.size === 'sm' ? 'px-3 py-2 text-sm' : 'px-4 py-2.5'
    } rounded-xl font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed`
)
</script>

<template>
  <button :type="type || 'button'" :class="classes" :disabled="disabled || loading">
    <span v-if="loading" class="flex items-center gap-2">
      <FaIcon icon="circle-notch" class="animate-spin" />
      <slot name="loading">Loading</slot>
    </span>
    <span v-else class="flex items-center gap-2">
      <FaIcon v-if="icon" :icon="icon" />
      <slot />
    </span>
  </button>
</template>
