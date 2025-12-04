<script setup lang="ts">
import { computed, onMounted, ref, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import { useSessionsStore } from '@/stores/sessions'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const route = useRoute()
const sessionsStore = useSessionsStore()
const auth = useAuthStore()

const sessionId = computed(() => route.params.id as string)
const session = computed(() => {
  const s = sessionsStore.selected
  if (s) {
    console.log('📊 Session computed:', { id: s.id, manualMode: s.manualMode, messagesCount: s.messages?.length })
  }
  return s
})
const messageText = ref('')
const errorMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (auth.merchantId && sessionId.value) {
    await sessionsStore.fetchById(auth.merchantId, sessionId.value)
    await nextTick()
    scrollToBottom()
  }
})

watch(() => session.value?.messages?.length, () => {
  nextTick(() => scrollToBottom())
})

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const toggleManualMode = async () => {
  if (!session.value) return
  
  try {
    if (session.value.manualMode) {
      await sessionsStore.resumeSession(session.value.id)
    } else {
      await sessionsStore.pauseSession(session.value.id)
    }
    errorMessage.value = ''
    console.log('Session después de toggle:', session.value)
  } catch (error) {
    console.error('Error en toggleManualMode:', error)
    errorMessage.value = t('sessions.errorTogglingMode')
  }
}

const sendMessage = async () => {
  if (!session.value || !messageText.value.trim()) return
  
  try {
    await sessionsStore.sendMessage(session.value.id, messageText.value.trim())
    messageText.value = ''
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = t('sessions.errorSendingMessage')
  }
}
</script>

<template>
  <div v-if="session" class="space-y-6">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold">
          {{ t('sessions.sessionId') }}: {{ session.id }}
        </h1>
        <p class="text-slate-600 dark:text-slate-300">{{ session.customerPhone }}</p>
      </div>
      <div class="flex items-center gap-2">
        <BaseBadge
          :variant="session.manualMode ? 'warning' : 'success'"
        >
          {{ session.manualMode ? t('sessions.manualMode') : t('sessions.autoMode') }}
        </BaseBadge>
        <BaseBadge
          :variant="
            session.status === 'CONFIRMED'
              ? 'success'
              : session.status === 'CANCELLED' || session.status === 'EXPIRED'
                ? 'neutral'
                : 'info'
          "
        >
          {{ t(`statuses.${session.status}`) }}
        </BaseBadge>
      </div>
    </div>

    <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm">
      {{ errorMessage }}
    </div>

    <div class="grid lg:grid-cols-3 gap-4">
      <BaseCard :title="t('sessions.conversation')" class="lg:col-span-2">
        <div class="space-y-4">
          <!-- Control de modo manual -->
          <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div class="flex items-center gap-2">
              <FaIcon 
                :icon="session.manualMode ? 'user' : 'robot'" 
                class="text-slate-600 dark:text-slate-400"
              />
              <span class="text-sm text-slate-700 dark:text-slate-300">
                {{ session.manualMode ? t('sessions.respondingManually') : t('sessions.botResponding') }}
              </span>
            </div>
            <BaseButton
              :variant="session.manualMode ? 'secondary' : 'primary'"
              size="sm"
              @click="toggleManualMode"
            >
              {{ session.manualMode ? t('sessions.releaseChat') : t('sessions.takeControl') }}
            </BaseButton>
          </div>

          <!-- Historial de mensajes -->
          <div ref="messagesContainer" class="space-y-3 max-h-[480px] overflow-y-auto pr-2 scroll-smooth">
            <div v-if="!session.messages || session.messages.length === 0" class="text-center text-slate-500 dark:text-slate-400 py-8">
              <FaIcon icon="comments" class="text-3xl mb-2 opacity-50" />
              <p class="text-sm">{{ t('sessions.noMessages') }}</p>
            </div>
            <div
              v-for="message in session.messages || []"
              :key="message.createdAt + message.role"
              class="flex"
              :class="message.role === 'assistant' ? 'justify-end' : 'justify-start'"
            >
              <div
              class="px-4 py-3 rounded-2xl max-w-[80%] shadow-soft"
              :class="
                message.role === 'assistant'
                  ? 'bg-primary-600 text-white rounded-tr-sm dark:bg-primary-500 dark:text-slate-900'
                  : message.role === 'system'
                    ? 'bg-slate-100 text-slate-800 border border-border dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700'
                    : 'bg-white text-slate-900 rounded-tl-sm border border-border dark:bg-slate-800 dark:text-slate-50 dark:border-slate-700'
              "
            >
              <p class="text-sm leading-relaxed">{{ message.content }}</p>
              <span class="text-[10px] opacity-70">{{ new Date(message.createdAt).toLocaleTimeString() }}</span>
            </div>
            </div>
          </div>

          <!-- Caja de texto para envío -->
          <div v-if="session.manualMode" class="pt-3 border-t border-border dark:border-slate-700">
            <form @submit.prevent="sendMessage" class="flex gap-2">
              <BaseInput
                v-model="messageText"
                :placeholder="t('sessions.typeMessage')"
                class="flex-1"
              />
              <BaseButton
                type="submit"
                :disabled="!messageText.trim() || sessionsStore.sendingMessage"
                :loading="sessionsStore.sendingMessage"
                icon="paper-plane"
              >
                {{ t('sessions.send') }}
              </BaseButton>
            </form>
          </div>
        </div>
      </BaseCard>

      <BaseCard :title="t('sessions.metadata')">
        <div class="space-y-3 text-sm">
          <div class="flex items-center justify-between">
            <span class="text-slate-600 dark:text-slate-400">{{ t('common.status') }}</span>
            <span class="font-semibold">{{ t(`statuses.${session.status}`) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-600 dark:text-slate-400">{{ t('sessions.lastInteraction') }}</span>
            <span class="font-semibold text-xs">{{ new Date(session.lastInteractionAt).toLocaleString() }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-600 dark:text-slate-400">{{ t('sessions.linkedOrder') }}</span>
            <span class="font-semibold">{{ session.orders?.[0]?.id || '—' }}</span>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
  <div v-else class="text-center text-slate-500 dark:text-slate-300 py-6">{{ t('common.loading') }}</div>
</template>
