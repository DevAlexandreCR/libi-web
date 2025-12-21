<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useBusinessHoursStore } from '@/stores/businessHours'
import { useAuthStore } from '@/stores/auth'
import type { DayOfWeek, BusinessHours } from '@/types'
import type { BusinessHoursInput } from '@/services/api/whatsappLinesApi'

const { t } = useI18n()
const router = useRouter()
const businessHoursStore = useBusinessHoursStore()
const auth = useAuthStore()

const loading = ref(false)
const saving = ref(false)

const daysOfWeek: { value: DayOfWeek; label: string }[] = [
  { value: 'MONDAY', label: 'Lunes' },
  { value: 'TUESDAY', label: 'Martes' },
  { value: 'WEDNESDAY', label: 'Miércoles' },
  { value: 'THURSDAY', label: 'Jueves' },
  { value: 'FRIDAY', label: 'Viernes' },
  { value: 'SATURDAY', label: 'Sábado' },
  { value: 'SUNDAY', label: 'Domingo' }
]

const businessHours = ref<Record<DayOfWeek, BusinessHoursInput>>({
  MONDAY: { dayOfWeek: 'MONDAY', isEnabled: true, openTime: '09:00', closeTime: '18:00', crossesMidnight: false },
  TUESDAY: { dayOfWeek: 'TUESDAY', isEnabled: true, openTime: '09:00', closeTime: '18:00', crossesMidnight: false },
  WEDNESDAY: { dayOfWeek: 'WEDNESDAY', isEnabled: true, openTime: '09:00', closeTime: '18:00', crossesMidnight: false },
  THURSDAY: { dayOfWeek: 'THURSDAY', isEnabled: true, openTime: '09:00', closeTime: '18:00', crossesMidnight: false },
  FRIDAY: { dayOfWeek: 'FRIDAY', isEnabled: true, openTime: '09:00', closeTime: '18:00', crossesMidnight: false },
  SATURDAY: { dayOfWeek: 'SATURDAY', isEnabled: true, openTime: '09:00', closeTime: '18:00', crossesMidnight: false },
  SUNDAY: { dayOfWeek: 'SUNDAY', isEnabled: false, openTime: '09:00', closeTime: '18:00', crossesMidnight: false }
})

onMounted(async () => {
  if (!auth.merchantId) return
  
  loading.value = true
  try {
    const hours = await businessHoursStore.fetchByMerchant(auth.merchantId)
    if (hours && hours.length > 0) {
      hours.forEach((h: BusinessHours) => {
        businessHours.value[h.dayOfWeek] = {
          dayOfWeek: h.dayOfWeek,
          isEnabled: h.isEnabled,
          openTime: h.openTime,
          closeTime: h.closeTime,
          crossesMidnight: h.crossesMidnight
        }
      })
    }
  } finally {
    loading.value = false
  }
})

const handleSave = async () => {
  if (!auth.merchantId) return
  
  saving.value = true
  try {
    const hoursArray = Object.values(businessHours.value)
    await businessHoursStore.updateByMerchant(auth.merchantId, hoursArray)
  } finally {
    saving.value = false
  }
}

const updateCrossesMidnight = (day: DayOfWeek) => {
  const hours = businessHours.value[day]
  const openMinutes = timeToMinutes(hours.openTime)
  const closeMinutes = timeToMinutes(hours.closeTime)
  hours.crossesMidnight = closeMinutes <= openMinutes
}

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  return (hours || 0) * 60 + (minutes || 0)
}

const copyToAll = (day: DayOfWeek) => {
  const source = businessHours.value[day]
  daysOfWeek.forEach((d) => {
    if (d.value !== day) {
      businessHours.value[d.value] = {
        ...businessHours.value[d.value],
        openTime: source.openTime,
        closeTime: source.closeTime,
        crossesMidnight: source.crossesMidnight
      }
    }
  })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <BaseButton variant="secondary" size="sm" @click="router.back()">
            ← {{ t('common.back') }}
          </BaseButton>
          <h1 class="text-2xl font-bold">🕐 {{ t('whatsapp.businessHours') }}</h1>
        </div>
        <p class="text-slate-600">{{ t('whatsapp.businessHoursDescriptionMerchant') }}</p>
      </div>
      <BaseButton :loading="saving" @click="handleSave">
        💾 {{ t('common.save') }}
      </BaseButton>
    </div>

    <BaseCard>
      <div v-if="loading" class="text-center py-8">
        <p class="text-slate-500">{{ t('common.loading') }}</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="day in daysOfWeek"
          :key="day.value"
          class="border border-border rounded-lg p-4"
        >
          <div class="flex items-center gap-4 flex-wrap">
            <div class="flex items-center gap-2 min-w-[120px]">
              <input
                :id="`enabled-${day.value}`"
                v-model="businessHours[day.value].isEnabled"
                type="checkbox"
                class="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <label :for="`enabled-${day.value}`" class="font-medium cursor-pointer">
                {{ day.label }}
              </label>
            </div>

            <div v-if="businessHours[day.value].isEnabled" class="flex items-center gap-3 flex-1">
              <div class="flex items-center gap-2">
                <label class="text-sm text-slate-600">{{ t('whatsapp.openTime') }}:</label>
                <input
                  v-model="businessHours[day.value].openTime"
                  type="time"
                  class="px-3 py-1.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  @change="updateCrossesMidnight(day.value)"
                />
              </div>

              <span class="text-slate-400">—</span>

              <div class="flex items-center gap-2">
                <label class="text-sm text-slate-600">{{ t('whatsapp.closeTime') }}:</label>
                <input
                  v-model="businessHours[day.value].closeTime"
                  type="time"
                  class="px-3 py-1.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  @change="updateCrossesMidnight(day.value)"
                />
              </div>

              <button
                type="button"
                class="text-xs text-primary hover:underline ml-auto"
                @click="copyToAll(day.value)"
              >
                {{ t('whatsapp.copyToAll') }}
              </button>
            </div>

            <div v-else class="text-sm text-slate-400 flex-1">
              {{ t('whatsapp.noService') }}
            </div>
          </div>

          <div
            v-if="businessHours[day.value].isEnabled && businessHours[day.value].crossesMidnight"
            class="mt-2 text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded"
          >
            ⚠️ {{ t('whatsapp.crossesMidnightWarning') }}
          </div>
        </div>
      </div>
    </BaseCard>

    <BaseCard>
      <h3 class="text-lg font-semibold mb-2">💡 {{ t('whatsapp.tips') }}</h3>
      <ul class="text-sm text-slate-600 space-y-1 list-disc list-inside">
        <li>{{ t('whatsapp.tip1') }}</li>
        <li>{{ t('whatsapp.tip2') }}</li>
        <li>{{ t('whatsapp.tip4') }}</li>
      </ul>
    </BaseCard>
  </div>
</template>
