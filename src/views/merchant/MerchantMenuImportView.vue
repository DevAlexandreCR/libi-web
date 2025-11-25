<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import { useMenuStore } from '@/stores/menu'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const menuStore = useMenuStore()
const auth = useAuthStore()
const dragOver = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const handleFiles = async (files: FileList | null) => {
  if (!files || !files.length || !auth.merchantId) return
  await menuStore.uploadAndProcess(auth.merchantId, Array.from(files))
}

const onDrop = (event: DragEvent) => {
  dragOver.value = false
  event.preventDefault()
  handleFiles(event.dataTransfer?.files || null)
}

const openFileDialog = () => fileInput.value?.click()

const accept = async () => {
  if (!auth.merchantId) return
  await menuStore.acceptImport(auth.merchantId)
}

const reloadMenu = async () => {
  if (!auth.merchantId) return
  await menuStore.fetch(auth.merchantId)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold">{{ t('menu.menuImport') }}</h1>
        <p class="text-slate-600">{{ t('landing.heroSubtitle') }}</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-4">
      <BaseCard>
        <div
          class="border-2 border-dashed rounded-2xl p-6 text-center transition bg-surface"
          :class="dragOver ? 'border-primary-400 bg-primary-50' : 'border-border'"
          @dragover.prevent="dragOver = true"
          @dragleave.prevent="dragOver = false"
          @drop="onDrop"
        >
          <input ref="fileInput" type="file" class="hidden" multiple accept="image/*" @change="(e) => handleFiles((e.target as HTMLInputElement).files)" />
          <div class="flex flex-col items-center gap-3">
            <FaIcon icon="upload" class="text-primary-600 text-2xl" />
            <p class="font-semibold">{{ t('menu.uploadHint') }}</p>
            <BaseButton variant="secondary" @click="openFileDialog">
              {{ t('common.upload') }}
            </BaseButton>
          </div>
        </div>
        <p v-if="menuStore.processing" class="mt-3 text-sm text-primary-700 flex items-center gap-2">
          <FaIcon icon="circle-notch" class="animate-spin" />
          {{ t('menu.processing') }}
        </p>
      </BaseCard>

      <BaseCard v-if="menuStore.preview" :title="t('menu.previewTitle')">
        <div class="space-y-3">
          <div v-for="category in menuStore.preview.categories" :key="category.id" class="border border-border rounded-xl p-3">
            <div class="flex items-center justify-between mb-2">
              <p class="font-semibold">{{ category.name }}</p>
              <BaseBadge variant="info">{{ category.items.length }} items</BaseBadge>
            </div>
            <ul class="space-y-2 text-sm text-slate-700">
              <li v-for="item in category.items" :key="item.id" class="flex items-center justify-between">
                <span>{{ item.name }}</span>
                <span class="font-semibold">${{ item.price.toFixed(2) }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="flex gap-3 mt-4">
          <BaseButton :loading="menuStore.processing" @click="accept">{{ t('menu.accept') }}</BaseButton>
          <BaseButton variant="ghost" @click="reloadMenu">{{ t('menu.reload') }}</BaseButton>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
