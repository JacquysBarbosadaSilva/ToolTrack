import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Machine, MachineStatus, NewMachinePayload } from '@/types/producao'
import { machinesService } from '@/services/machines.service'

export const useProducaoStore = defineStore('producao', () => {

  const isLoading = ref<boolean>(false)
  const isSaving = ref<boolean>(false)
  const isDeleting = ref<boolean>(false)
  const error = ref<string | null>(null)
  const searchQuery = ref<string>('')
  const machines = ref<Machine[]>([])

  const filteredMachines = computed<Machine[]>(() => {
    if (!searchQuery.value.trim()) {
      return machines.value
    }
    const q = searchQuery.value.toLowerCase().trim()
    return machines.value.filter((m) => {
      const matchName = (m.name || '').toLowerCase().includes(q)
      const matchId = (m.id || '').toLowerCase().includes(q)
      const matchStatus = (m.status || '').toLowerCase().includes(q)
      const matchInfo = (m.extraInfo || '').toLowerCase().includes(q)
      return matchName || matchId || matchStatus || matchInfo
    })
  })

  async function fetchMachines(silent: boolean = false): Promise<void> {
    if (!silent) {
      isLoading.value = true
      error.value = null
    }
    try {
      const items = await machinesService.listMachines({
        search: searchQuery.value || undefined
      })
      machines.value = items
    } catch (err: any) {
      if (!silent) {
        error.value = err?.message || 'Erro ao carregar máquinas do DynamoDB'
      } else {
        console.warn('Erro ao atualizar máquinas em background:', err?.message || err)
      }
    } finally {
      if (!silent) {
        isLoading.value = false
      }
    }
  }

  async function addMachine(payload: NewMachinePayload): Promise<void> {
    isSaving.value = true
    error.value = null
    try {
      const created = await machinesService.createMachine(payload)
      machines.value.unshift(created)
    } catch (err: any) {
      error.value = err?.message || 'Erro ao registrar nova máquina'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  async function updateMachine(id: string, payload: Partial<NewMachinePayload>): Promise<void> {
    isSaving.value = true
    error.value = null
    try {
      const updated = await machinesService.updateMachine(id, payload)
      const index = machines.value.findIndex((m) => m.id === id)
      if (index !== -1) {
        machines.value[index] = { ...machines.value[index], ...updated }
      }
    } catch (err: any) {
      error.value = err?.message || 'Erro ao atualizar máquina no DynamoDB'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  async function deleteMachine(id: string): Promise<void> {
    isDeleting.value = true
    error.value = null
    try {
      await machinesService.deleteMachine(id)
      machines.value = machines.value.filter((m) => m.id !== id)
    } catch (err: any) {
      error.value = err?.message || 'Erro ao excluir máquina no DynamoDB'
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
    machines,

    filteredMachines,

    fetchMachines,
    addMachine,
    updateMachine,
    deleteMachine
  }
})
