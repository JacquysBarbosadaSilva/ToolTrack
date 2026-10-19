<template>
  <div class="flex flex-col items-center justify-center p-8 text-center min-h-[160px]">
    <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
      <Inbox class="w-6 h-6 stroke-[1.5]" />
    </div>
    <h3 class="text-sm font-semibold text-slate-700">
      {{ title || 'Nenhum registro encontrado' }}
    </h3>
    <p v-if="description" class="text-xs text-slate-500 mt-1 max-w-sm">
      {{ description }}
    </p>
    <div v-if="actionLabel" class="mt-4">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0B4FB3] hover:text-[#083b87] bg-blue-50 hover:bg-blue-100/70 rounded-lg transition-colors cursor-pointer"
        @click="$emit('action')"
      >
        {{ actionLabel }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Inbox } from 'lucide-vue-next'

defineProps<{
  title?: string
  description?: string
  actionLabel?: string
}>()

defineEmits<{
  (e: 'action'): void
}>()
</script>
