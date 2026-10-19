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
  // --- Estados de Carregamento & Erro ---
  const isLoading = ref<boolean>(false)
  const isTableLoading = ref<boolean>(false)
  const isFiltering = ref<boolean>(false)
  const error = ref<string | null>(null)
  const tableError = ref<string | null>(null)

  // --- Cards de Métricas Principais (vindos da API DynamoDB) ---
  const metrics = ref<MetricCard[]>([])

  // --- Card Acessados Recentemente ---
  const recentAccessed = ref<RecentAccessedItem[]>([])

  // --- Filtros do Relatório ---
  const filters = reactive<DashboardFilters>({
    search: '',
    setor: '',
    turno: '',
    categoria: '',
    data: ''
  })

  // --- Dados dos Gráficos ---
  const categoryChartData = ref<CategoryChartSlice[]>([])
  const shiftChartData = ref<ShiftChartItem[]>([])

  // --- Lista do Estoque ---
  const inventoryList = ref<InventoryItem[]>([])

  // Listas para preenchimento dos selects (vindas de /lookups)
  const availableSectors = ref<string[]>([])
  const availableCategories = ref<string[]>([])
  const availableTurnos = ref<string[]>([])

  // Timer de debounce da busca
  let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null

  // --- Helper para converter dd/mm/aaaa em YYYY-MM-DD para a API ---
  function formatToIsoDate(brDate?: string): string | undefined {
    if (!brDate) return undefined
    if (/^\d{4}-\d{2}-\d{2}$/.test(brDate)) return brDate
    const match = brDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (match) {
      return `${match[3]}-${match[2]}-${match[1]}`
    }
    return brDate
  }

  // --- Helper para converter YYYY-MM-DD em dd/mm/aaaa para a UI ---
  function formatToBrDate(isoDate?: string): string {
    if (!isoDate) return '-'
    const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (match) {
      return `${match[3]}/${match[2]}/${match[1]}`
    }
    return isoDate
  }

  // --- Getters Reativos ---
  const filteredInventory = computed<InventoryItem[]>(() => {
    return inventoryList.value
  })

  // --- Ações Assíncronas ---
  /**
   * Busca as opções de filtros na tabela lookups do DynamoDB
   */
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

  /**
   * Dispara busca de produtos com debounce de 300ms a partir do campo de busca do topo
   */
  function handleSearchInput(searchTerm: string): void {
    filters.search = searchTerm
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer)
    }
    searchDebounceTimer = setTimeout(() => {
      searchProducts(searchTerm)
    }, 300)
  }

  /**
   * Chama /products?search= e atualiza a tabela de Estoque
   */
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

  /**
   * Carrega os dados reais do Dashboard chamando os endpoints da API
   */
  async function fetchDashboardData(): Promise<void> {
    isLoading.value = true
    error.value = null
    tableError.value = null

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

      // Popula métricas
      if (dashRes.kpis?.cards) {
        metrics.value = dashRes.kpis.cards
      }

      // Popula gráficos
      categoryChartData.value = dashRes.categoria || []
      shiftChartData.value = dashRes.turno || []
      recentAccessed.value = dashRes.recentes || []

      // Popula inventário
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
      error.value = err?.message || 'Falha ao buscar dados do Dashboard'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Aplica filtros disparando busca na API
   */
  async function applyFilters(): Promise<void> {
    isFiltering.value = true
    try {
      await fetchDashboardData()
    } finally {
      isFiltering.value = false
    }
  }

  /**
   * Reseta filtros para os padrões e recarrega os dados
   */
  async function resetFilters(): Promise<void> {
    filters.search = ''
    filters.setor = ''
    filters.turno = ''
    filters.categoria = ''
    filters.data = ''
    await fetchDashboardData()
  }

  return {
    // Estados
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
    // Getters
    filteredInventory,
    // Ações
    fetchLookups,
    fetchDashboardData,
    handleSearchInput,
    searchProducts,
    applyFilters,
    resetFilters
  }
})
