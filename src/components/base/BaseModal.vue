<script setup lang="ts">
defineProps<{
  open: boolean
  title?: string
}>()
defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
        @click.self="$emit('close')"
      >
        <div class="card max-w-2xl w-full p-6 relative">
          <button class="absolute right-3 top-3 text-slate-500 hover:text-slate-900" @click="$emit('close')">✕</button>
          <h3 v-if="title" class="text-xl font-semibold mb-4">{{ title }}</h3>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
