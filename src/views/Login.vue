<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-96">
      <h2 class="text-2xl font-bold mb-4">{{ $t('common.login') }}</h2>
      <input type="email" :placeholder="$t('common.email')" class="w-full border p-2 mb-4 rounded" />
      <input type="password" :placeholder="$t('common.password')" class="w-full border p-2 mb-4 rounded" />
      <button class="w-full bg-primary text-white p-2 rounded">{{ $t('common.signIn') }}</button>
    </div>
  </div>
</template>
