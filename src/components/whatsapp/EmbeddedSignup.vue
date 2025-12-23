<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import facebookService from '@/services/meta/embeddedSignupService'
import { useWhatsappLinesStore } from '@/stores/whatsappLines'
import { useNotificationStore } from '@/stores/notifications'

const props = defineProps<{
  configId: string
  merchantId?: string | null
}>()

const loading = ref(false)
const { t } = useI18n()
const whatsappLinesStore = useWhatsappLinesStore()
const notifications = useNotificationStore()

const isProcessing = computed(() => loading.value || whatsappLinesStore.connecting)

onMounted(() => {
  facebookService.loadSDK().catch((error) => {
    console.error('Failed to load Facebook SDK:', error)
    notifications.push({
      id: crypto.randomUUID(),
      type: 'error',
      title: t('common.error'),
      message: 'No se pudo cargar el SDK de Meta.'
    })
  })
})

const startSignup = async () => {
  if (!props.configId || isProcessing.value) return

  if (!props.merchantId) {
    notifications.push({
      id: crypto.randomUUID(),
      type: 'error',
      title: t('common.error'),
      message: 'No encontramos el comercio para completar la conexión.'
    })
    return
  }

  loading.value = true
  try {
    const merchantId = props.merchantId as string

    await facebookService.loadSDK()
    const code = await facebookService.launchEmbeddedSignup(props.configId)
    const accessToken = await facebookService.exchangeCodeForToken(code)
    const wabaId = await facebookService.getWABAIdFromToken(accessToken)

    await facebookService.subscribeWabaToWebhook(wabaId, accessToken)
    const phoneNumbers = await facebookService.getPhoneNumbers(wabaId, accessToken)

    if (!phoneNumbers.length) {
      throw new Error('No phone numbers found')
    }

    const latestPhone = phoneNumbers[phoneNumbers.length - 1]

    await whatsappLinesStore.completeEmbeddedSignup(merchantId, {
      access_token: accessToken,
      phone_number_id: latestPhone.id,
      waba_id: wabaId,
      business_id: latestPhone.business_id,
      phone_number: latestPhone.phone_number || latestPhone.display_phone_number,
      display_phone_number: latestPhone.display_phone_number,
      phone_display_name:
        latestPhone.verified_name || latestPhone.name || latestPhone.display_phone_number
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al conectar la línea'
    const isCancelled = message === 'User cancelled or did not authorize'

    notifications.push({
      id: crypto.randomUUID(),
      type: isCancelled ? 'info' : 'error',
      title: isCancelled ? 'Info' : t('common.error'),
      message: isCancelled ? 'Conexión cancelada por el usuario.' : message
    })

    console.error('Embedded signup error', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-3">
    <button
      class="w-full rounded-xl bg-primary-600 text-white py-3 font-semibold hover:bg-primary-700 transition"
      :disabled="isProcessing || !props.configId || !props.merchantId"
      @click="startSignup"
    >
      <slot>{{ isProcessing ? 'Processing...' : 'Start signup' }}</slot>
    </button>
  </div>
</template>
