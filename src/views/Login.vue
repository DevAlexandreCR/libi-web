<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  const success = await authStore.login(email.value, password.value, 'business');
  
  if (success) {
    if (authStore.user?.type === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-96">
      <h2 class="text-2xl font-bold mb-4">{{ $t('common.login') }}</h2>
      
      <div v-if="authStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ authStore.error }}
      </div>

      <form @submit.prevent="handleLogin">
        <input 
          v-model="email"
          type="email" 
          :placeholder="$t('common.email')" 
          class="w-full border p-2 mb-4 rounded" 
          required
        />
        <input 
          v-model="password"
          type="password" 
          :placeholder="$t('common.password')" 
          class="w-full border p-2 mb-4 rounded" 
          required
        />
        <button 
          type="submit"
          class="w-full bg-primary text-white p-2 rounded hover:bg-opacity-90 disabled:opacity-50"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? $t('common.loading') : $t('common.signIn') }}
        </button>
      </form>
    </div>
  </div>
</template>
