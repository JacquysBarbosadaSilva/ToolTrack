<template>
  <div class="min-h-screen w-full font-sans antialiased bg-slate-50 text-slate-900">
    <RouterView />

    <!-- Notificações Toast Globais (incluindo AWS_CREDENTIALS_EXPIRED) -->
    <div
      v-if="activeToasts.length"
      class="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"
    >
      <TransitionGroup name="toast">
        <div
          v-for="toast in activeToasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-lg border text-xs leading-relaxed transition-all"
          :class="getToastClasses(toast.type)"
        >
          <span class="flex-1 font-medium">{{ toast.message }}</span>
          <button
            type="button"
            class="text-current opacity-70 hover:opacity-100 font-bold ml-1 cursor-pointer"
            @click="removeToast(toast.id)"
          >
            ✕
          </button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { activeToasts, removeToast, type ToastItem } from '@/services/toast'

function getToastClasses(type: ToastItem['type']) {
  switch (type) {
    case 'error':
      return 'bg-red-50 border-red-200 text-red-800'
    case 'success':
      return 'bg-emerald-50 border-emerald-200 text-emerald-800'
    case 'warning':
      return 'bg-amber-50 border-amber-200 text-amber-800'
    default:
      return 'bg-slate-900 border-slate-800 text-white'
  }
}
</script>
