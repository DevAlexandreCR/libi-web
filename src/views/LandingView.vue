<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import ChatMock from '@/components/landing/ChatMock.vue'

const router = useRouter()
const { t, tm } = useI18n()

const steps = computed(() => tm('landing.steps') as { title: string; description: string }[])
const features = computed(() => tm('landing.features') as { title: string; description: string }[])
const plans = computed(() => tm('landing.plans') as { name: string; price: string; description: string }[])
const faqs = computed(() => tm('landing.faq') as { q: string; a: string }[])
const merchantBullets = computed(() => tm('landing.merchantsBullets') as string[])
</script>

<template>
  <section class="section pt-10 pb-16">
    <div class="grid lg:grid-cols-2 gap-10 items-center">
      <div class="space-y-6">
        <p class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm">
          <span class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>AI + WhatsApp Commerce</span>
        </p>
        <h1 class="text-4xl sm:text-5xl font-bold leading-tight">
          {{ t('landing.heroTitle') }}
        </h1>
        <p class="text-lg text-slate-600">
          {{ t('landing.heroSubtitle') }}
        </p>
        <div class="flex flex-wrap gap-3">
          <BaseButton size="lg" @click="router.push({ name: 'demo' })">
            {{ t('landing.primaryCta') }}
          </BaseButton>
          <BaseButton variant="secondary" size="lg" @click="router.push({ name: 'login' })">
            {{ t('landing.secondaryCta') }}
          </BaseButton>
        </div>
        <div class="flex items-center gap-4 text-sm text-slate-500">
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
        <p class="text-sm uppercase tracking-wide text-primary-600 font-semibold mb-2">
          {{ t('landing.stepsTitle') }}
        </p>
        <h2 class="text-3xl font-bold mb-4 gradient-text">{{ t('landing.stepsTitle') }}</h2>
        <p class="text-slate-600 max-w-xl">
          {{ t('landing.heroSubtitle') }}
        </p>
      </div>
      <div class="grid sm:grid-cols-2 gap-4">
        <BaseCard v-for="step in steps" :key="step.title" class="relative overflow-hidden">
          <h3 class="font-semibold mb-2">{{ step.title }}</h3>
          <p class="text-sm text-slate-600">{{ step.description }}</p>
        </BaseCard>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p class="text-sm uppercase tracking-wide text-primary-600 font-semibold mb-2">
            {{ t('landing.featuresTitle') }}
          </p>
          <h2 class="text-3xl font-bold">{{ t('landing.featuresTitle') }}</h2>
        </div>
        <BaseButton variant="secondary" icon="arrow-right" @click="router.push({ name: 'demo' })">
          {{ t('common.requestDemo') }}
        </BaseButton>
      </div>
      <div class="grid md:grid-cols-2 gap-4">
        <BaseCard v-for="feature in features" :key="feature.title" class="hover:-translate-y-1 transition">
          <h3 class="font-semibold text-lg mb-2">{{ feature.title }}</h3>
          <p class="text-slate-600 text-sm">{{ feature.description }}</p>
        </BaseCard>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="grid lg:grid-cols-2 gap-10 items-center">
      <div class="space-y-4">
        <p class="text-sm uppercase tracking-wide text-primary-600 font-semibold mb-2">
          {{ t('landing.merchantsTitle') }}
        </p>
        <h2 class="text-3xl font-bold">{{ t('landing.merchantsTitle') }}</h2>
        <ul class="space-y-3 text-slate-700">
          <li v-for="item in merchantBullets" :key="item" class="flex items-start gap-3">
            <FaIcon icon="check" class="text-green-500 mt-1" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
      <div class="card p-6">
        <h3 class="text-xl font-semibold mb-3">{{ t('whatsapp.embeddedTitle') }}</h3>
        <p class="text-slate-600 text-sm mb-4">{{ t('whatsapp.embeddedSubtitle') }}</p>
        <div class="flex items-center gap-3">
          <FaIcon icon="phone" class="text-primary-600" />
          <span class="font-medium">Meta Embedded Signup</span>
        </div>
        <div class="mt-4">
          <BaseButton icon="arrow-right" @click="router.push({ name: 'demo' })">
            {{ t('common.requestDemo') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="text-center mb-8">
      <p class="text-sm uppercase tracking-wide text-primary-600 font-semibold mb-2">
        {{ t('landing.pricingTitle') }}
      </p>
      <h2 class="text-3xl font-bold mb-2">{{ t('landing.pricingSubtitle') }}</h2>
      <p class="text-slate-600">{{ t('landing.heroSubtitle') }}</p>
    </div>
    <div class="grid md:grid-cols-3 gap-4">
      <BaseCard
        v-for="plan in plans"
        :key="plan.name"
        class="h-full flex flex-col hover:-translate-y-1 transition"
      >
        <h3 class="text-xl font-semibold mb-1">{{ plan.name }}</h3>
        <p class="text-3xl font-bold mb-2">{{ plan.price }}</p>
        <p class="text-sm text-slate-600 mb-4">{{ plan.description }}</p>
        <BaseButton class="mt-auto" variant="secondary">{{ t('common.requestDemo') }}</BaseButton>
      </BaseCard>
    </div>
  </section>

  <section class="section">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-6">
        <p class="text-sm uppercase tracking-wide text-primary-600 font-semibold mb-2">
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
          <p class="mt-2 text-slate-600">{{ faq.a }}</p>
        </details>
      </div>
    </div>
  </section>
</template>
