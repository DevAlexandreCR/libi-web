<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import { useSessionsStore } from '@/stores/sessions'
import { useAuthStore } from '@/stores/auth'
import type { SessionStatus } from '@/types'

const { t } = useI18n()
const router = useRouter()
const sessionsStore = useSessionsStore()
const auth = useAuthStore()
const activeSessionStatuses: SessionStatus[] = ['NEW', 'COLLECTING_ITEMS', 'REVIEWING', 'SUPPORT']

const maskPhone = (phone: string) => phone.slice(0, -4).replace(/[0-9]/g, '*') + phone.slice(-4)
const activeSessionsByStatus = computed(() => {
  const list = Array.isArray(sessionsStore.list) ? sessionsStore.list : []
  const active = list.filter(session => session && activeSessionStatuses.includes(session.status))
  return activeSessionStatuses.map(status => ({
    status,
    sessions: active.filter(session => session.status === status)
  }))
})
const activeSessionsTotal = computed(() =>
  activeSessionsByStatus.value.reduce((count, group) => count + group.sessions.length, 0)
)

const fetchSessions = async () => {
  if (!auth.merchantId) return
  await sessionsStore.fetch(auth.merchantId)
}

// Watch merchantId to load data when it becomes available
watch(() => auth.merchantId, (newMerchantId) => {
  if (newMerchantId) {
    fetchSessions()
  }
}, { immediate: true })

onMounted(() => {
  if (auth.merchantId) {
    fetchSessions()
  }
})

const openSession = (id: string) => {
  router.push({ name: 'merchant-session-detail', params: { id } })
}
</script>

