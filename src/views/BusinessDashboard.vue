<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">{{ $t('business.title') }}</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-xl font-semibold mb-4">{{ $t('business.whatsappConnection') }}</h2>
        <p class="mb-4 text-gray-600">{{ $t('business.connectDescription') }}</p>
        <button class="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
          {{ $t('business.connectButton') }}
        </button>
      </div>

      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-xl font-semibold mb-4">{{ $t('business.recentOrders') }}</h2>
        <div class="border rounded p-4 text-center text-gray-500">
          {{ $t('business.noOrders') }}
        </div>
      </div>
    </div>
  </div>
</template>
