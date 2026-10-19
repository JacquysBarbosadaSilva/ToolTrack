<template>
  <header class="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-slate-200/80 shadow-xs">
    <!-- Left Section: Mobile Menu Button & Page Title -->
    <div class="flex items-center gap-3">
      <!-- Mobile Menu Button -->
      <button
        type="button"
        id="btn-mobile-menu"
        class="p-2 text-slate-600 rounded-lg lg:hidden hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        aria-label="Abrir menu de navegação"
        @click="$emit('toggleMobile')"
      >
        <Menu class="w-6 h-6" />
      </button>

      <!-- Page Title / Breadcrumb -->
      <div>
        <h1 class="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
          {{ pageTitle }}
        </h1>
        <p class="hidden sm:block text-xs text-slate-500">
          ToolTrack • Sistema de Controle & Produção
        </p>
      </div>
    </div>

    <!-- Right Section: Badges & Status -->
    <div class="flex items-center gap-2 sm:gap-4">
      <!-- Status Badge -->
      <div class="hidden sm:inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200/80">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Sistema Online</span>
      </div>

      <!-- Quick profile info -->
      <RouterLink
        to="/perfil"
        class="flex items-center gap-2.5 p-1 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
        title="Ver meu perfil"
      >
        <div class="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold">
          {{ userInitials }}
        </div>
        <span class="hidden md:inline-block text-xs font-semibold text-slate-700">
          {{ userName }}
        </span>
      </RouterLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Menu } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'

defineEmits<{
  (e: 'toggleMobile'): void
}>()

const route = useRoute()
const authStore = useAuthStore()

const pageTitle = computed(() => {
  switch (route.path) {
    case '/':
    case '/dashboard':
      return 'Dashboard Geral'
    case '/producao':
      return 'Controle de Produção'
    case '/perfil':
      return 'Perfil do Usuário'
    case '/usuarios':
      return 'Gerenciador de Usuários'
    default:
      return 'ToolTrack'
  }
})

const userName = computed(() => authStore.user?.nome || authStore.user?.name || authStore.credentials?.name || 'Administrador')
const userInitials = computed(() => {
  const name = userName.value.trim()
  if (!name) return 'AD'
  const parts = name.split(' ')
  return (parts[0][0] + (parts[1]?.[0] || parts[0][1] || '')).toUpperCase()
})
</script>
