<script setup lang="ts">
import { onMounted, onErrorCaptured } from 'vue'
import { RouterView } from 'vue-router'
import NotificationCenter from './components/NotificationCenter.vue'
import { useThemeStore } from '@/stores/theme'

const theme = useThemeStore()

onMounted(() => {
  theme.init()
})

// Capturar errores de renderizado de componentes hijos
onErrorCaptured((err, instance, info) => {
  console.error('[App] Error captured:', err)
  console.error('[App] Component:', instance)
  console.error('[App] Error info:', info)
  // Retornar false previene que el error se propague más
  return false
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
