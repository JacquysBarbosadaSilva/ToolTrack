import { api } from './api'
import type { ProductionRecord, CreateProductionPayload } from '@/types/producao'

export interface ListProductionParams {
  turno?: string
  data?: string
  dataInicio?: string
  dataFim?: string
}

export const productionService = {
  async listProduction(params: ListProductionParams = {}): Promise<{ items: ProductionRecord[]; total: number }> {
    const query = new URLSearchParams()
    if (params.turno) query.append('turno', params.turno)
    if (params.data) query.append('data', params.data)
    if (params.dataInicio) query.append('dataInicio', params.dataInicio)
    if (params.dataFim) query.append('dataFim', params.dataFim)

    const qs = query.toString() ? `?${query.toString()}` : ''
    return api.get<{ items: ProductionRecord[]; total: number }>(`/production${qs}`)
  },

  async createProduction(payload: CreateProductionPayload): Promise<ProductionRecord> {
    const res = await api.post<{ production: ProductionRecord }>('/production', payload)
    return res.production || (res as unknown as ProductionRecord)
  }
}
