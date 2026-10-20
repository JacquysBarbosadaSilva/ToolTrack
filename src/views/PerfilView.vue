<template>
  <div class="space-y-6 pb-12 anim-fade-up">

    <div v-if="error" class="p-2">
      <ErrorState :message="error" @retry="perfilStore.fetchProfile" />
    </div>

    <AppCard padding-class="p-6 sm:p-8">

      <div v-if="isLoading" class="flex items-center justify-between">
        <div class="flex items-center gap-6">
          <SkeletonBlock class="w-24 h-24 rounded-full" />
          <div class="space-y-3">
            <SkeletonBlock class="h-8 w-48 rounded-lg" />
            <div class="flex gap-3">
              <SkeletonBlock class="h-5 w-24 rounded-full" />
              <SkeletonBlock class="h-5 w-32 rounded-lg" />
            </div>
          </div>
        </div>
        <SkeletonBlock class="h-10 w-28 rounded-lg" />
      </div>

      <div v-else class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">

        <div class="flex items-center gap-6">

          <div
            class="w-24 h-24 rounded-full bg-[#111B2E] text-white flex items-center justify-center font-bold text-4xl shrink-0 select-none"
          >
            {{ userInitial }}
          </div>

          <div class="space-y-1.5">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {{ profile.nome || 'Usuário' }}
            </h1>

            <div class="flex flex-wrap items-center gap-3">

              <span
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#111B2E] text-white"
              >
                <Shield class="w-3.5 h-3.5" />
                <span>{{ profile.cargo || 'Operador' }}</span>
              </span>

              <div class="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 font-medium">
                <MapPin class="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{{ profile.localizacao || 'Planta Principal' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center shrink-0">
          <BaseButton
            id="btn-edit-profile"
            variant="outline-gray"
            :icon="Pencil"
            :loading="isSaving"
            button-class="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg px-4 py-2 font-medium"
            @click="openEditModal"
          >
            Editar Perfil
          </BaseButton>
        </div>
      </div>
    </AppCard>

    <AppCard padding-class="p-6 sm:p-8">

      <div>
        <h2 class="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Informações Pessoais
        </h2>
        <hr class="border-t border-slate-200/80 my-5" />
      </div>

      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
        <div v-for="n in 4" :key="`sk-info-${n}`" class="space-y-2">
          <SkeletonBlock class="h-3 w-20 rounded" />
          <SkeletonBlock class="h-5 w-44 rounded" />
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">

        <div>
          <span class="block text-xs font-mono font-medium text-slate-500 tracking-wide">
            Email
          </span>
          <div class="flex items-center gap-2 mt-1.5">
            <Mail class="w-4 h-4 text-slate-700 shrink-0" />
            <span class="text-sm font-medium text-slate-800">
              {{ profile.email || '-' }}
            </span>
          </div>
        </div>

        <div>
          <span class="block text-xs font-mono font-medium text-slate-500 tracking-wide">
            Telefone
          </span>
          <div class="flex items-center gap-2 mt-1.5">
            <Phone class="w-4 h-4 text-slate-700 shrink-0" />
            <span class="text-sm font-medium text-slate-800">
              {{ profile.telefone || '-' }}
            </span>
          </div>
        </div>

        <div>
          <span class="block text-xs font-mono font-medium text-slate-500 tracking-wide">
            Departamento
          </span>
          <div class="flex items-center gap-2 mt-1.5">
            <Newspaper class="w-4 h-4 text-slate-700 shrink-0" />
            <span class="text-sm font-medium text-slate-800">
              {{ profile.departamento || '-' }}
            </span>
          </div>
        </div>

        <div>
          <span class="block text-xs font-mono font-medium text-slate-500 tracking-wide">
            ID do Funcionário
          </span>
          <div class="flex items-center gap-2 mt-1.5">
            <IdCard class="w-4 h-4 text-slate-700 shrink-0" />
            <span class="text-sm font-medium text-slate-800">
              {{ profile.idFuncionario || '-' }}
            </span>
          </div>
        </div>
      </div>
    </AppCard>

    <Teleport to="body">
      <Transition name="modal">
      <div
        v-if="isEditModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        @click.self="isEditModalOpen = false"
      >
        <div class="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden anim-scale-in">

          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-base font-bold text-slate-900">
              Editar Perfil
            </h3>
            <button
              type="button"
              @click="isEditModalOpen = false"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <form @submit.prevent="handleSaveProfile" class="p-6 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label for="edit-nome" class="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  id="edit-nome"
                  v-model="editForm.nome"
                  type="text"
                  required
                  placeholder="Ex: Admin"
                  class="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-2 focus:ring-[#0B4FB3]/20 outline-hidden transition-all"
                />
              </div>

              <div>
                <label for="edit-cargo" class="block text-xs font-semibold text-slate-700 mb-1">
                  Cargo *
                </label>
                <input
                  id="edit-cargo"
                  v-model="editForm.cargo"
                  type="text"
                  required
                  placeholder="Ex: Admin"
                  class="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-2 focus:ring-[#0B4FB3]/20 outline-hidden transition-all"
                />
              </div>
            </div>

            <div>
              <label for="edit-loc" class="block text-xs font-semibold text-slate-700 mb-1">
                Localização *
              </label>
              <input
                id="edit-loc"
                v-model="editForm.localizacao"
                type="text"
                required
                placeholder="Ex: Setor Norte - Planta 4"
                class="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-2 focus:ring-[#0B4FB3]/20 outline-hidden transition-all"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label for="edit-email" class="block text-xs font-semibold text-slate-700 mb-1">
                  Email *
                </label>
                <input
                  id="edit-email"
                  v-model="editForm.email"
                  type="email"
                  required
                  placeholder="Ex: admin@email.com"
                  class="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-2 focus:ring-[#0B4FB3]/20 outline-hidden transition-all"
                />
              </div>

              <div>
                <label for="edit-tel" class="block text-xs font-semibold text-slate-700 mb-1">
                  Telefone *
                </label>
                <input
                  id="edit-tel"
                  v-model="editForm.telefone"
                  type="text"
                  required
                  placeholder="Ex: +55 11 99999-9999"
                  class="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-2 focus:ring-[#0B4FB3]/20 outline-hidden transition-all"
                />
              </div>
            </div>

            <div>
              <label for="edit-dep" class="block text-xs font-semibold text-slate-700 mb-1">
                Departamento *
              </label>
              <input
                id="edit-dep"
                v-model="editForm.departamento"
                type="text"
                required
                placeholder="Ex: Operações de Chão de Fábrica"
                class="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-2 focus:ring-[#0B4FB3]/20 outline-hidden transition-all"
              />
            </div>

            <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
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
              >
                Salvar Alterações
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  Shield,
  MapPin,
  Pencil,
  Mail,
  Phone,
  Newspaper,
  IdCard,
  X
} from 'lucide-vue-next'
import { AppCard, BaseButton, SkeletonBlock, ErrorState } from '@/components/ui'
import { usePerfilStore } from '@/stores/perfilStore'
import { showToast } from '@/services/toast'
import type { UpdateProfilePayload } from '@/types/perfil'

