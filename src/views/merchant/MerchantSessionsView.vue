<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import { useSessionsStore } from '@/stores/sessions'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const router = useRouter()
const sessionsStore = useSessionsStore()
const auth = useAuthStore()

const fetchSessions = async () => {
  if (!auth.merchantId) return
  await sessionsStore.fetch(auth.merchantId)
}

onMounted(() => {
  fetchSessions()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold">{{ t('sessions.title') }}</h1>
        <p class="text-slate-600">{{ t('landing.heroSubtitle') }}</p>
      </div>
      <BaseButton variant="secondary" icon="arrow-right" @click="fetchSessions">
        {{ t('common.apply') }}
      </BaseButton>
    </div>

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
              <td class="py-3">{{ session.customerPhone }}</td>
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
