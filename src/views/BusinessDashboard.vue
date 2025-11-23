<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Business Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-xl font-semibold mb-4">WhatsApp Connection</h2>
        <p class="mb-4 text-gray-600">Connect your WhatsApp Business account to start taking orders.</p>
        <button class="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
          Connect WhatsApp
        </button>
      </div>

      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-xl font-semibold mb-4">Recent Orders</h2>
        <div class="border rounded p-4 text-center text-gray-500">
          No orders yet
        </div>
      </div>
    </div>
  </div>
</template>
