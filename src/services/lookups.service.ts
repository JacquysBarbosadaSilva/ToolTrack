import { api } from './api'
import type { LookupsData } from '@/types/lookups'

export const lookupsService = {
  async getLookups(): Promise<LookupsData> {
    return api.get<LookupsData>('/lookups')
  }
}
