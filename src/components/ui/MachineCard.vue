<template>
  <div
    class="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between transition-all hover:shadow-md"
    :class="[topBorderClass]"
  >
    <div>
      <!-- Topo: ID à esquerda e Badge de Status à direita -->
      <div class="flex items-center justify-between gap-2">
        <span class="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wide">
          ID: {{ machine.id }}
        </span>

        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border select-none"
          :class="statusBadgeClass"
        >
          {{ machine.status }}
        </span>
      </div>

      <!-- Nome da Máquina / Esteira -->
      <h3 class="text-xl font-bold text-slate-900 mt-2 tracking-tight min-h-[3rem] flex items-center">
        {{ machine.name }}
      </h3>

      <!-- Métricas: Produção (Hora) e Eficiência (OEE) -->
      <div class="grid grid-cols-2 gap-4 mt-3">
        <div>
          <p class="text-xs text-slate-500">
            Produção (Hora)
          </p>
          <p class="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
            {{ machine.producaoHora || '--' }}
          </p>
        </div>

        <div>
          <p class="text-xs text-slate-500">
            Eficiência (OEE)
          </p>
          <p class="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
            {{ machine.eficienciaOEE || '--' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Rodapé: Ícone + Info Extra à esquerda, 3 pontos à direita -->
    <div class="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between text-xs text-slate-500">
      <div class="flex items-center gap-1.5 min-w-0 pr-2">
        <component
          :is="footerIcon"
          class="w-3.5 h-3.5 shrink-0"
          :class="footerIconColor"
        />
        <span class="truncate">{{ machine.extraInfo }}</span>
      </div>

      <!-- Ações (Editar e Excluir) -->
      <div class="flex items-center gap-1 shrink-0">
        <button
          type="button"
          @click="$emit('edit', machine)"
          class="p-1 rounded text-slate-400 hover:text-[#0B4FB3] hover:bg-slate-100 transition-colors cursor-pointer"
          title="Editar esteira/máquina"
        >
          <Pencil class="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          @click="$emit('delete', machine)"
          class="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          title="Excluir esteira/máquina"
        >
          <Trash2 class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import {
  Clock,
  AlertTriangle,
  Wrench,
  RefreshCw,
  Pencil,
  Trash2
} from 'lucide-vue-next'
import type { Machine } from '@/types/producao'

const props = defineProps<{
  machine: Machine
}>()

defineEmits<{
  (e: 'action', machine: Machine): void
  (e: 'edit', machine: Machine): void
  (e: 'delete', machine: Machine): void
}>()

// Borda superior colorida (Figma)
const topBorderClass = computed(() => {
  switch (props.machine.status) {
    case 'Operacional':
      return 'border-t-4 border-t-emerald-500'
    case 'Parada':
      return 'border-t-4 border-t-rose-500'
    case 'Manutenção':
      return 'border-t-4 border-t-amber-400'
    case 'Setup':
      return 'border-t-4 border-t-indigo-500'
    default:
      return 'border-t-4 border-t-slate-400'
  }
})

// Badge de status (Figma: pílula com fundo claro e texto colorido)
const statusBadgeClass = computed(() => {
  switch (props.machine.status) {
    case 'Operacional':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'Parada':
      return 'bg-rose-50 text-rose-600 border-rose-200'
    case 'Manutenção':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'Setup':
      return 'bg-indigo-50 text-indigo-600 border-indigo-200'
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200'
  }
})

// Ícone do rodapé baseado no status/extraInfo
const footerIcon = computed<Component>(() => {
  switch (props.machine.status) {
    case 'Parada':
      return AlertTriangle
    case 'Manutenção':
      return Wrench
    case 'Setup':
      return RefreshCw
    case 'Operacional':
    default:
      return Clock
  }
})

const footerIconColor = computed(() => {
  switch (props.machine.status) {
    case 'Parada':
      return 'text-slate-400'
    case 'Manutenção':
      return 'text-slate-400'
    case 'Setup':
      return 'text-slate-400'
    case 'Operacional':
    default:
      return 'text-slate-400'
  }
})
</script>
