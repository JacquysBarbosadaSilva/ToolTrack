<template>
  <span
    class="inline-flex items-center justify-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border select-none transition-colors min-w-[70px]"
    :class="statusClasses"
  >
    <span v-if="showDot" class="w-1.5 h-1.5 rounded-full shrink-0" :class="dotClasses" />
    <span>{{ displayLabel }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    status: string
    label?: string
    showDot?: boolean
  }>(),
  {
    label: '',
    showDot: false
  }
)

const displayLabel = computed(() => props.label || props.status)

const normalizedStatus = computed(() => {
  const s = (props.status || '').toLowerCase().trim()
  if (s.includes('norm') || s.includes('ativ') || s.includes('ok')) return 'normal'
  if (s.includes('baix') || s.includes('low') || s.includes('alert') || s.includes('aten')) return 'baixo'
  if (s.includes('crít') || s.includes('crit') || s.includes('urg') || s.includes('danger')) return 'critico'
  return 'default'
})

const statusClasses = computed(() => {
  switch (normalizedStatus.value) {
    case 'normal':
      return 'bg-[#F0FDF4] border-[#86EFAC] text-[#15803D]'
    case 'baixo':
      return 'bg-[#FEFCE8] border-[#FDE047] text-[#A16207]'
    case 'critico':
      return 'bg-[#FEF2F2] border-[#FCA5A5] text-[#B91C1C]'
    default:
      return 'bg-slate-50 border-slate-200 text-slate-700'
  }
})

const dotClasses = computed(() => {
  switch (normalizedStatus.value) {
    case 'normal':
      return 'bg-[#16A34A]'
    case 'baixo':
      return 'bg-[#CA8A04]'
    case 'critico':
      return 'bg-[#DC2626]'
    default:
      return 'bg-slate-400'
  }
})
</script>
