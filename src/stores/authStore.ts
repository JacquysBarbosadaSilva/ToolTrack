import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import type { User, LoginCredentials } from '@/types/auth'
import { authService } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {

  const storedToken = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')

  const token = ref<string | null>(storedToken)
  const user = ref<User | null>(storedUser ? JSON.parse(storedUser) : null)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const credentials = reactive<LoginCredentials>({
    email: '',
    password: '',
    name: ''
  })

  const isAuthenticated = computed<boolean>(() => !!token.value)
  const isAdmin = computed<boolean>(() => {
    const role = (user.value?.role || '').toLowerCase()
    return role === 'admin'
  })

  async function login(payload: Partial<LoginCredentials> = credentials): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response = await authService.login({
        email: payload.email || '',
        password: payload.password || ''
      })

      token.value = response.token
      user.value = response.user

      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
    } catch (err: any) {
      error.value = err?.message || 'Erro ao realizar login'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchMe(): Promise<void> {
    if (!token.value) return
    try {
      const response = await authService.getMe()
      user.value = response.user
      localStorage.setItem('user', JSON.stringify(response.user))
    } catch (_err) {
      logout()
    }
  }

  function logout(): void {
    user.value = null
    token.value = null
    error.value = null
    credentials.email = ''
    credentials.password = ''
    credentials.name = ''
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  function clearError(): void {
    error.value = null
  }

  return {

    user,
    token,
    isLoading,
    error,
    credentials,

    isAuthenticated,
    isAdmin,

    login,
    fetchMe,
    logout,
    clearError
  }
})
