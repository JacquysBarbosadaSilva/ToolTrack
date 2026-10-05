import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // --- Estados Reativos Simples ---
  const user = ref(null)
  const token = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Campos reativos do formulário
  const credentials = reactive({
    name: '',
    email: '',
    password: ''
  })

  // Getters reativos
  const isAuthenticated = computed(() => !!token.value)

  // --- Ações (Prontas e limpas para futura integração com back-end real) ---

  /**
   * Realiza a autenticação do usuário.
   * Pronto para receber a chamada de API / AWS DynamoDB / Cognito.
   * @param {Object} payload - { name, email, password }
   */
  async function login(payload = credentials) {
    isLoading.value = true
    error.value = null

    try {
      // Deixado pronto para integrar a chamada real do backend:
      // ex: const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) })
      // user.value = await res.json()
    } catch (err) {
      error.value = err?.message || 'Erro ao realizar login'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Registra um novo usuário no sistema.
   * Pronto para receber a chamada de API real.
   * @param {Object} payload
   */
  async function register(payload = credentials) {
    isLoading.value = true
    error.value = null

    try {
      // Deixado pronto para integrar com a chamada real do backend
    } catch (err) {
      error.value = err?.message || 'Erro ao cadastrar usuário'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Desconecta o usuário e limpa o estado reativo.
   */
  function logout() {
    user.value = null
    token.value = null
    error.value = null
    credentials.name = ''
    credentials.email = ''
    credentials.password = ''
  }

  /**
   * Limpa possíveis mensagens de erro da store.
   */
  function clearError() {
    error.value = null
  }

  return {
    // Estados
    user,
    token,
    isLoading,
    error,
    credentials,
    // Getters
    isAuthenticated,
    // Ações
    login,
    register,
    logout,
    clearError
  }
})
