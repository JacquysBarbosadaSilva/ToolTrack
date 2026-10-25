<template>
  <div class="space-y-6 pb-12 anim-fade-up">

    <div>
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
        Dashboard Overview
      </h1>
      <p class="text-sm text-slate-500 mt-1">
        Métricas em tempo real para as unidades produtivas da ToolTrack.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Armazenamento Total"
        :value="kpiItems.totalInventory.value"
        :delta="kpiItems.totalInventory.delta"
        accent="blue"
        :icon="Package"
        :loading="isLoading"
        :error="error"
        @retry="fetchDashboardData"
      />

      <StatCard
        label="Alerta de baixo estoque"
        :value="kpiItems.lowStock.value"
        :delta="kpiItems.lowStock.delta"
        accent="red"
        :icon="AlertTriangle"
        :loading="isLoading"
        :error="error"
        @retry="fetchDashboardData"
      />

      <StatCard
        label="Maquinas ativas"
        :value="kpiItems.activeMachines.value"
        :delta="kpiItems.activeMachines.delta"
        accent="green"
        :icon="Cpu"
        :loading="isLoading"
        :error="error"
        @retry="fetchDashboardData"
      />

      <StatCard
        label="Tarefas de manutenção"
        :value="kpiItems.maintenanceTasks.value"
        :delta="kpiItems.maintenanceTasks.delta"
        accent="dark"
        :icon="Wrench"
        :loading="isLoading"
        :error="error"
        @retry="fetchDashboardData"
      />
    </div>

    <div class="space-y-3">
      <h2 class="text-xl font-bold text-slate-900 tracking-tight">
        Acessados recentemente
      </h2>

      <router-link
        to="/producao"
        class="w-64 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col items-center justify-center text-center hover:border-blue-400 hover:shadow-sm transition-all group cursor-pointer"
      >
        <div class="text-[#0B4FB3]">
          <Boxes class="w-7 h-7" />
        </div>
        <span class="font-bold text-sm text-slate-900 mt-2">
          Produtos
        </span>
        <span class="text-[10px] text-slate-500 mt-1 leading-normal">
          Cadastre e gerencie seus produtos
        </span>
      </router-link>
    </div>

    <FilterBar
      title="Filtros do Relatório"
      :loading="isFiltering"
      @filter="handleFilter"
    >

      <BaseSelect
        label="Setor"
        v-model="filters.setor"
        placeholder="Todos"
        :options="availableSectors"
      />

      <BaseSelect
        label="Turno"
        v-model="filters.turno"
        placeholder="Todos"
        :options="availableTurnos"
      />

      <BaseSelect
        label="Categoria"
        v-model="filters.categoria"
        placeholder="Todas"
        :options="availableCategories"
      />

      <div>
        <label class="block text-xs font-medium text-slate-700 mb-1.5">
          Data
        </label>
        <div class="relative">
          <input
            v-model="filters.data"
            type="text"
            placeholder="dd/mm/aaaa"
            class="w-full px-4 py-2 pr-9 text-xs font-normal text-slate-800 bg-white border border-slate-300 rounded-full focus:bg-white focus:border-[#0B4FB3] focus:ring-2 focus:ring-[#0B4FB3]/20 outline-none transition-all placeholder:text-slate-400 shadow-xs"
          />
          <div class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </FilterBar>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <PieChart
        title="Categoria"
        :data="pieData"
        :loading="isLoading"
        :error="error"
        @retry="fetchDashboardData"
      />

      <BarChart
        title="Turno"
        :data="barData"
        :loading="isLoading"
        :error="error"
        @retry="fetchDashboardData"
      />
    </div>

    <ExportBar
      title="Exportar Relatório"
      class="no-print"
      :loading-pdf="exportingPdf"
      :loading-excel="exportingExcel"
      :loading-print="printing"
      @export-pdf="handleExportPdf"
      @export-excel="handleExportExcel"
      @print="handlePrint"
    />

    <DataTable
      title="Estoque"
      :columns="tableColumns"
      :items="filteredInventory"
      :loading="isLoading || isTableLoading"
      :error="tableError || error"
      @retry="fetchDashboardData"
    >

      <template #cell-turno="{ value }">
        <ShiftBadge :shift="value" />
      </template>

      <template #cell-status="{ value }">
        <StatusBadge :status="value" />
      </template>

      <template #cell-quantidade="{ value }">
        <span>{{ Number(value || 0).toLocaleString('pt-BR') }}</span>
      </template>

      <template #cell-dataCadastro="{ value }">
        <span>{{ value || '-' }}</span>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import {
  Package,
  AlertTriangle,
  Cpu,
  Wrench,
  Boxes
} from 'lucide-vue-next'
import { useDashboardStore } from '@/stores/dashboardStore'
import { useAuthStore } from '@/stores/authStore'
import {
  StatCard,
  FilterBar,
  BaseSelect,
  PieChart,
  BarChart,
  ExportBar,
  DataTable,
  ShiftBadge,
  StatusBadge,
  type ColumnDefinition
} from '@/components/ui'

