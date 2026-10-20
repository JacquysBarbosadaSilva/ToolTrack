<template>
  <div class="space-y-6 pb-12 anim-fade-up">

    <header class="flex items-center justify-between pb-4 border-b border-slate-200/80">
      <h2 class="text-lg font-bold text-slate-900 tracking-tight">
        ToolTrack
      </h2>

      <BaseButton
        id="btn-add-machine-top"
        variant="primary"
        button-class="!bg-[#111B2E] hover:!bg-[#1E293B] text-white text-xs font-semibold rounded-lg px-4 py-2"
        @click="isModalOpen = true"
      >
        + Adicionar Nova Esteira/Máquina
      </BaseButton>
    </header>

    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Esteiras/Máquinas
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Visão geral do inventário de produção e status operacional.
        </p>
      </div>

      <div class="relative w-full sm:w-72">
        <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          v-model="searchQuery"
          type="text"
          id="search-machine"
          placeholder="Buscar máquina..."
          class="w-full pl-10 pr-4 py-2 text-xs font-normal text-slate-800 bg-white border border-slate-300 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-2 focus:ring-[#0B4FB3]/20 outline-none transition-all placeholder:text-slate-400 shadow-xs"
        />
      </div>
    </div>

    <div v-if="error" class="py-4">
      <ErrorState :message="error" @retry="fetchMachines" />
    </div>

    <div v-else-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="n in 3"
        :key="`skeleton-machine-${n}`"
        class="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4"
      >
        <div class="flex justify-between items-center">
          <SkeletonBlock class="h-3 w-20 rounded" />
          <SkeletonBlock class="h-5 w-16 rounded-md" />
        </div>
        <SkeletonBlock class="h-6 w-36 rounded" />
        <div class="grid grid-cols-2 gap-4 pt-2">
          <SkeletonBlock class="h-10 w-full rounded-lg" />
          <SkeletonBlock class="h-10 w-full rounded-lg" />
        </div>
        <div class="border-t border-slate-100 pt-3 flex justify-between">
          <SkeletonBlock class="h-3 w-32 rounded" />
          <SkeletonBlock class="h-4 w-4 rounded" />
        </div>
      </div>
    </div>

    <div v-else-if="filteredMachines.length === 0" class="py-6">
      <EmptyState title="Nenhuma máquina encontrada" />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MachineCard
        v-for="machine in filteredMachines"
        :key="machine.id"
        :machine="machine"
        @edit="handleOpenEditModal"
        @delete="handleConfirmDelete"
      />
    </div>

    <Teleport to="body">
      <Transition name="modal">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
        @click.self="isModalOpen = false"
      >
        <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 anim-scale-in">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="text-base font-bold text-slate-900">
              Adicionar Nova Esteira/Máquina
            </h3>
            <button
              type="button"
              @click="isModalOpen = false"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <form @submit.prevent="handleSaveMachine" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                Nome da Máquina *
              </label>
              <input
                v-model="newMachineForm.name"
                type="text"
                required
                placeholder="Ex: Esteira B-1"
                class="w-full px-3 py-2 text-xs font-normal text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-1 focus:ring-[#0B4FB3]/20 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                Status Inicial *
              </label>
              <select
                v-model="newMachineForm.status"
                class="w-full px-3 py-2 text-xs font-normal text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-1 focus:ring-[#0B4FB3]/20 outline-none transition-all cursor-pointer"
              >
                <option value="Operacional">Operacional</option>
                <option value="Parada">Parada</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Setup">Setup</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">
                  Produção (Hora)
                </label>
                <input
                  v-model="newMachineForm.producaoHora"
                  type="text"
                  placeholder="Ex: 850 unid."
                  class="w-full px-3 py-2 text-xs font-normal text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-1 focus:ring-[#0B4FB3]/20 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">
                  Eficiência (OEE)
                </label>
                <input
                  v-model="newMachineForm.eficienciaOEE"
                  type="text"
                  placeholder="Ex: 92%"
                  class="w-full px-3 py-2 text-xs font-normal text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-1 focus:ring-[#0B4FB3]/20 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                Informação de Manutenção / Status
              </label>
              <input
                v-model="newMachineForm.extraInfo"
                type="text"
                placeholder="Ex: Última manutenção: 10/10/2026"
                class="w-full px-3 py-2 text-xs font-normal text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-1 focus:ring-[#0B4FB3]/20 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                @click="isModalOpen = false"
                class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <BaseButton
                type="submit"
                variant="primary"
                :loading="isSaving"
                :disabled="isSaving"
                button-class="!bg-[#111B2E] hover:!bg-[#1E293B] text-white"
              >
                Salvar Máquina
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="modal">
      <div
        v-if="isEditModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
        @click.self="isEditModalOpen = false"
      >
        <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 anim-scale-in">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="text-base font-bold text-slate-900">
              Editar Esteira/Máquina
            </h3>
            <button
              type="button"
              @click="isEditModalOpen = false"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <form @submit.prevent="handleSaveEditMachine" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                Nome da Máquina *
              </label>
              <input
                v-model="editMachineForm.name"
                type="text"
                required
                placeholder="Ex: Esteira B-1"
                class="w-full px-3 py-2 text-xs font-normal text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-1 focus:ring-[#0B4FB3]/20 outline-none transition-all"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                Status *
              </label>
              <select
                v-model="editMachineForm.status"
                class="w-full px-3 py-2 text-xs font-normal text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-1 focus:ring-[#0B4FB3]/20 outline-none transition-all cursor-pointer"
              >
                <option value="Operacional">Operacional</option>
                <option value="Parada">Parada</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Setup">Setup</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">
                  Produção (Hora)
                </label>
                <input
                  v-model="editMachineForm.producaoHora"
                  type="text"
                  placeholder="Ex: 850 unid."
                  class="w-full px-3 py-2 text-xs font-normal text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-1 focus:ring-[#0B4FB3]/20 outline-none transition-all"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">
                  Eficiência (OEE)
                </label>
                <input
                  v-model="editMachineForm.eficienciaOEE"
                  type="text"
                  placeholder="Ex: 92%"
                  class="w-full px-3 py-2 text-xs font-normal text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-1 focus:ring-[#0B4FB3]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                Informação de Manutenção / Status
              </label>
              <input
                v-model="editMachineForm.extraInfo"
                type="text"
                placeholder="Ex: Última manutenção: 10/10/2026"
                class="w-full px-3 py-2 text-xs font-normal text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-1 focus:ring-[#0B4FB3]/20 outline-none transition-all"
              />
            </div>

            <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                @click="isEditModalOpen = false"
                class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <BaseButton
                type="submit"
                variant="primary"
                :loading="isSaving"
                :disabled="isSaving"
                button-class="!bg-[#111B2E] hover:!bg-[#1E293B] text-white"
              >
                Salvar Alterações
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="modal">
      <div
        v-if="isDeleteModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
        @click.self="isDeleteModalOpen = false"
      >
        <div class="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden anim-scale-in">
          <div class="p-6 text-center space-y-4">
            <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle class="w-6 h-6 stroke-[2]" />
            </div>

            <div>
              <h3 class="text-base font-bold text-slate-900">
                Excluir Esteira/Máquina
              </h3>
              <p class="text-xs text-slate-500 mt-2">
                Tem certeza de que deseja excluir a esteira/máquina
                <strong class="text-slate-800 font-semibold">{{ machineToDelete?.name }}</strong>
                ({{ machineToDelete?.id }})?
              </p>
              <p class="text-[11px] text-red-500 mt-1 font-medium">
                Esta ação não pode ser desfeita.
              </p>
            </div>

            <div class="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                @click="isDeleteModalOpen = false"
                class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <BaseButton
                type="button"
                :loading="isDeleting"
                :disabled="isDeleting"
                button-class="!bg-red-600 hover:!bg-red-700 text-white"
                @click="handleExecuteDeleteMachine"
              >
                Excluir Máquina
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Search, AlertTriangle, X } from 'lucide-vue-next'
import { useProducaoStore } from '@/stores/producaoStore'
import { MachineCard, BaseButton, SkeletonBlock, ErrorState, EmptyState } from '@/components/ui'
import { showToast } from '@/services/toast'
import type { Machine, MachineStatus } from '@/types/producao'

