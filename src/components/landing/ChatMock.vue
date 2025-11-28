<script setup lang="ts">
const messages = [
  { role: 'user', textKey: 'landing.chatCustomer', time: '12:04' },
  { role: 'assistant', textKey: 'landing.chatAssistant', time: '12:04' }
]
</script>

<template>
  <div class="card p-4 w-full max-w-md shadow-soft animate-float">
    <div class="flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-slate-300">
      <div class="flex items-center gap-2">
        <span class="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
        <span>WhatsApp</span>
      </div>
      <FaIcon icon="whatsapp" class="text-green-500" />
    </div>
    <div class="space-y-3">
      <div
        v-for="message in messages"
        :key="message.time + message.role"
        class="flex"
        :class="message.role === 'assistant' ? 'justify-end' : 'justify-start'"
      >
        <div
          class="rounded-2xl px-4 py-3 max-w-[80%] shadow-soft"
          :class="
            message.role === 'assistant'
              ? 'bg-primary-600 text-white rounded-tr-sm dark:bg-primary-500 dark:text-slate-900'
              : 'bg-white text-slate-900 rounded-tl-sm border border-border dark:bg-slate-800 dark:text-slate-50 dark:border-slate-700'
          "
        >
          <p class="text-sm leading-relaxed">
            <slot :name="message.textKey">
              {{ $t(message.textKey) }}
            </slot>
          </p>
          <span class="block mt-1 text-[10px] opacity-75">{{ message.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
