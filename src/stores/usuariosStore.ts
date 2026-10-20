import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserAccount, NewUserPayload, UpdateUserPayload } from '@/types/usuarios'
import { usersService } from '@/services/users.service'

export const useUsuariosStore = defineStore('usuarios', () => {
  const isLoading = ref<boolean>(false)
  const isSaving = ref<boolean>(false)
  const isDeleting = ref<boolean>(false)
  const error = ref<string | null>(null)
  const searchQuery = ref<string>('')
  const users = ref<UserAccount[]>([])

  const filteredUsers = computed<UserAccount[]>(() => {
    if (!searchQuery.value) return users.value
    const q = searchQuery.value.toLowerCase().trim()
    return users.value.filter((u) => {
      const matchName = (u.nome || u.name || '').toLowerCase().includes(q)
      const matchEmail = (u.email || '').toLowerCase().includes(q)
      const matchRole = (u.role || '').toLowerCase().includes(q)
      const matchCargo = (u.cargo || '').toLowerCase().includes(q)
      return matchName || matchEmail || matchRole || matchCargo
    })
  })

  async function fetchUsers(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const list = await usersService.listUsers()
      users.value = list
    } catch (err: any) {
      error.value = err?.message || 'Falha ao buscar usuários no DynamoDB'
    } finally {
      isLoading.value = false
    }
  }

  async function addUser(payload: NewUserPayload): Promise<void> {
    isSaving.value = true
    error.value = null
    try {
      const userName = (payload.name || payload.nome || '').trim()
      const created = await usersService.createUser({
        name: userName,
        nome: userName,
        email: payload.email,
        password: payload.password,
        role: payload.role,
        cargo: payload.cargo,
        departamento: payload.departamento,
        localizacao: payload.localizacao
      })
      users.value.unshift(created)
    } catch (err: any) {
      error.value = err?.message || 'Erro ao cadastrar usuário no DynamoDB'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  async function updateUser(id: string, payload: UpdateUserPayload): Promise<void> {
    isSaving.value = true
    error.value = null
    try {
      const updated = await usersService.updateUser(id, payload)
      const index = users.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...updated }
      }
    } catch (err: any) {
      error.value = err?.message || 'Erro ao atualizar usuário no DynamoDB'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  async function deleteUser(id: string): Promise<void> {
    isDeleting.value = true
    error.value = null
    try {
      await usersService.deleteUser(id)
      users.value = users.value.filter((u) => u.id !== id)
    } catch (err: any) {
      error.value = err?.message || 'Erro ao remover usuário no DynamoDB'
      throw err
    } finally {
      isDeleting.value = false
    }
  }

  return {
    isLoading,
    isSaving,
    isDeleting,
    error,
    searchQuery,
    users,
    filteredUsers,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser
  }
})
