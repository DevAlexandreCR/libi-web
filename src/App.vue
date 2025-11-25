<script setup lang="ts">
import { RouterView } from 'vue-router'
import NotificationCenter from './components/NotificationCenter.vue'
</script>

<template>
  <div class="min-h-screen text-slate-900">
    <NotificationCenter />
    <RouterView v-slot="{ Component, route }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </Transition>
    </RouterView>
  </div>
</template>
