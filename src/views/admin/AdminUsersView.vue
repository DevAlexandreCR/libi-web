<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import { useUsersStore } from '@/stores/users'
import { useMerchantStore } from '@/stores/merchants'
import { useNotificationStore } from '@/stores/notifications'
import type { UserRole } from '@/types'

const { t } = useI18n()
const usersStore = useUsersStore()
const merchantsStore = useMerchantStore()
const notifications = useNotificationStore()

const form = reactive<{
  email: string
  password: string
  role: UserRole
  merchantId: string
}>({
  email: '',
  password: '',
  role: 'MERCHANT_ADMIN',
  merchantId: '',
})

const roleOptions = computed(() => [
  { value: 'MERCHANT_ADMIN', label: t('users.roles.MERCHANT_ADMIN') },
  { value: 'SUPER_ADMIN', label: t('users.roles.SUPER_ADMIN') },
])

const merchantOptions = computed(() =>
  merchantsStore.merchants.map((merchant) => ({
    value: merchant.id,
    label: merchant.name,
  }))
)

const roleVariant: Record<UserRole, 'info' | 'success'> = {
  MERCHANT_ADMIN: 'info',
  SUPER_ADMIN: 'success',
}

const resetForm = () => {
  form.email = ''
  form.password = ''
  form.merchantId = ''
}

const handleSubmit = async () => {
  if (form.role === 'MERCHANT_ADMIN' && !form.merchantId) {
    notifications.push({
      id: crypto.randomUUID(),
      type: 'error',
      title: 'Error',
      message: 'users.merchantRequired',
    })
    return
  }

  try {
    await usersStore.create({
      email: form.email,
      password: form.password,
      role: form.role,
      merchantId: form.role === 'MERCHANT_ADMIN' ? form.merchantId : undefined,
    })
    resetForm()
  } catch (error) {
    // The request layer handles notifications
  }
}

onMounted(() => {
  usersStore.fetch()
  merchantsStore.fetch()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold">{{ t('users.title') }}</h1>
        <p class="text-slate-600 dark:text-slate-300">{{ t('users.subtitle') }}</p>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <BaseCard :title="t('users.listTitle')">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-slate-500">
                <th class="py-2">{{ t('common.email') }}</th>
                <th class="py-2">{{ t('common.role') }}</th>
                <th class="py-2">{{ t('common.merchant') }}</th>
                <th class="py-2">{{ t('common.createdAt') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in usersStore.users" :key="user.id" class="border-t border-border/60">
                <td class="py-3">
                  <div class="font-semibold">{{ user.email }}</div>
                  <div class="text-xs text-slate-500">{{ user.id }}</div>
                </td>
                <td class="py-3">
                  <BaseBadge :variant="roleVariant[user.role]">
                    {{ t(`users.roles.${user.role}`) }}
                  </BaseBadge>
                </td>
                <td class="py-3">
                  <div class="text-sm">
                    <p class="font-medium">
                      {{ user.merchant?.name || t('users.noMerchant') }}
                    </p>
                    <p v-if="user.merchant?.slug" class="text-xs text-slate-500">
                      {{ user.merchant.slug }}
                    </p>
                  </div>
                </td>
                <td class="py-3 whitespace-nowrap">
                  {{ user.createdAt ? new Date(user.createdAt).toLocaleString() : '—' }}
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="!usersStore.users.length" class="text-center text-slate-500 py-6">
            {{ usersStore.loading ? t('common.loading') : t('users.empty') }}
          </div>
        </div>
      </BaseCard>

      <BaseCard :title="t('users.createTitle')">
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <BaseInput
            v-model="form.email"
            :label="t('common.email')"
            type="email"
            placeholder="merchant@libi.com"
          />
          <BaseInput
            v-model="form.password"
            :label="t('common.password')"
            type="password"
            placeholder="••••••••"
          />
          <BaseSelect v-model="form.role" :label="t('common.role')" :options="roleOptions" />
          <BaseSelect
            v-if="form.role === 'MERCHANT_ADMIN'"
            v-model="form.merchantId"
            :label="t('common.merchant')"
            :options="merchantOptions"
            :placeholder="t('users.merchantPlaceholder')"
          />
          <BaseButton type="submit" class="w-full" :loading="usersStore.creating">
            {{ t('common.create') }}
          </BaseButton>
        </form>
      </BaseCard>
    </div>
  </div>
</template>
