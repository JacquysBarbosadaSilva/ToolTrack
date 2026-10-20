<template>
  <div class="space-y-6 pb-12 anim-fade-up">

    <header class="pb-4 border-b border-slate-200/80">
      <h2 class="text-lg font-bold text-slate-900 tracking-tight">
        ToolTrack
      </h2>
    </header>

    <div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Gerenciar Usuários
      </h1>
      <p class="text-sm text-slate-500 mt-1">
        Manage system access and roles.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      <div class="lg:col-span-5 xl:col-span-4">
        <AppCard padding-class="p-6">

          <h2 class="text-base font-bold text-slate-900 pb-3 border-b border-slate-200/80 mb-5">
            Adicionar novo usuário
          </h2>

          <form @submit.prevent="handleCreateUser" class="space-y-4">

            <div>
              <label for="new-user-name" class="block text-xs font-mono font-medium text-slate-500 mb-1.5">
                Nome completo
              </label>
              <div class="relative">
                <User class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="new-user-name"
                  v-model="newUserForm.name"
                  type="text"
                  required
                  placeholder="User"
                  class="w-full pl-10 pr-3.5 py-2 text-xs font-normal text-slate-800 bg-white border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-1 focus:ring-[#0B4FB3]/20 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label for="new-user-email" class="block text-xs font-mono font-medium text-slate-500 mb-1.5">
                Email
              </label>
              <div class="relative">
                <Mail class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="new-user-email"
                  v-model="newUserForm.email"
                  type="email"
                  required
                  placeholder="user@email.com"
                  class="w-full pl-10 pr-3.5 py-2 text-xs font-normal text-slate-800 bg-white border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-1 focus:ring-[#0B4FB3]/20 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label for="new-user-role" class="block text-xs font-mono font-medium text-slate-500 mb-1.5">
                Cargo
              </label>
              <div class="relative">
                <IdCard class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  id="new-user-role"
                  v-model="newUserForm.role"
                  class="w-full pl-10 pr-8 py-2 text-xs font-normal text-slate-800 bg-white border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-1 focus:ring-[#0B4FB3]/20 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="USER">Funcionário</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <ChevronDown class="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label for="new-user-password" class="block text-xs font-mono font-medium text-slate-500 mb-1.5">
                Senha
              </label>
              <div class="relative">
                <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="new-user-password"
                  v-model="newUserForm.password"
                  type="password"
                  required
                  minlength="6"
                  placeholder="••••••••"
                  class="w-full pl-10 pr-3.5 py-2 text-xs font-normal text-slate-800 bg-white border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-1 focus:ring-[#0B4FB3]/20 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div class="pt-2">
              <BaseButton
                type="submit"
                id="btn-save-user"
                :loading="isSaving"
                :disabled="isSaving"
                :icon="UserPlus"
                button-class="w-full !bg-[#111B2E] hover:!bg-[#1E293B] text-white font-medium py-2.5 rounded-lg text-xs sm:text-sm shadow-xs"
              >
                Salvar Usuário
              </BaseButton>
            </div>
          </form>
        </AppCard>
      </div>

      <div class="lg:col-span-7 xl:col-span-8">
        <AppCard :no-padding="true" card-class="overflow-hidden">

          <div class="p-5 border-b border-slate-200/80 flex items-center justify-between gap-4">
            <h2 class="text-base font-bold text-slate-900">
              Usuários
            </h2>

            <div class="relative w-56 sm:w-64">
              <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="search-users-input"
                v-model="searchQuery"
                type="text"
                placeholder="Search users..."
                class="w-full pl-8 pr-3 py-1.5 text-xs font-normal text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B4FB3] focus:border-[#0B4FB3] transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div v-if="isLoading" class="p-6 space-y-4">
            <div v-for="n in 3" :key="`sk-user-${n}`" class="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <div class="flex items-center gap-3">
                <SkeletonBlock class="w-8 h-8 rounded-full" />
                <div class="space-y-1.5">
                  <SkeletonBlock class="h-3.5 w-32 rounded" />
                  <SkeletonBlock class="h-3 w-40 rounded" />
                </div>
              </div>
              <SkeletonBlock class="h-5 w-16 rounded" />
              <SkeletonBlock class="h-4 w-12 rounded" />
              <div class="flex items-center gap-2">
                <SkeletonBlock class="h-6 w-14 rounded-full" />
                <SkeletonBlock class="h-6 w-6 rounded" />
              </div>
            </div>
          </div>

          <div v-else-if="error" class="p-6">
            <ErrorState :message="error" @retry="fetchUsers" />
          </div>

          <div v-else-if="filteredUsers.length === 0" class="p-6">
            <EmptyState title="Nenhum registro encontrado" />
          </div>

          <div v-else class="overflow-x-auto min-h-[220px]">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-slate-50/50 border-b border-slate-200/80 text-xs font-mono font-medium text-slate-500">
                  <th scope="col" class="py-3 px-6 text-left">User</th>
                  <th scope="col" class="py-3 px-4 text-center">Cargo</th>
                  <th scope="col" class="py-3 px-4 text-center">Status</th>
                  <th scope="col" class="py-3 px-6 text-center">Ações</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="user in filteredUsers"
                  :key="user.id"
                  class="hover:bg-slate-50/50 transition-colors"
                >

                  <td class="py-4 px-6">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs select-none shrink-0"
                        :class="user.role === 'ADMIN' || user.role === 'admin' ? 'bg-[#111B2E] text-white' : 'bg-slate-200 text-slate-700'"
                      >
                        {{ ((user.name || user.nome || 'U')[0]).toUpperCase() }}
                      </div>
                      <div class="min-w-0">
                        <p class="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                          {{ user.name || user.nome }}
                        </p>
                        <p class="text-[11px] text-slate-500 truncate">
                          {{ user.email }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td class="py-4 px-4 text-center">
                    <span
                      class="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider"
                      :class="user.role === 'ADMIN' || user.role === 'admin' ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'bg-slate-100 text-slate-600'"
                    >
                      {{ user.role.toUpperCase() }}
                    </span>
                  </td>

                  <td class="py-4 px-4 text-center">
                    <span class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                      <span
                        class="w-2 h-2 rounded-full shrink-0"
                        :class="user.status === 'Online' || user.ativo !== false ? 'bg-emerald-500' : 'bg-slate-400'"
                      ></span>
                      <span>{{ user.status || (user.ativo !== false ? 'Online' : 'Offline') }}</span>
                    </span>
                  </td>

                  <td class="py-4 px-6 text-center">
                    <div class="inline-flex items-center justify-center gap-2">
                      <button
                        type="button"
                        @click="openEditModal(user)"
                        class="rounded-full border border-slate-300 px-3.5 py-0.5 text-xs font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        @click="confirmDeleteUser(user)"
                        class="w-5 h-5 rounded bg-red-500 hover:bg-red-600 active:bg-red-700 flex items-center justify-center text-white transition-colors cursor-pointer shadow-2xs"
                        title="Remover usuário"
                        aria-label="Remover usuário"
                      >
                        <X class="w-3 h-3 stroke-[2.5]" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="py-4 border-t border-slate-200/80 text-center text-xs text-slate-500">
            Mostrando {{ filteredUsers.length }} de {{ users.length }} usuário(s)
          </div>
        </AppCard>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
      <div
        v-if="isEditModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        @click.self="isEditModalOpen = false"
      >
        <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden anim-scale-in">
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-base font-bold text-slate-900">
              Editar Usuário
            </h3>
            <button
              type="button"
              @click="isEditModalOpen = false"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <form @submit.prevent="handleSaveEditUser" class="p-6 space-y-4">

            <div>
              <label for="edit-user-name" class="block text-xs font-semibold text-slate-700 mb-1">
                Nome completo *
              </label>
              <input
                id="edit-user-name"
                v-model="editForm.name"
                type="text"
                required
                class="w-full px-3 py-2 text-xs font-normal text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-1 focus:ring-[#0B4FB3]/20 outline-none transition-all"
              />
            </div>

            <div>
              <label for="edit-user-email" class="block text-xs font-semibold text-slate-700 mb-1">
                Email *
              </label>
              <input
                id="edit-user-email"
                v-model="editForm.email"
                type="email"
                required
                class="w-full px-3 py-2 text-xs font-normal text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-1 focus:ring-[#0B4FB3]/20 outline-none transition-all"
              />
            </div>

            <div>
              <label for="edit-user-role" class="block text-xs font-semibold text-slate-700 mb-1">
                Cargo *
              </label>
              <select
                id="edit-user-role"
                v-model="editForm.role"
                class="w-full px-3 py-2 text-xs font-normal text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-1 focus:ring-[#0B4FB3]/20 outline-none transition-all"
              >
                <option value="USER">Funcionário (USER)</option>
                <option value="ADMIN">Admin (ADMIN)</option>
              </select>
            </div>

            <div>
              <label for="edit-user-status" class="block text-xs font-semibold text-slate-700 mb-1">
                Status *
              </label>
              <select
                id="edit-user-status"
                v-model="editForm.status"
                class="w-full px-3 py-2 text-xs font-normal text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-1 focus:ring-[#0B4FB3]/20 outline-none transition-all"
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>

            <div>
              <label for="edit-user-password" class="block text-xs font-semibold text-slate-700 mb-1">
                Nova Senha (opcional)
              </label>
              <input
                id="edit-user-password"
                v-model="editForm.password"
                type="password"
                minlength="6"
                placeholder="Deixe em branco para não alterar"
                class="w-full px-3 py-2 text-xs font-normal text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0B4FB3] focus:ring-1 focus:ring-[#0B4FB3]/20 outline-none transition-all placeholder:text-slate-400"
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

    <Teleport to="body">
      <Transition name="modal">
      <div
        v-if="isDeleteModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        @click.self="isDeleteModalOpen = false"
      >
        <div class="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden anim-scale-in">
          <div class="p-6 text-center space-y-4">
            <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle class="w-6 h-6 stroke-[2]" />
            </div>

            <div>
              <h3 class="text-base font-bold text-slate-900">
                Excluir Usuário
              </h3>
              <p class="text-xs text-slate-500 mt-2">
                Tem certeza de que deseja excluir o usuário
                <strong class="text-slate-800 font-semibold">{{ userToDelete?.name || userToDelete?.nome }}</strong>
                ({{ userToDelete?.email }})?
              </p>
              <p class="text-[11px] text-red-500 mt-1 font-medium">
                Esta ação não pode ser desfeita.
              </p>
            </div>

            <div class="pt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                @click="isDeleteModalOpen = false"
                class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <BaseButton
                type="button"
                variant="primary"
                button-class="!bg-red-600 hover:!bg-red-700 text-white"
                :loading="isDeleting"
                :disabled="isDeleting"
                @click="handleExecuteDelete"
              >
                Sim, Excluir
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
import { ref, reactive, onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  User,
  Mail,
  IdCard,
  ChevronDown,
  Lock,
  UserPlus,
  Search,
  X,
  AlertTriangle
} from 'lucide-vue-next'
import { AppCard, BaseButton, SkeletonBlock, ErrorState, EmptyState } from '@/components/ui'
import { useUsuariosStore } from '@/stores/usuariosStore'
import { showToast } from '@/services/toast'
import type { UserAccount, NewUserPayload, UpdateUserPayload } from '@/types/usuarios'

const usuariosStore = useUsuariosStore()
const { users, filteredUsers, isLoading, isSaving, isDeleting, error, searchQuery } = storeToRefs(usuariosStore)
const { fetchUsers, addUser, updateUser, deleteUser } = usuariosStore

const newUserForm = reactive<NewUserPayload>({
  name: '',
  email: '',
  role: 'USER',
  password: ''
})

const isEditModalOpen = ref(false)
const editingUserId = ref<string | null>(null)
const editForm = reactive<UpdateUserPayload>({
  name: '',
  email: '',
  role: 'USER',
  status: 'Online',
  password: ''
})

const isDeleteModalOpen = ref(false)
const userToDelete = ref<UserAccount | null>(null)

async function handleCreateUser() {
  if (!newUserForm.name || !newUserForm.email || !newUserForm.password) {
    showToast('Preencha todos os campos obrigatórios.', 'warning')
    return
  }
  if (newUserForm.password.length < 6) {
    showToast('A senha deve conter no mínimo 6 caracteres.', 'warning')
    return
  }
  try {
    await addUser({ ...newUserForm })
    newUserForm.name = ''
    newUserForm.email = ''
    newUserForm.role = 'USER'
    newUserForm.password = ''
    showToast('Usuário cadastrado com sucesso!')
  } catch (err: any) {
    showToast(err?.message || 'Erro ao cadastrar usuário.')
  }
}

function openEditModal(user: UserAccount) {
  editingUserId.value = user.id
  editForm.name = user.name || user.nome || ''
  editForm.email = user.email
  editForm.role = (user.role || 'USER').toUpperCase() as any
  editForm.status = user.status || 'Online'
  editForm.password = ''
  isEditModalOpen.value = true
}

async function handleSaveEditUser() {
  if (!editingUserId.value) return
  if (!editForm.name || !editForm.email) {
    showToast('Nome e e-mail são obrigatórios.', 'warning')
    return
  }
  try {
    const payload: UpdateUserPayload = {
      name: editForm.name,
      email: editForm.email,
      role: editForm.role,
      status: editForm.status
    }
    if (editForm.password && editForm.password.trim().length >= 6) {
      payload.password = editForm.password.trim()
    }
    await updateUser(editingUserId.value, payload)
    isEditModalOpen.value = false
    editingUserId.value = null
    showToast('Usuário atualizado com sucesso!')
  } catch (err: any) {
    showToast(err?.message || 'Erro ao atualizar usuário.')
  }
}

function confirmDeleteUser(user: UserAccount) {
  userToDelete.value = user
  isDeleteModalOpen.value = true
}

async function handleExecuteDelete() {
  if (!userToDelete.value) return
  try {
    await deleteUser(userToDelete.value.id)
    showToast(`Usuário ${userToDelete.value.name || userToDelete.value.nome} removido com sucesso!`)
    isDeleteModalOpen.value = false
    userToDelete.value = null
  } catch (err: any) {
    showToast(err?.message || 'Erro ao remover usuário.')
  }
}

onMounted(() => {
  fetchUsers()
})

onBeforeRouteLeave(() => {
  isEditModalOpen.value = false
  isDeleteModalOpen.value = false
  userToDelete.value = null
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
