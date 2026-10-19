import { api } from './api'
import type { DashboardResponse, DashboardFilters } from '@/types/dashboard'

export const dashboardService = {
  async getDashboard(filters: Partial<DashboardFilters> = {}): Promise<DashboardResponse> {
    const params = new URLSearchParams()
    if (filters.setor) params.append('setor', filters.setor)
    if (filters.turno) params.append('turno', filters.turno)
    if (filters.categoria) params.append('categoria', filters.categoria)
    if (filters.data) params.append('data', filters.data)

    const query = params.toString() ? `?${params.toString()}` : ''
    return api.get<DashboardResponse>(`/dashboard${query}`)
  }
}
