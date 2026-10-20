
export type InventoryStatus = 'Normal' | 'Baixo' | 'Crítico'
export type ShiftType = 'Manhã' | 'Tarde' | 'Noite'

export interface MetricCard {
  id: string
  title: string
  value: string
  change: string
  isPositive?: boolean
  variant: 'blue' | 'red' | 'green' | 'dark'
  description?: string
}

export interface RecentAccessedItem {
  id: string
  title: string
  description: string
  route: string
  badge?: string
}

export interface CategoryChartSlice {
  name: string
  percentage: number
  color: string
  count?: number
}

export interface ShiftChartItem {
  shift: ShiftType
  count: number
  color: string
  percentage?: number
}

export interface InventoryItem {
  id: string
  sku: string
  nome: string
  categoria: string
  setor: string
  turno: ShiftType
  quantidade: number
  unidade: string
  status: InventoryStatus
  dataCadastro: string
}

export interface DashboardFilters {
  search: string
  setor: string
  turno: string
  categoria: string
  data: string
}

export interface DashboardChartsData {
  categoryDistribution: CategoryChartSlice[]
  shiftDistribution: ShiftChartItem[]
}

export interface DashboardKPIs {
  totalItems: {
    value: number
    formatted: string
    change: string
    isPositive: boolean
  }
  lowStock: {
    value: number
    formatted: string
    change: string
    isPositive: boolean
  }
  activeMachines: {
    active: number
    total: number
    formatted: string
    change: string
    isPositive: boolean
  }
  maintenanceTasks: {
    value: number
    formatted: string
    change: string
    isPositive: boolean
  }
  cards: MetricCard[]
}

export interface DashboardResponse {
  kpis: DashboardKPIs
  categoria: CategoryChartSlice[]
  turno: ShiftChartItem[]
  recentes?: RecentAccessedItem[]
}
