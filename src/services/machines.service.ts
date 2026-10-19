import { api } from './api'
import type { Machine, NewMachinePayload } from '@/types/producao'

export const machinesService = {
  async listMachines(params: { search?: string; status?: string } = {}): Promise<Machine[]> {
    const query = new URLSearchParams()
    if (params.search) query.append('search', params.search)
    if (params.status) query.append('status', params.status)

    const qs = query.toString() ? `?${query.toString()}` : ''
    const res = await api.get<{ machines: Machine[]; items: Machine[] }>(`/machines${qs}`)
    return res.machines || res.items || []
  },

  async createMachine(payload: NewMachinePayload): Promise<Machine> {
    const res = await api.post<{ machine: Machine }>('/machines', payload)
    return res.machine || (res as unknown as Machine)
  },

  async updateMachine(id: string, payload: Partial<NewMachinePayload>): Promise<Machine> {
    const res = await api.put<{ machine: Machine }>(`/machines/${id}`, payload)
    return res.machine || (res as unknown as Machine)
  },

  async deleteMachine(id: string): Promise<{ ok: boolean; message: string }> {
    return api.delete<{ ok: boolean; message: string }>(`/machines/${id}`)
  }
}
