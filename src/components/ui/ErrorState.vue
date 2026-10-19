<template>
  <div class="flex flex-col items-center justify-center p-6 text-center border border-red-200/70 bg-red-50/50 rounded-xl min-h-[140px]">
    <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2.5">
      <AlertCircle class="w-5 h-5 stroke-[2]" />
    </div>
    <h3 class="text-sm font-semibold text-red-900">
      {{ title || 'Ocorreu um erro ao carregar os dados' }}
    </h3>
    <p v-if="message" class="text-xs text-red-600 mt-1 max-w-sm">
      {{ message }}
    </p>
    <div v-if="retryable !== false" class="mt-3.5">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors cursor-pointer"
        @click="$emit('retry')"
      >
        <RotateCcw class="w-3.5 h-3.5" />
        <span>{{ retryLabel || 'Tentar novamente' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, RotateCcw } from 'lucide-vue-next'

defineProps<{
  title?: string
  message?: string
  retryable?: boolean
  retryLabel?: string
}>()

defineEmits<{
  (e: 'retry'): void
}>()
</script>
