import { api } from './api'
import type { UserProfile, UpdateProfilePayload } from '@/types/perfil'

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    return api.get<UserProfile>('/profile')
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    return api.put<UserProfile>('/profile', payload)
  }
}
