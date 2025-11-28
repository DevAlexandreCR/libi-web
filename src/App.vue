<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import NotificationCenter from './components/NotificationCenter.vue'
import { useThemeStore } from '@/stores/theme'

const theme = useThemeStore()

onMounted(() => {
  theme.init()
})
</script>

<template>
  <div class="min-h-screen bg-[var(--bg)] text-slate-900 dark:text-slate-100 transition-colors duration-200">
    <NotificationCenter />
    <RouterView v-slot="{ Component, route }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </Transition>
    </RouterView>
  </div>
</template>
