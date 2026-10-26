import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import type {
  MetricCard,
  RecentAccessedItem,
  CategoryChartSlice,
  ShiftChartItem,
  InventoryItem,
  DashboardFilters
} from '@/types/dashboard'
import { dashboardService } from '@/services/dashboard.service'
import { productsService } from '@/services/products.service'
import { lookupsService } from '@/services/lookups.service'

export const useDashboardStore = defineStore('dashboard', () => {

  const isLoading = ref<boolean>(false)
  const isTableLoading = ref<boolean>(false)
  const isFiltering = ref<boolean>(false)
  const error = ref<string | null>(null)
  const tableError = ref<string | null>(null)

  const metrics = ref<MetricCard[]>([])

  const recentAccessed = ref<RecentAccessedItem[]>([])

  const filters = reactive<DashboardFilters>({
    search: '',
    setor: '',
    turno: '',
    categoria: '',
    data: ''
  })

  const categoryChartData = ref<CategoryChartSlice[]>([])
  const shiftChartData = ref<ShiftChartItem[]>([])

  const inventoryList = ref<InventoryItem[]>([])

  const availableSectors = ref<string[]>([])
  const availableCategories = ref<string[]>([])
  const availableTurnos = ref<string[]>([])

  let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null

  function formatToIsoDate(brDate?: string): string | undefined {
    if (!brDate) return undefined
    if (/^\d{4}-\d{2}-\d{2}$/.test(brDate)) return brDate
    const match = brDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (match) {
      return `${match[3]}-${match[2]}-${match[1]}`
    }
    return brDate
  }

  function formatToBrDate(isoDate?: string): string {
    if (!isoDate) return '-'
    const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (match) {
      return `${match[3]}/${match[2]}/${match[1]}`
    }
    return isoDate
  }

  const filteredInventory = computed<InventoryItem[]>(() => {
    return inventoryList.value
  })

  async function fetchLookups(): Promise<void> {
    try {
      const data = await lookupsService.getLookups()
      availableSectors.value = data.setores || []
      availableCategories.value = data.categorias || []
      availableTurnos.value = data.turnos || []
    } catch (err: any) {
      console.error('Falha ao carregar lookups:', err)
    }
  }

  function handleSearchInput(searchTerm: string): void {
    filters.search = searchTerm
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer)
    }
    searchDebounceTimer = setTimeout(() => {
      searchProducts(searchTerm)
    }, 300)
  }

  async function searchProducts(searchTerm: string): Promise<void> {
    isTableLoading.value = true
    tableError.value = null

    try {
      const prodRes = await productsService.listProducts({
        setor: filters.setor || undefined,
        turno: filters.turno || undefined,
        categoria: filters.categoria || undefined,
        search: searchTerm ? searchTerm.trim() : undefined,
        limit: 50
      })

      if (prodRes?.items) {
        inventoryList.value = prodRes.items.map((p) => ({
          id: `ITEM#${p.sku}`,
          sku: p.sku,
          nome: p.nome,
          categoria: p.categoria,
          setor: p.setor,
          turno: p.turno as any,
          quantidade: p.quantidade,
          unidade: p.unidade || 'un',
          status: p.status as any,
          dataCadastro: formatToBrDate(p.dataCadastro)
        }))
      }
    } catch (err: any) {
      tableError.value = err?.message || 'Falha ao buscar produtos na API'
    } finally {
      isTableLoading.value = false
    }
  }

  async function fetchDashboardData(silent: boolean = false): Promise<void> {
    if (!silent) {
      isLoading.value = true
      error.value = null
      tableError.value = null
    }

    const isoDate = formatToIsoDate(filters.data)

    try {
      const [dashRes, prodRes] = await Promise.all([
        dashboardService.getDashboard({
          setor: filters.setor || undefined,
          turno: filters.turno || undefined,
          categoria: filters.categoria || undefined,
          data: isoDate
        }),
        productsService.listProducts({
          setor: filters.setor || undefined,
          turno: filters.turno || undefined,
          categoria: filters.categoria || undefined,
          search: filters.search ? filters.search.trim() : undefined,
          limit: 50
        }),
        fetchLookups()
      ])

      if (dashRes.kpis?.cards) {
        metrics.value = dashRes.kpis.cards
      }

      categoryChartData.value = dashRes.categoria || []
      shiftChartData.value = dashRes.turno || []
      recentAccessed.value = dashRes.recentes || []

      if (prodRes?.items) {
        inventoryList.value = prodRes.items.map((p) => ({
          id: `ITEM#${p.sku}`,
          sku: p.sku,
          nome: p.nome,
          categoria: p.categoria,
          setor: p.setor,
          turno: p.turno as any,
          quantidade: p.quantidade,
          unidade: p.unidade || 'un',
          status: p.status as any,
          dataCadastro: formatToBrDate(p.dataCadastro)
        }))
      }
    } catch (err: any) {
      if (!silent) {
        error.value = err?.message || 'Falha ao buscar dados do Dashboard'
      } else {
        console.warn('Erro ao atualizar dados em background:', err?.message || err)
      }
    } finally {
      if (!silent) {
        isLoading.value = false
      }
    }
  }

  async function applyFilters(): Promise<void> {
    isFiltering.value = true
    try {
      await fetchDashboardData()
    } finally {
      isFiltering.value = false
    }
  }

  async function resetFilters(): Promise<void> {
    filters.search = ''
    filters.setor = ''
    filters.turno = ''
    filters.categoria = ''
    filters.data = ''
    await fetchDashboardData()
  }

  return {

    isLoading,
    isTableLoading,
    isFiltering,
    error,
    tableError,
    metrics,
    recentAccessed,
    filters,
    categoryChartData,
    shiftChartData,
    inventoryList,
    availableSectors,
    availableCategories,
    availableTurnos,

    filteredInventory,

    fetchLookups,
    fetchDashboardData,
    handleSearchInput,
    searchProducts,
    applyFilters,
    resetFilters
  }
})