const producaoStore = useProducaoStore()
const {
  isLoading,
  isSaving,
  isDeleting,
  error,
  searchQuery,
  filteredMachines
} = storeToRefs(producaoStore)

const { fetchMachines, addMachine, updateMachine, deleteMachine } = producaoStore

const isModalOpen = ref(false)
const newMachineForm = ref<{
  name: string
  status: MachineStatus
  producaoHora: string
  eficienciaOEE: string
  extraInfo: string
}>({
  name: '',
  status: 'Operacional',
  producaoHora: '',
  eficienciaOEE: '',
  extraInfo: ''
})

async function handleSaveMachine() {
  if (!newMachineForm.value.name.trim()) {
    showToast('Informe o nome da máquina.', 'warning')
    return
  }
  try {
    await addMachine({
      id: `MCH-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newMachineForm.value.name.trim(),
      status: newMachineForm.value.status,
      producaoHora: newMachineForm.value.producaoHora.trim(),
      eficienciaOEE: newMachineForm.value.eficienciaOEE.trim(),
      extraInfo: newMachineForm.value.extraInfo.trim()
    })
    isModalOpen.value = false
    newMachineForm.value = {
      name: '',
      status: 'Operacional',
      producaoHora: '',
      eficienciaOEE: '',
      extraInfo: ''
    }
    showToast('Máquina adicionada com sucesso!', 'success')
  } catch (err: any) {
    showToast(err?.message || 'Erro ao adicionar máquina.', 'error')
  }
}

const isEditModalOpen = ref(false)
const editingMachineId = ref<string | null>(null)
const editMachineForm = ref<{
  name: string
  status: MachineStatus
  producaoHora: string
  eficienciaOEE: string
  extraInfo: string
}>({
  name: '',
  status: 'Operacional',
  producaoHora: '',
  eficienciaOEE: '',
  extraInfo: ''
})

function handleOpenEditModal(machine: Machine) {
  editingMachineId.value = machine.id
  editMachineForm.value = {
    name: machine.name,
    status: machine.status,
    producaoHora: machine.producaoHora || '',
    eficienciaOEE: machine.eficienciaOEE || '',
    extraInfo: machine.extraInfo || ''
  }
  isEditModalOpen.value = true
}

async function handleSaveEditMachine() {
  if (!editMachineForm.value.name.trim()) {
    showToast('Informe o nome da máquina.', 'warning')
    return
  }
  if (!editingMachineId.value) return

  try {
    await updateMachine(editingMachineId.value, {
      name: editMachineForm.value.name.trim(),
      status: editMachineForm.value.status,
      producaoHora: editMachineForm.value.producaoHora.trim(),
      eficienciaOEE: editMachineForm.value.eficienciaOEE.trim(),
      extraInfo: editMachineForm.value.extraInfo.trim()
    })
    isEditModalOpen.value = false
    editingMachineId.value = null
    showToast('Máquina atualizada com sucesso!', 'success')
  } catch (err: any) {
    showToast(err?.message || 'Erro ao atualizar máquina.', 'error')
  }
}

const isDeleteModalOpen = ref(false)
const machineToDelete = ref<Machine | null>(null)

function handleConfirmDelete(machine: Machine) {
  machineToDelete.value = machine
  isDeleteModalOpen.value = true
}

async function handleExecuteDeleteMachine() {
  if (!machineToDelete.value) return
  const id = machineToDelete.value.id
  try {
    await deleteMachine(id)
    isDeleteModalOpen.value = false
    machineToDelete.value = null
    showToast('Máquina removida com sucesso!', 'success')
  } catch (err: any) {
    showToast(err?.message || 'Erro ao excluir máquina.', 'error')
  }
}

onMounted(() => {
  fetchMachines()
})

onBeforeRouteLeave(() => {
  isModalOpen.value = false
  isEditModalOpen.value = false
  isDeleteModalOpen.value = false
  machineToDelete.value = null
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
