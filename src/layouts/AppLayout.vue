<template>
  <!-- Layout Mestre Shell Único (Contrato Seção 4) -->
  <div class="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-800">
    <!-- Overlay Backdrop do Menu Mobile (apenas em telas < lg) -->
    <Transition
      enter-active-class="transition-opacity ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        aria-hidden="true"
        @click="isMobileMenuOpen = false"
      />
    </Transition>

    <!-- 1. BARRA LATERAL (Sidebar 256px / w-64 shrink-0 h-screen no desktop, drawer no mobile) -->
    <aside
      :class="[
        'fixed lg:static inset-y-0 left-0 z-50 w-64 shrink-0 h-screen flex flex-col',
        'bg-[#111B2E] text-slate-300 border-r border-[#1E293B] select-none',
        'transition-transform duration-300 ease-in-out',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
      aria-label="Barra Lateral de Navegação"
    >
      <!-- Topo: Logo Oficial (src/assets/logo-borda-branca.png) e botão fechar no mobile -->
      <div class="h-16 px-6 flex items-center justify-between border-b border-[#1E293B]/80 shrink-0">
        <router-link to="/" class="flex items-center gap-2.5 group focus:outline-hidden" title="ToolTrack Dashboard">
          <div class="relative flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <img
              :src="logoImg"
              alt="ToolTrack Logo"
              class="w-14 h-14 object-contain translate-y-1 select-none pointer-events-none"
            />
          </div>
          <span class="font-extrabold text-lg tracking-tight text-white group-hover:text-blue-400 transition-colors">
            ToolTrack
          </span>
        </router-link>

        <!-- Botão de Fechar visível apenas em telas menores -->
        <button
          type="button"
          class="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          aria-label="Fechar menu"
          @click="isMobileMenuOpen = false"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Navegação Principal (flex-1) -->
      <nav class="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <!-- Dashboard -->
        <router-link
          to="/"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          exact-active-class="!bg-white/10 !text-white !font-semibold"
          @click="isMobileMenuOpen = false"
        >
          <LayoutDashboard class="w-4 h-4 shrink-0" />
          <span>Dashboard</span>
        </router-link>

        <!-- Produção -->
        <router-link
          to="/producao"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          active-class="!bg-white/10 !text-white !font-semibold"
          @click="isMobileMenuOpen = false"
        >
          <Factory class="w-4 h-4 shrink-0" />
          <span>Produção</span>
        </router-link>

        <!-- Perfil -->
        <router-link
          to="/perfil"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          active-class="!bg-white/10 !text-white !font-semibold"
          @click="isMobileMenuOpen = false"
        >
          <User class="w-4 h-4 shrink-0" />
          <span>Perfil</span>
        </router-link>

        <!-- Gerenciador de Usuários (Apenas role = admin) -->
        <router-link
          v-if="authStore.isAdmin"
          to="/usuarios"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          active-class="!bg-white/10 !text-white !font-semibold"
          @click="isMobileMenuOpen = false"
        >
          <Users class="w-4 h-4 shrink-0" />
          <span>Gerenciador de Usuários</span>
        </router-link>
      </nav>

      <!-- Rodapé: Usuário logado e Logout fixo no rodapé (mt-auto, nunca cortado) -->
      <div class="p-3 border-t border-[#1E293B]/80 mt-auto shrink-0">
        <div v-if="authStore.user" class="px-3 py-2 mb-2 flex items-center gap-2.5 rounded-lg bg-white/5 text-xs text-slate-300">
          <div class="w-7 h-7 rounded-lg bg-[#0B4FB3] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {{ (authStore.user.nome || authStore.user.name || 'U').slice(0, 1).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white font-semibold truncate text-xs">{{ authStore.user.nome || authStore.user.name }}</p>
            <p class="text-[10px] text-slate-400 truncate">{{ authStore.user.email }}</p>
          </div>
        </div>

        <button
          type="button"
          id="btn-logout"
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-all cursor-pointer active:scale-95"
        >
          <LogOut class="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- 2. ÁREA PRINCIPAL -->
    <main class="flex-1 min-w-0 h-screen overflow-y-auto flex flex-col">
      <!-- Topbar Header Mobile (visível em telas < lg) -->
      <header class="lg:hidden flex items-center justify-between h-14 px-4 bg-[#111B2E] text-white border-b border-[#1E293B] shrink-0 no-print">
        <div class="flex items-center gap-3">
          <button
            type="button"
            id="btn-mobile-menu"
            class="p-1.5 -ml-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Abrir menu de navegação"
            @click="isMobileMenuOpen = true"
          >
            <Menu class="w-6 h-6" />
          </button>
          <router-link to="/" class="flex items-center gap-2">
            <div class="relative flex items-center justify-center shrink-0">
              <img
                :src="logoImg"
                alt="ToolTrack Logo"
                class="w-10 h-10 object-contain translate-y-0.5 select-none pointer-events-none"
              />
            </div>
            <span class="font-extrabold text-base tracking-tight text-white">ToolTrack</span>
          </router-link>
        </div>

        <div v-if="authStore.user" class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-[#0B4FB3] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {{ (authStore.user.nome || authStore.user.name || 'U').slice(0, 1).toUpperCase() }}
          </div>
        </div>
      </header>

      <!-- Área de Conteúdo com Scroll Próprio -->
      <div class="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <!-- Barra de busca no topo da área de conteúdo (Dashboard) -->
        <div v-if="$route.path === '/'" class="w-full no-print">
          <div class="relative w-full">
            <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              :value="dashboardStore.filters.search"
              @input="dashboardStore.handleSearchInput(($event.target as HTMLInputElement).value)"
              type="text"
              placeholder="Search inventory..."
              class="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4FB3]/20 focus:border-[#0B4FB3] transition-all placeholder:text-slate-400 shadow-xs"
            />
          </div>
        </div>

        <!-- Conteúdo da Rota Ativa -->
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Factory,
  User,
  Users,
  LogOut,
  Search,
  Menu,
  X
} from 'lucide-vue-next'
import logoImg from '@/assets/logo-borda-branca.png'
import { useAuthStore } from '@/stores/authStore'
import { useDashboardStore } from '@/stores/dashboardStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const dashboardStore = useDashboardStore()

const isMobileMenuOpen = ref(false)

// Fecha o drawer mobile ao navegar entre rotas
watch(
  () => route.path,
  () => {
    isMobileMenuOpen.value = false
  }
)

onMounted(() => {
  if (authStore.isAuthenticated) {
    authStore.fetchMe()
  }
})

function handleLogout() {
  isMobileMenuOpen.value = false
  authStore.logout()
  router.push('/login')
}
</script>
