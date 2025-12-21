<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import ChatMock from '@/components/landing/ChatMock.vue'
import { useNotificationStore } from '@/stores/notifications'
import { demoRequestsApi } from '@/services/api'

const router = useRouter()
const route = useRoute()
const { t, tm } = useI18n()
const notifications = useNotificationStore()

const steps = computed(() => tm('landing.steps') as { title: string; description: string }[])
const features = computed(() => tm('landing.features') as { title: string; description: string }[])
const faqs = computed(() => tm('landing.faq') as { q: string; a: string }[])
const merchantBullets = computed(() => tm('landing.merchantsBullets') as string[])

const demoFormSection = ref<HTMLElement | null>(null)
const demoForm = reactive({
  name: '',
  email: '',
  phone: '',
  company: '',
  notes: '',
  source: 'landing'
})
const formErrors = reactive<Record<string, string>>({})
const submitting = ref(false)
const submitSuccess = ref(false)

const scrollToDemoForm = async () => {
  await nextTick()
  demoFormSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const goToDemo = () => {
  if (route.name === 'landing' || route.name === 'demo' || route.hash === '#demo') {
    scrollToDemoForm()
  } else {
    router.push({ name: 'landing', hash: '#demo' })
  }
}

const validateDemoForm = () => {
  formErrors.name = demoForm.name ? '' : t('landing.demoForm.errors.name')
  formErrors.email =
    demoForm.email && /\S+@\S+\.\S+/.test(demoForm.email) ? '' : t('landing.demoForm.errors.email')
  formErrors.phone = demoForm.phone ? '' : t('landing.demoForm.errors.phone')
  return !formErrors.name && !formErrors.email && !formErrors.phone
}

const submitDemoRequest = async () => {
  submitSuccess.value = false
  if (!validateDemoForm()) return
  submitting.value = true
  try {
    await demoRequestsApi.create({
      name: demoForm.name,
      email: demoForm.email,
      phone: demoForm.phone,
      company: demoForm.company,
      message: demoForm.notes,
      source: demoForm.source
    })
    notifications.push({
      id: crypto.randomUUID(),
      type: 'success',
      title: t('common.success'),
      message: 'landing.demoForm.success'
    })
    submitSuccess.value = true
    Object.assign(demoForm, { name: '', email: '', phone: '', company: '', notes: '', source: 'landing' })
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (route.name === 'demo' || route.hash === '#demo') {
    scrollToDemoForm()
  }
})

watch(
  () => route.name,
  (name) => {
    if (name === 'demo' || route.hash === '#demo') {
      scrollToDemoForm()
    }
  }
)
</script>

<template>
  <section class="section pt-10 pb-16">
    <div class="grid lg:grid-cols-2 gap-10 items-center">
      <div class="space-y-6">
        <p
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm dark:bg-primary-900/30 dark:text-primary-100"
        >
          <span class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>AI + WhatsApp Commerce</span>
        </p>
        <h1 class="text-4xl sm:text-5xl font-bold leading-tight">
          {{ t('landing.heroTitle') }}
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-200">
          {{ t('landing.heroSubtitle') }}
        </p>
        <div class="flex flex-wrap gap-3">
          <BaseButton size="lg" @click="goToDemo">
            {{ t('landing.primaryCta') }}
          </BaseButton>
          <BaseButton variant="secondary" size="lg" @click="router.push({ name: 'login' })">
            {{ t('landing.secondaryCta') }}
          </BaseButton>
        </div>
        <div class="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-300">
          <div class="flex items-center gap-2">
            <span class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>{{ t('landing.merchantsTitle') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <FaIcon icon="clock" />
            <span>Live in minutes</span>
          </div>
        </div>
      </div>
      <div class="flex justify-center">
        <ChatMock />
      </div>
    </div>
  </section>

  <section class="section">
    <div class="grid md:grid-cols-2 gap-8 items-start">
      <div>
        <p class="text-sm uppercase tracking-wide text-primary-600 font-semibold mb-2 dark:text-primary-100">
          {{ t('landing.stepsTitle') }}
        </p>
        <h2 class="text-3xl font-bold mb-4 gradient-text">{{ t('landing.stepsTitle') }}</h2>
        <p class="text-slate-600 dark:text-slate-300 max-w-xl">
          {{ t('landing.heroSubtitle') }}
        </p>
      </div>
      <div class="grid sm:grid-cols-2 gap-4">
        <BaseCard v-for="step in steps" :key="step.title" class="relative overflow-hidden">
          <h3 class="font-semibold mb-2">{{ step.title }}</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300">{{ step.description }}</p>
        </BaseCard>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p class="text-sm uppercase tracking-wide text-primary-600 font-semibold mb-2 dark:text-primary-100">
            {{ t('landing.featuresTitle') }}
          </p>
          <h2 class="text-3xl font-bold">{{ t('landing.featuresTitle') }}</h2>
        </div>
        <BaseButton variant="secondary" icon="arrow-right" @click="goToDemo">
          {{ t('common.requestDemo') }}
        </BaseButton>
      </div>
      <div class="grid md:grid-cols-2 gap-4">
        <BaseCard v-for="feature in features" :key="feature.title" class="hover:-translate-y-1 transition">
          <h3 class="font-semibold text-lg mb-2">{{ feature.title }}</h3>
          <p class="text-slate-600 dark:text-slate-300 text-sm">{{ feature.description }}</p>
        </BaseCard>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="grid lg:grid-cols-2 gap-10 items-center">
      <div class="space-y-4">
        <p class="text-sm uppercase tracking-wide text-primary-600 font-semibold mb-2 dark:text-primary-100">
          {{ t('landing.merchantsTitle') }}
        </p>
        <h2 class="text-3xl font-bold">{{ t('landing.merchantsTitle') }}</h2>
        <ul class="space-y-3 text-slate-700 dark:text-slate-200">
          <li v-for="item in merchantBullets" :key="item" class="flex items-start gap-3">
            <FaIcon icon="check" class="text-green-500 mt-1" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
      <div class="card p-6">
        <h3 class="text-xl font-semibold mb-3">{{ t('whatsapp.embeddedTitle') }}</h3>
        <p class="text-slate-600 dark:text-slate-300 text-sm mb-4">{{ t('whatsapp.embeddedSubtitle') }}</p>
        <div class="flex items-center gap-3">
          <FaIcon icon="phone" class="text-primary-600 dark:text-primary-100" />
          <span class="font-medium">Meta Embedded Signup</span>
        </div>
        <div class="mt-4">
          <BaseButton icon="arrow-right" @click="goToDemo">
            {{ t('common.requestDemo') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </section>

  <section ref="demoFormSection" id="demo" class="section">
    <div class="grid lg:grid-cols-2 gap-10 items-start">
      <div class="space-y-4">
        <p class="text-sm uppercase tracking-wide text-primary-600 font-semibold mb-2 dark:text-primary-100">
          {{ t('landing.demoForm.title') }}
        </p>
        <h2 class="text-3xl font-bold">{{ t('landing.heroTitle') }}</h2>
        <p class="text-slate-600 dark:text-slate-300">{{ t('landing.demoForm.subtitle') }}</p>
        <div class="grid sm:grid-cols-2 gap-3">
          <BaseCard class="bg-gradient-to-br from-primary-50 to-white dark:from-primary-950/40 dark:to-slate-900">
            <h3 class="font-semibold mb-1 flex items-center gap-2">
              <FaIcon icon="bolt" class="text-primary-500" />
              {{ t('landing.stepsTitle') }}
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-300">{{ t('landing.heroSubtitle') }}</p>
          </BaseCard>
          <BaseCard class="bg-gradient-to-br from-green-50 to-white dark:from-green-900/30 dark:to-slate-900">
            <h3 class="font-semibold mb-1 flex items-center gap-2">
              <FaIcon icon="clock" class="text-green-500" />
              {{ t('landing.merchantsTitle') }}
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-300">
              {{ merchantBullets[0] }}
            </p>
          </BaseCard>
        </div>
      </div>
      <BaseCard class="p-6 shadow-card">
        <form class="space-y-4" @submit.prevent="submitDemoRequest">
          <div class="grid sm:grid-cols-2 gap-3">
            <BaseInput
              v-model="demoForm.name"
              :label="t('landing.demoForm.nameLabel')"
              :placeholder="t('common.name')"
              :error="formErrors.name"
              icon="user"
            />
            <BaseInput
              v-model="demoForm.email"
              type="email"
              :label="t('landing.demoForm.emailLabel')"
              placeholder="you@restaurant.com"
              :error="formErrors.email"
              icon="envelope"
            />
            <BaseInput
              v-model="demoForm.phone"
              :label="t('landing.demoForm.phoneLabel')"
              placeholder="+34 600 000 000"
              :error="formErrors.phone"
              icon="phone"
            />
            <BaseInput
              v-model="demoForm.company"
              :label="t('landing.demoForm.companyLabel')"
              placeholder="Pizza Studio"
              icon="store"
            />
          </div>
          <label class="block space-y-1.5">
            <span class="text-sm font-medium text-slate-700 dark:text-slate-200">
              {{ t('landing.demoForm.notesLabel') }}
            </span>
            <textarea
              v-model="demoForm.notes"
              rows="3"
              class="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder-slate-500 dark:focus:border-primary-300 dark:focus:ring-primary-900/40"
              :placeholder="t('landing.demoForm.notesPlaceholder')"
            />
          </label>
          <div class="space-y-2">
            <BaseButton type="submit" block icon="arrow-right" :loading="submitting">
              {{ t('landing.demoForm.submit') }}
            </BaseButton>
            <p v-if="submitSuccess" class="text-sm text-green-600 dark:text-green-300">
              {{ t('landing.demoForm.success') }}
            </p>
          </div>
        </form>
      </BaseCard>
    </div>
  </section>

  <section class="section">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-6">
        <p class="text-sm uppercase tracking-wide text-primary-600 font-semibold mb-2 dark:text-primary-100">
          {{ t('landing.faqTitle') }}
        </p>
        <h2 class="text-3xl font-bold">{{ t('landing.faqTitle') }}</h2>
      </div>
      <div class="space-y-3">
        <details v-for="faq in faqs" :key="faq.q" class="card p-4">
          <summary class="cursor-pointer font-semibold flex items-center justify-between">
            <span>{{ faq.q }}</span>
            <FaIcon icon="chevron-down" />
          </summary>
          <p class="mt-2 text-slate-600 dark:text-slate-300">{{ faq.a }}</p>
        </details>
      </div>
    </div>
  </section>
</template>
