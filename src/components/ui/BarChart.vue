<template>
  <AppCard>
    <!-- Título no topo como no Figma -->
    <template #header>
      <div class="w-full">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="text-xs text-slate-500 mt-0.5">
          {{ subtitle }}
        </p>
      </div>
    </template>

    <!-- Estado Loading -->
    <div v-if="loading" class="py-8 flex items-center justify-center">
      <div class="flex items-end justify-center gap-8 w-full max-w-xs h-40">
        <SkeletonBlock class="w-14 h-28 rounded-t" />
        <SkeletonBlock class="w-14 h-36 rounded-t" />
        <SkeletonBlock class="w-14 h-20 rounded-t" />
      </div>
    </div>

    <!-- Estado Error -->
    <div v-else-if="error" class="py-6">
      <ErrorState :message="error" @retry="$emit('retry')" />
    </div>

    <!-- Estado Empty -->
    <div v-else-if="!computedBars || computedBars.length === 0 || computedBars.every(b => b.value === 0)" class="py-6">
      <EmptyState title="Nenhum registro encontrado" />
    </div>

    <!-- Gráfico SVG de Barras Verticais (Figma) -->
    <div v-else class="py-2">
      <svg viewBox="0 0 380 190" class="w-full h-52 select-none">
        <!-- Linhas de Grade de Fundo Sutis -->
        <g stroke="#F1F5F9" stroke-dasharray="3 3" stroke-width="1">
          <line x1="20" y1="30" x2="360" y2="30" />
          <line x1="20" y1="70" x2="360" y2="70" />
          <line x1="20" y1="110" x2="360" y2="110" />
          <line x1="20" y1="150" x2="360" y2="150" stroke="#E2E8F0" stroke-dasharray="0" />
        </g>

        <!-- Barras Verticais do Gráfico -->
        <g v-for="bar in computedBars" :key="bar.label" class="cursor-pointer group">
          <!-- Valor no Topo da Barra (Figma: 12918, 7964, 14124) -->
          <text
            :x="bar.x + bar.width / 2"
            :y="bar.y - 8"
            text-anchor="middle"
            fill="#64748B"
            font-size="10"
            font-weight="500"
            font-family="Inter, sans-serif"
          >
            {{ bar.value }}
          </text>

          <!-- Barra com Cantos Arredondados -->
          <rect
            :x="bar.x"
            :y="bar.y"
            :width="bar.width"
            :height="bar.height"
            rx="4"
            :fill="bar.color"
            class="transition-all duration-300 group-hover:opacity-90"
          >
            <title>{{ bar.label }}: {{ bar.value }}</title>
          </rect>

          <!-- Rótulo do Turno Embaixo da Barra (Manhã, Noite, Tarde) -->
          <text
            :x="bar.x + bar.width / 2"
            y="170"
            text-anchor="middle"
            fill="#64748B"
            font-size="11"
            font-weight="500"
            font-family="Inter, sans-serif"
          >
            {{ bar.label }}
          </text>
        </g>
      </svg>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppCard from './AppCard.vue'
import SkeletonBlock from './SkeletonBlock.vue'
import EmptyState from './EmptyState.vue'
import ErrorState from './ErrorState.vue'

export interface BarChartItem {
  label: string
  value: number
  color?: string
}

const DEFAULT_BAR_COLORS = [
  '#1E2A4A',
  '#4A6DB5',
  '#8A9BCB'
]

const props = withDefaults(
  defineProps<{
    data: BarChartItem[]
    title?: string
    subtitle?: string
    loading?: boolean
    error?: string | null
  }>(),
  {
    title: 'Turno',
    subtitle: '',
    loading: false,
    error: null
  }
)

defineEmits<{
  (e: 'retry'): void
}>()

const maxGridValue = computed(() => {
  const max = Math.max(...props.data.map(d => Number(d.value) || 0), 0)
  return max > 0 ? max * 1.15 : 100
})

interface ComputedBar {
  label: string
  value: number
  color: string
  x: number
  y: number
  width: number
  height: number
}

const computedBars = computed<ComputedBar[]>(() => {
  const count = props.data.length
  if (count === 0) return []

  const availableWidth = 320
  const startX = 30
  const baseY = 150
  const maxH = 110

  const slotWidth = availableWidth / count
  const barWidth = Math.min(56, slotWidth * 0.6)

  return props.data.map((item, index) => {
    const val = Number(item.value) || 0
    const ratio = maxGridValue.value > 0 ? val / maxGridValue.value : 0
    const height = Math.max(4, ratio * maxH)
    const x = startX + index * slotWidth + (slotWidth - barWidth) / 2
    const y = baseY - height

    const color = item.color || DEFAULT_BAR_COLORS[index % DEFAULT_BAR_COLORS.length]

    return {
      label: item.label,
      value: val,
      color,
      x,
      y,
      width: barWidth,
      height
    }
  })
})
</script>