const authStore = useAuthStore()
const dashboardStore = useDashboardStore()
const {
  isLoading,
  isTableLoading,
  isFiltering,
  error,
  tableError,
  metrics,
  filters,
  categoryChartData,
  shiftChartData,
  filteredInventory,
  availableSectors,
  availableTurnos,
  availableCategories
} = storeToRefs(dashboardStore)

const { fetchDashboardData, applyFilters } = dashboardStore

const exportingPdf = ref<boolean>(false)
const exportingExcel = ref<boolean>(false)
const printing = ref<boolean>(false)

const tableColumns: ColumnDefinition[] = [
  { key: 'sku', label: 'SKU', align: 'center' },
  { key: 'categoria', label: 'Categoria', align: 'center' },
  { key: 'turno', label: 'Turno', align: 'center' },
  { key: 'quantidade', label: 'Quantidade', align: 'center' },
  { key: 'status', label: 'Status', align: 'center' },
  { key: 'dataCadastro', label: 'Data Cadastro', align: 'center' }
]

const kpiItems = computed(() => {
  const findCard = (title: string) => metrics.value.find((m) => m.title === title)
  const total = findCard('TOTAL INVENTORY ITEMS')
  const low = findCard('LOW STOCK ALERTS')
  const machines = findCard('ACTIVE MACHINES')
  const maint = findCard('MAINTENANCE TASKS')

  return {
    totalInventory: {
      value: total?.value ?? '0',
      delta: total?.change ?? ''
    },
    lowStock: {
      value: low?.value ?? '0',
      delta: low?.change ?? ''
    },
    activeMachines: {
      value: machines?.value ?? '0/0',
      delta: machines?.change ?? ''
    },
    maintenanceTasks: {
      value: maint?.value ?? '0',
      delta: maint?.change ?? ''
    }
  }
})

const pieData = computed(() => {
  return categoryChartData.value.map(item => ({
    label: item.name,
    value: item.percentage,
    color: item.color
  }))
})

const barData = computed(() => {
  return shiftChartData.value.map(item => ({
    label: item.shift,
    value: item.count,
    color: item.color
  }))
})

async function handleFilter() {
  await applyFilters()
}

async function handleExportPdf() {
  exportingPdf.value = true
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
  const token = authStore.token || localStorage.getItem('token')
  try {
    const query = new URLSearchParams()
    if (filters.value.setor) query.append('setor', filters.value.setor)
    if (filters.value.turno) query.append('turno', filters.value.turno)
    if (filters.value.categoria) query.append('categoria', filters.value.categoria)
    if (filters.value.search) query.append('search', filters.value.search)

    const res = await fetch(`${apiUrl}/export/products.pdf?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'produtos.pdf'
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Falha ao exportar PDF:', err)
  } finally {
    exportingPdf.value = false
  }
}

async function handleExportExcel() {
  exportingExcel.value = true
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
  const token = authStore.token || localStorage.getItem('token')
  try {
    const query = new URLSearchParams()
    if (filters.value.setor) query.append('setor', filters.value.setor)
    if (filters.value.turno) query.append('turno', filters.value.turno)
    if (filters.value.categoria) query.append('categoria', filters.value.categoria)
    if (filters.value.search) query.append('search', filters.value.search)

    const res = await fetch(`${apiUrl}/export/products.xlsx?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'produtos.xlsx'
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Falha ao exportar Excel:', err)
  } finally {
    exportingExcel.value = false
  }
}

function handlePrint() {
  window.print()
}

onMounted(() => {
  fetchDashboardData()
})
</script>
