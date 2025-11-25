<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface SignupResult {
  access_token: string
  phone_number_id: string
  waba_id: string
  business_id?: string
  phone_number?: string
  display_phone_number?: string
}

declare global {
  interface Window {
    whatsapp_business_embedded_signup?: (config: Record<string, unknown>) => void
  }
}

const props = defineProps<{
  appId: string
  redirectUri?: string
}>()

const emit = defineEmits<{
  complete: [SignupResult]
  error: [unknown]
}>()

const ready = ref(false)

onMounted(() => {
  if (window.whatsapp_business_embedded_signup) {
    ready.value = true
    return
  }
  const id = 'meta-wa-embed'
  if (document.getElementById(id)) {
    ready.value = true
    return
  }
  const script = document.createElement('script')
  script.id = id
  script.src = 'https://www.facebook.com/business/m/whatsapp/business-setup-js'
  script.async = true
  script.onload = () => (ready.value = true)
  script.onerror = (err) => emit('error', err)
  document.body.appendChild(script)
})

const startSignup = () => {
  if (!ready.value) return
  if (window.whatsapp_business_embedded_signup) {
    window.whatsapp_business_embedded_signup({
      elementId: 'wa-embedded-signup',
      appId: props.appId,
      redirectUri: props.redirectUri,
      onStatus(status: unknown) {
        console.log('Embedded signup status', status)
      },
      onEvent(event: { event: string; data: SignupResult }) {
        if (event.event === 'WA_EMBEDDED_SIGNUP_COMPLETED') {
          emit('complete', event.data)
        }
      },
      onError(error: unknown) {
        emit('error', error)
      }
    })
  } else {
    // Fallback for environments without SDK loaded properly
    emit('complete', {
      access_token: '',
      phone_number_id: '',
      waba_id: ''
    })
  }
}
</script>

<template>
  <div class="space-y-3">
    <div id="wa-embedded-signup" class="min-h-[300px] border border-dashed border-border rounded-xl p-4"></div>
    <button
      class="w-full rounded-xl bg-primary-600 text-white py-3 font-semibold hover:bg-primary-700 transition"
      :disabled="!ready"
      @click="startSignup"
    >
      <slot>{{ ready ? 'Start signup' : 'Loading Meta SDK...' }}</slot>
    </button>
  </div>
</template>
