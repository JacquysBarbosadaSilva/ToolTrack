import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { UserProfile, UpdateProfilePayload } from '@/types/perfil'
import { profileService } from '@/services/profile.service'
import { useAuthStore } from '@/stores/authStore'

export const usePerfilStore = defineStore('perfil', () => {
  const isLoading = ref<boolean>(false)
  const isSaving = ref<boolean>(false)
  const error = ref<string | null>(null)

  const profile = reactive<UserProfile>({
    PK: '',
    id: '',
    nome: '',
    cargo: '',
    localizacao: '',
    email: '',
    telefone: '',
    departamento: '',
    idFuncionario: '',
    role: '',
    atualizadoEm: ''
  })

  async function fetchProfile(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const data = await profileService.getProfile()
      Object.assign(profile, data)
    } catch (err: any) {
      error.value = err?.message || 'Erro ao carregar dados do perfil'
    } finally {
      isLoading.value = false
    }
  }

  async function updateProfile(payload: UpdateProfilePayload): Promise<void> {
    isSaving.value = true
    error.value = null

    try {
      const updated = await profileService.updateProfile(payload)
      Object.assign(profile, updated)

      const authStore = useAuthStore()
      if (authStore.user) {
        authStore.user.nome = updated.nome
        authStore.user.name = updated.nome
        authStore.user.email = updated.email
        if (updated.role) {
          authStore.user.role = updated.role
        }
        localStorage.setItem('user', JSON.stringify(authStore.user))
      }
    } catch (err: any) {
      error.value = err?.message || 'Erro ao salvar alterações no perfil'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  return {
    isLoading,
    isSaving,
    error,
    profile,
    fetchProfile,
    updateProfile
  }
})
