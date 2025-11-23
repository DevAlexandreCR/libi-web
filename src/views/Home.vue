<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4 text-primary">{{ $t('home.title') }}</h1>
      <p class="mb-8">{{ $t('home.subtitle') }}</p>
      <router-link to="/login" class="bg-primary text-white px-6 py-2 rounded">{{ $t('home.cta') }}</router-link>
    </div>
  </div>
</template>
