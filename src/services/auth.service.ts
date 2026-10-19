import { api } from './api'
import type { User } from '@/types/auth'

export interface LoginResponse {
  token: string
  user: User
}

export const authService = {
  async login(credentials: { email: string; password?: string }): Promise<LoginResponse> {
    return api.post<LoginResponse>('/auth/login', credentials)
  },

  async getMe(): Promise<{ user: User }> {
    return api.get<{ user: User }>('/auth/me')
  }
}