const perfilStore = usePerfilStore()
const { profile, isLoading, isSaving, error } = storeToRefs(perfilStore)

const isEditModalOpen = ref(false)

const userInitial = computed(() => {
  const name = (profile.value.nome || '').trim()
  return (name[0] || 'U').toUpperCase()
})

const editForm = reactive<UpdateProfilePayload>({
  nome: '',
  cargo: '',
  localizacao: '',
  email: '',
  telefone: '',
  departamento: ''
})

function openEditModal() {
  editForm.nome = profile.value.nome
  editForm.cargo = profile.value.cargo
  editForm.localizacao = profile.value.localizacao
  editForm.email = profile.value.email
  editForm.telefone = profile.value.telefone
  editForm.departamento = profile.value.departamento
  isEditModalOpen.value = true
}

async function handleSaveProfile() {
  if (!editForm.nome?.trim()) {
    showToast('Informe o nome completo.', 'warning')
    return
  }
  if (!editForm.email?.trim() || !editForm.email.includes('@')) {
    showToast('Informe um e-mail válido.', 'warning')
    return
  }
  if (!editForm.cargo?.trim()) {
    showToast('Informe o cargo.', 'warning')
    return
  }
  if (!editForm.localizacao?.trim()) {
    showToast('Informe a localização.', 'warning')
    return
  }
  if (!editForm.telefone?.trim()) {
    showToast('Informe o telefone.', 'warning')
    return
  }
  if (!editForm.departamento?.trim()) {
    showToast('Informe o departamento.', 'warning')
    return
  }

  try {
    await perfilStore.updateProfile({
      nome: editForm.nome.trim(),
      cargo: editForm.cargo.trim(),
      localizacao: editForm.localizacao.trim(),
      email: editForm.email.trim(),
      telefone: editForm.telefone.trim(),
      departamento: editForm.departamento.trim()
    })
    isEditModalOpen.value = false
    showToast('Perfil atualizado com sucesso!', 'success')
  } catch (err: any) {
    showToast(err?.message || 'Erro ao atualizar perfil.', 'error')
  }
}

onMounted(() => {
  perfilStore.fetchProfile()
})

onBeforeRouteLeave(() => {
  isEditModalOpen.value = false
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
