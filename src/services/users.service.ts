import { api } from './api'
import type { UserAccount, NewUserPayload, UpdateUserPayload } from '@/types/usuarios'

export const usersService = {
  async listUsers(): Promise<UserAccount[]> {
    const res = await api.get<{ users: UserAccount[]; items: UserAccount[] }>('/users')
    return res.users || res.items || []
  },

  async createUser(payload: NewUserPayload): Promise<UserAccount> {
    const res = await api.post<{ user: UserAccount }>('/users', payload)
    return res.user || (res as unknown as UserAccount)
  },

  async updateUser(id: string, payload: UpdateUserPayload): Promise<UserAccount> {
    const res = await api.put<{ user: UserAccount }>(`/users/${id}`, payload)
    return res.user || (res as unknown as UserAccount)
  },

  async deleteUser(id: string): Promise<{ ok: boolean; message: string }> {
    return api.delete<{ ok: boolean; message: string }>(`/users/${id}`)
  }
}
