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
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="flex items-center gap-8 w-full max-w-sm justify-center">
        <SkeletonBlock class="w-40 h-40 rounded-full" />
        <div class="space-y-3 flex-1">
          <SkeletonBlock class="h-4 w-28 rounded" />
          <SkeletonBlock class="h-4 w-24 rounded" />
          <SkeletonBlock class="h-4 w-20 rounded" />
        </div>
      </div>
    </div>

    <!-- Estado Error -->
    <div v-else-if="error" class="py-6">
      <ErrorState :message="error" @retry="$emit('retry')" />
    </div>

    <!-- Estado Empty -->
    <div v-else-if="!computedSlices || computedSlices.length === 0" class="py-6">
      <EmptyState title="Nenhum registro encontrado" />
    </div>

    <!-- Gráfico SVG de Pizza (Setores Cheios, sem furo) + Legenda à direita como no Figma -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 items-center gap-6 py-2">
      <!-- SVG Pizza Nativo -->
      <div class="flex items-center justify-center">
        <svg viewBox="0 0 200 200" class="w-48 h-48 select-none">
          <!-- Fallback quando sem dados -->
          <circle
            v-if="!computedSlices.length"
            cx="100"
            cy="100"
            r="80"
            fill="#E2E8F0"
          />

          <!-- Caso especial: fatia única de 100% -->
          <circle
            v-else-if="computedSlices.length === 1"
            cx="100"
            cy="100"
            r="80"
            :fill="computedSlices[0].color"
            class="transition-opacity hover:opacity-90"
          />

          <!-- Fatias calculadas em SVG Path (setores cheios sem furo central) -->
          <g v-else>
            <path
              v-for="slice in computedSlices"
              :key="slice.label"
              :d="slice.path"
              :fill="slice.color"
              class="transition-all duration-200 hover:opacity-90 cursor-pointer"
            >
              <title>{{ slice.label }}: {{ slice.percentage }}% ({{ slice.value }})</title>
            </path>
          </g>
        </svg>
      </div>

      <!-- Legenda à direita: Ponto de cor + Nome e Percentual juntos na linha (Figma) -->
      <div class="space-y-3">
        <div
          v-for="item in computedSlices"
          :key="item.label"
          class="flex items-center gap-2.5 text-xs text-slate-600"
        >
          <span
            class="w-2.5 h-2.5 rounded-full shrink-0"
            :style="{ backgroundColor: item.color }"
          />
          <span class="font-normal text-[11px] text-slate-600">
            {{ item.label }} <span class="text-slate-500">{{ item.percentage }}%</span>
          </span>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppCard from './AppCard.vue'
import SkeletonBlock from './SkeletonBlock.vue'
import EmptyState from './EmptyState.vue'
import ErrorState from './ErrorState.vue'

export interface PieChartItem {
  label: string
  value: number
  color?: string
}

const DEFAULT_CHART_COLORS = [
  '#1E2A4A',
  '#2F4A85',
  '#4A6DB5',
  '#8A9BCB',
  '#B8C4E3'
]

const props = withDefaults(
  defineProps<{
    data: PieChartItem[]
    title?: string
    subtitle?: string
    loading?: boolean
    error?: string | null
  }>(),
  {
    title: 'Categoria',
    subtitle: '',
    loading: false,
    error: null
  }
)

defineEmits<{
  (e: 'retry'): void
}>()

interface ComputedSlice {
  label: string
  value: number
  color: string
  percentage: string
  path: string
}

const computedSlices = computed<ComputedSlice[]>(() => {
  const total = props.data.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0)
  if (total <= 0) return []

  const cx = 100
  const cy = 100
  const r = 80
  let currentAngle = -Math.PI / 2 // Começa no topo (-90 graus)

  return props.data.map((item, index) => {
    const val = Number(item.value) || 0
    const sliceAngle = (val / total) * (2 * Math.PI)
    const endAngle = currentAngle + sliceAngle

    const x1 = cx + r * Math.cos(currentAngle)
    const y1 = cy + r * Math.sin(currentAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)

    const largeArcFlag = sliceAngle > Math.PI ? 1 : 0

    // Setor cheio terminando no centro (cx, cy) sem furo
    const path = `M ${cx} ${cy} L ${x1.toFixed(3)} ${y1.toFixed(3)} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2.toFixed(3)} ${y2.toFixed(3)} Z`

    currentAngle = endAngle

    const color = item.color || DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length]
    const percentage = ((val / total) * 100).toFixed(1)

    return {
      label: item.label,
      value: val,
      color,
      percentage,
      path
    }
  })
})
</script>
