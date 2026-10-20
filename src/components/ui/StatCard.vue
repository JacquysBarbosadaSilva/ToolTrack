<template>
  <div
    class="bg-white rounded-lg p-5 shadow-xs flex flex-col justify-between transition-all"
    :class="[accentBorderClass]"
  >

    <div class="flex items-start justify-between gap-2">
      <span class="text-[10px] font-mono font-medium uppercase tracking-wider text-slate-600">
        {{ label }}
      </span>

      <div v-if="icon" class="shrink-0">
        <component :is="icon" class="w-4 h-4" :class="accentIconClass" />
      </div>
    </div>

    <div v-if="loading" class="mt-4 flex items-baseline gap-2">
      <SkeletonBlock class="h-8 w-24 rounded" />
      <SkeletonBlock class="h-4 w-12 rounded" />
    </div>

    <div v-else-if="error" class="mt-4 flex items-center justify-between gap-2">
      <span class="text-xs text-red-500 font-medium">Erro ao carregar</span>
      <button
        type="button"
        @click="$emit('retry')"
        class="text-xs text-[#0B4FB3] font-medium hover:underline cursor-pointer"
      >
        Tentar novamente
      </button>
    </div>

    <div v-else class="mt-4 flex items-baseline gap-2 flex-wrap">
      <span class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
        {{ value }}
      </span>

      <span
        v-if="delta"
        class="text-xs font-semibold select-none"
        :class="accentDeltaClass"
      >
        {{ delta }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import SkeletonBlock from './SkeletonBlock.vue'

export type AccentType = 'blue' | 'red' | 'green' | 'dark'

const props = withDefaults(
  defineProps<{
    label: string
    value: string | number
    delta?: string
    icon?: Component
    accent?: AccentType
    loading?: boolean
    error?: string | null
  }>(),
  {
    delta: '',
    accent: 'blue',
    loading: false,
    error: null
  }
)

defineEmits<{
  (e: 'retry'): void
}>()

const accentBorderClass = computed(() => {
  switch (props.accent) {
    case 'red':
      return 'border border-red-500'
    case 'green':
      return 'border border-emerald-500'
    case 'dark':
      return 'border border-slate-700'
    case 'blue':
    default:
      return 'border border-blue-400'
  }
})

const accentIconClass = computed(() => {
  switch (props.accent) {
    case 'red':
      return 'text-red-500'
    case 'green':
      return 'text-emerald-500'
    case 'dark':
      return 'text-slate-700'
    case 'blue':
    default:
      return 'text-blue-500'
  }
})

const accentDeltaClass = computed(() => {
  switch (props.accent) {
    case 'red':
      return 'text-red-500'
    case 'green':
      return 'text-slate-600 text-[10px] leading-tight font-medium'
    case 'dark':
      return 'text-slate-500 font-normal'
    case 'blue':
    default:
      return 'text-slate-800'
  }
})
</script>
