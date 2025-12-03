<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseToggle from '@/components/base/BaseToggle.vue'
import { usePaymentAccountsStore } from '@/stores/paymentAccounts'
import { useAuthStore } from '@/stores/auth'
import type { PaymentAccount, PaymentAccountType } from '@/types'
import type { PaymentAccountInput } from '@/services/api/paymentAccountsApi'

const { t } = useI18n()
const auth = useAuthStore()
const paymentAccountsStore = usePaymentAccountsStore()

const showModal = ref(false)
const editing = ref<PaymentAccount | null>(null)
const form = reactive<PaymentAccountInput>({
  type: 'NEQUI',
  accountNumber: '',
  accountHolder: '',
  bankName: '',
  description: '',
  isActive: true
})
const errors = reactive<Record<string, string>>({})

const accountTypeOptions = computed(() => [
  { label: t('paymentAccounts.types.NEQUI'), value: 'NEQUI' },
  { label: t('paymentAccounts.types.BANCOLOMBIA'), value: 'BANCOLOMBIA' },
  { label: t('paymentAccounts.types.DAVIPLATA'), value: 'DAVIPLATA' },
  { label: t('paymentAccounts.types.BANK_ACCOUNT'), value: 'BANK_ACCOUNT' },
  { label: t('paymentAccounts.types.OTHER'), value: 'OTHER' }
])

const resetForm = (account?: PaymentAccount) => {
  form.type = account?.type || 'NEQUI'
  form.accountNumber = account?.accountNumber || ''
  form.accountHolder = account?.accountHolder || ''
  form.bankName = account?.bankName || ''
  form.description = account?.description || ''
  form.isActive = account?.isActive ?? true
  errors.accountNumber = ''
  errors.accountHolder = ''
}

const openCreate = () => {
  editing.value = null
  resetForm()
  showModal.value = true
}

const openEdit = (account: PaymentAccount) => {
  editing.value = account
  resetForm(account)
  showModal.value = true
}

const validate = () => {
  errors.accountNumber = form.accountNumber ? '' : 'Required'
  errors.accountHolder = form.accountHolder ? '' : 'Required'
  return !errors.accountNumber && !errors.accountHolder
}

const submit = async () => {
  if (!auth.merchantId) return
  if (!validate()) return

  if (editing.value) {
    await paymentAccountsStore.update(auth.merchantId, editing.value.id, { ...form })
  } else {
    await paymentAccountsStore.create(auth.merchantId, { ...form })
  }
  showModal.value = false
}

const toggleActive = async (account: PaymentAccount) => {
  if (!auth.merchantId) return
  await paymentAccountsStore.update(auth.merchantId, account.id, { isActive: !account.isActive })
}

const handleDelete = async (account: PaymentAccount) => {
  if (!auth.merchantId) return
  const confirmed = window.confirm(t('paymentAccounts.deleteConfirm'))
  if (!confirmed) return
  await paymentAccountsStore.remove(auth.merchantId, account.id)
}

watch(
  () => form.type,
  (type: PaymentAccountType) => {
    if (type !== 'BANK_ACCOUNT') {
      form.bankName = ''
    }
  }
)

onMounted(() => {
  if (auth.merchantId) paymentAccountsStore.fetch(auth.merchantId)
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold">{{ t('navigation.settings') }}</h1>
        <p class="text-slate-600">{{ t('landing.heroSubtitle') }}</p>
      </div>
      <BaseButton icon="plus" @click="openCreate">{{ t('paymentAccounts.add') }}</BaseButton>
    </div>

    <BaseCard>
      <div class="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 class="text-lg font-semibold">{{ t('paymentAccounts.title') }}</h3>
          <p class="text-sm text-slate-600">{{ t('paymentAccounts.description') }}</p>
        </div>
      </div>

      <div v-if="paymentAccountsStore.loading" class="text-sm text-slate-500">{{ t('common.loading') }}</div>
      <div v-else-if="!paymentAccountsStore.list.length" class="text-sm text-slate-600">
        <p class="mb-3">{{ t('paymentAccounts.empty') }}</p>
        <BaseButton size="sm" icon="plus" @click="openCreate">{{ t('paymentAccounts.add') }}</BaseButton>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-slate-500">
              <th class="py-2">{{ t('paymentAccounts.type') }}</th>
              <th class="py-2">{{ t('paymentAccounts.accountNumber') }}</th>
              <th class="py-2">{{ t('paymentAccounts.accountHolder') }}</th>
              <th class="py-2">{{ t('paymentAccounts.descriptionLabel') }}</th>
              <th class="py-2">{{ t('common.status') }}</th>
              <th class="py-2 text-right">{{ t('paymentAccounts.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="account in paymentAccountsStore.list" :key="account.id" class="border-t border-border/60">
              <td class="py-3 font-semibold">{{ t(`paymentAccounts.types.${account.type}`) }}</td>
              <td class="py-3">{{ account.accountNumber }}</td>
              <td class="py-3">{{ account.accountHolder }}</td>
              <td class="py-3">{{ account.description || '—' }}</td>
              <td class="py-3">
                <BaseBadge :variant="account.isActive ? 'success' : 'neutral'">
                  {{ account.isActive ? t('statuses.ACTIVE') : t('statuses.INACTIVE') }}
                </BaseBadge>
              </td>
              <td class="py-3 text-right space-x-2">
                <BaseButton variant="ghost" size="sm" icon="sliders" @click="openEdit(account)">
                  {{ t('paymentAccounts.edit') }}
                </BaseButton>
                <BaseButton variant="ghost" size="sm" icon="check" @click="toggleActive(account)">
                  {{ account.isActive ? t('statuses.INACTIVE') : t('statuses.ACTIVE') }}
                </BaseButton>
                <BaseButton variant="ghost" size="sm" icon="trash" @click="handleDelete(account)">
                  {{ t('common.delete') }}
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <BaseModal
      :open="showModal"
      :title="editing ? t('paymentAccounts.form.editTitle') : t('paymentAccounts.form.createTitle')"
      @close="showModal = false"
    >
      <form class="space-y-4" @submit.prevent="submit">
        <BaseSelect v-model="form.type" :label="t('paymentAccounts.type')" :options="accountTypeOptions" />
        <BaseInput
          v-model="form.accountNumber"
          :label="t('paymentAccounts.accountNumber')"
          placeholder="3001234567"
          :error="errors.accountNumber"
        />
        <BaseInput
          v-model="form.accountHolder"
          :label="t('paymentAccounts.accountHolder')"
          placeholder="Juan Perez"
          :error="errors.accountHolder"
        />
        <BaseInput
          v-if="form.type === 'BANK_ACCOUNT'"
          v-model="form.bankName"
          :label="t('paymentAccounts.bankName')"
          placeholder="Bancolombia"
        />
        <BaseInput
          v-model="form.description"
          :label="t('paymentAccounts.descriptionLabel')"
          :placeholder="t('paymentAccounts.descriptionLabel')"
        />
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-700 dark:text-slate-200">{{ t('paymentAccounts.isActive') }}</p>
            <p class="text-xs text-slate-500">{{ t('paymentAccounts.activeHint') }}</p>
          </div>
          <BaseToggle v-model="form.isActive" />
        </div>
        <div class="flex justify-end gap-3">
          <BaseButton type="button" variant="ghost" @click="showModal = false">
            {{ t('common.cancel') }}
          </BaseButton>
          <BaseButton type="submit">
            {{ editing ? t('common.update') : t('common.create') }}
          </BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>
