<script setup lang="ts">
import { ref } from 'vue'
import facebookService from '@/services/meta/embeddedSignupService'
import type { EmbeddedSignupPayload } from '@/services/api/whatsappLinesApi'

const props = defineProps<{
  configId: string
}>()

const emit = defineEmits<{
  complete: [EmbeddedSignupPayload]
  error: [unknown]
}>()

const loading = ref(false)

const startSignup = async () => {
  if (!props.configId || loading.value) return
  loading.value = true
  try {
    await facebookService.loadSDK()
    const code = await facebookService.launchEmbeddedSignup(props.configId)
    const accessToken = await facebookService.exchangeCodeForToken(code)
    const wabaId = await facebookService.getWABAIdFromToken(accessToken)

    await facebookService.subscribeWabaToWebhook(wabaId, accessToken)
    const phoneNumbers = await facebookService.getPhoneNumbers(wabaId, accessToken)
    const primaryPhone = phoneNumbers[0] || {}

    emit('complete', {
      access_token: accessToken,
      phone_number_id: primaryPhone.id || '',
      waba_id: wabaId,
      business_id: primaryPhone.business_id,
      phone_number: primaryPhone.phone_number || primaryPhone.display_phone_number,
      display_phone_number: primaryPhone.display_phone_number,
      phone_display_name:
        primaryPhone.verified_name || primaryPhone.name || primaryPhone.display_phone_number
    })
  } catch (error) {
    emit('error', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-3">
    <button
      class="w-full rounded-xl bg-primary-600 text-white py-3 font-semibold hover:bg-primary-700 transition"
      :disabled="loading || !props.configId"
      @click="startSignup"
    >
      <slot>{{ loading ? 'Processing...' : 'Start signup' }}</slot>
    </button>
  </div>
</template>