<template>
  <div v-if="!auth.merchantId" class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <p class="text-slate-500">{{ t('common.loading') }}</p>
    </div>
  </div>
  <div v-else class="space-y-6">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold">{{ t('sessions.title') }}</h1>
        <p class="text-slate-600">{{ t('landing.heroSubtitle') }}</p>
      </div>
    </div>

    <BaseCard
      class="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 text-white border-none shadow-2xl ring-1 ring-white/10"
    >
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-12 left-4 h-36 w-36 rounded-full bg-indigo-500/25 blur-3xl" />
        <div class="absolute -bottom-10 right-10 h-32 w-32 rounded-full bg-cyan-400/25 blur-3xl" />
      </div>
      <div class="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">{{ t('sessions.liveBoard.pulse') }}</p>
          <h2 class="text-2xl font-bold">{{ t('sessions.liveBoard.title') }}</h2>
          <p class="text-sm text-white/70">{{ t('sessions.liveBoard.subtitle') }}</p>
        </div>
        <div class="flex items-center gap-3 flex-wrap justify-end">
          <div class="px-3 py-2 rounded-xl bg-white/10 backdrop-blur text-sm font-semibold border border-white/10">
            {{ t('sessions.liveBoard.activeCount', { count: activeSessionsTotal }) }}
          </div>
          <BaseButton
            size="sm"
            variant="ghost"
            class="text-white border border-white/30 hover:bg-white/10"
            icon="arrow-rotate-right"
            @click="fetchSessions"
          >
            {{ t('sessions.liveBoard.refresh') }}
          </BaseButton>
        </div>
      </div>

      <div class="relative mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="group in activeSessionsByStatus"
          :key="group.status"
          class="rounded-2xl bg-white/5 border border-white/10 p-3 backdrop-blur"
        >
          <div class="flex items-center justify-between gap-2 mb-2">
            <div class="flex items-center gap-2">
              <span
                class="h-2.5 w-2.5 rounded-full"
                  :class="{
                    'bg-emerald-300 shadow-[0_0_0_4px_rgba(74,222,128,0.18)]': group.status === 'NEW',
                    'bg-sky-300 shadow-[0_0_0_4px_rgba(125,211,252,0.18)]': group.status === 'COLLECTING_ITEMS',
                  'bg-amber-300 shadow-[0_0_0_4px_rgba(251,191,36,0.18)]': group.status === 'REVIEWING',
                  'bg-fuchsia-300 shadow-[0_0_0_4px_rgba(244,114,182,0.18)]': group.status === 'SUPPORT'
                  }"
                />
              <p class="font-semibold text-sm">{{ t(`statuses.${group.status}`) }}</p>
            </div>
            <span class="text-xs text-white/70 px-2 py-1 rounded-full bg-white/5 border border-white/10">
              {{ group.sessions.length }}
            </span>
          </div>
          <div class="space-y-2 max-h-64 overflow-y-auto pr-1">
            <div
              v-if="!group.sessions.length"
              class="text-xs text-white/60 py-3 text-center border border-dashed border-white/15 rounded-xl"
            >
              {{ t('sessions.liveBoard.emptyStatus') }}
            </div>
            <div
              v-for="session in group.sessions"
              :key="session.id"
              class="rounded-xl bg-white/10 border border-white/10 p-3 space-y-3 shadow-inner"
            >
              <div class="flex items-center justify-between gap-2">
                <p class="text-sm font-semibold">{{ maskPhone(session.customerPhone) }}</p>
                <span
                  v-if="session.isManualMode"
                  class="text-[11px] px-2 py-1 rounded-full bg-rose-400/20 text-rose-50 border border-rose-100/40"
                >
                  {{ t('sessions.manualMode') }}
                </span>
              </div>
              <div class="flex items-center flex-wrap gap-2 text-xs text-white/80">
                <span class="px-2 py-1 rounded-full bg-white/10 border border-white/10">
                  {{ t('sessions.lastInteraction') }}: {{ new Date(session.lastInteractionAt).toLocaleTimeString() }}
                </span>
                <span
                  v-if="session.orders?.length"
                  class="px-2 py-1 rounded-full bg-white/10 border border-white/10"
                >
                  {{ t('sessions.linkedOrder') }}: {{ session.orders?.[0]?.id }}
                </span>
              </div>
              <div class="flex items-center justify-between text-xs text-white/60">
                <span>{{ t('orders.createdAt') }}: {{ new Date(session.lastInteractionAt).toLocaleDateString() }}</span>
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
              <BaseButton class="w-full" size="sm" variant="ghost" icon="arrow-right" @click="openSession(session.id)">
                {{ t('sessions.liveBoard.open') }}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>

    <BaseCard>
      <div class="grid sm:grid-cols-3 gap-4 mb-4">
        <BaseSelect
          v-model="sessionsStore.filters.status"
          :label="t('sessions.status')"
          :options="[
            { label: t('statuses.NEW'), value: 'NEW' },
            { label: t('statuses.COLLECTING_ITEMS'), value: 'COLLECTING_ITEMS' },
            { label: t('statuses.REVIEWING'), value: 'REVIEWING' },
            { label: t('statuses.CONFIRMED'), value: 'CONFIRMED' },
            { label: t('statuses.CANCELLED'), value: 'CANCELLED' },
            { label: t('statuses.EXPIRED'), value: 'EXPIRED' }
          ]"
          :placeholder="t('common.status')"
        />
        <BaseInput v-model="sessionsStore.filters.from" :label="t('orders.filters.dateRange')" type="date" />
        <BaseInput v-model="sessionsStore.filters.to" :label="' '" type="date" />
      </div>
      <div class="flex justify-end mb-2">
        <BaseButton class="w-full sm:w-auto" @click="fetchSessions">{{ t('common.apply') }}</BaseButton>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-slate-500">
              <th class="py-2">{{ t('sessions.sessionId') }}</th>
              <th class="py-2">{{ t('common.phone') }}</th>
              <th class="py-2">{{ t('sessions.status') }}</th>
              <th class="py-2">{{ t('sessions.lastInteraction') }}</th>
              <th class="py-2">{{ t('sessions.linkedOrder') }}</th>
              <th class="py-2 text-right">{{ t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="session in sessionsStore.list" :key="session.id" class="border-t border-border/60">
              <td class="py-3 font-semibold">{{ session.id }}</td>
              <td class="py-3">{{ maskPhone(session.customerPhone) }}</td>
              <td class="py-3">
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
              </td>
              <td class="py-3">{{ new Date(session.lastInteractionAt).toLocaleString() }}</td>
              <td class="py-3">{{ session.orders?.[0]?.id || '—' }}</td>
              <td class="py-3 text-right">
                <BaseButton
                  variant="ghost"
                  size="sm"
                  icon="eye"
                  @click="router.push({ name: 'merchant-session-detail', params: { id: session.id } })"
                >
                  {{ t('common.view') }}
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="sessionsStore.loadingList" class="text-center text-slate-500 py-6">
          {{ t('common.loading') }}
        </div>
      </div>
    </BaseCard>
  </div>
</template>
