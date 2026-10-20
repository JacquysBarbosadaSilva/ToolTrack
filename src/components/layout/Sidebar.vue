<template>
  <div>

    <Transition
      enter-active-class="transition-opacity ease-linear duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-linear duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpenMobile"
        class="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
        aria-hidden="true"
        @click="$emit('closeMobile')"
      />
    </Transition>

    <aside
      :class="[

        'fixed top-0 bottom-0 left-0 z-50 flex flex-col',
        'bg-[#1E293B] text-slate-200 border-r border-slate-700/60 shadow-xl select-none',
        'transition-all duration-300 ease-in-out',

        isCollapsed ? 'lg:w-20' : 'lg:w-64',
        'w-64',

        isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
      aria-label="Barra Lateral de Navegação"
    >

      <div
        class="flex items-center justify-between h-16 px-4 border-b border-slate-700/60 shrink-0"
        :class="{ 'lg:justify-center': isCollapsed }"
      >
        <RouterLink
          to="/"
          class="flex items-center gap-3 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
          @click="handleNavClick"
        >
          <SidebarLogo :collapsed="isCollapsed" />
        </RouterLink>

        <button
          type="button"
          class="p-2 text-slate-400 rounded-lg lg:hidden hover:text-white hover:bg-slate-700/50 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          aria-label="Fechar menu"
          @click="$emit('closeMobile')"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-700">
        <div v-if="!isCollapsed" class="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Menu Principal
        </div>

        <RouterLink
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          v-slot="{ isActive, isExactActive, navigate }"
          custom
        >
          <button
            type="button"
            :id="`nav-link-${item.name}`"
            :class="[
              'group relative flex items-center w-full rounded-xl transition-all duration-200 text-left font-medium text-sm',
              isCollapsed ? 'justify-center px-0 py-3' : 'px-3.5 py-2.8 gap-3.5',
              isItemActive(item, isActive, isExactActive)
                ? 'bg-gradient-to-r from-blue-600/25 via-blue-600/15 to-transparent text-white font-semibold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            ]"
            :aria-current="isItemActive(item, isActive, isExactActive) ? 'page' : undefined"
            @click="(e) => { navigate(e); handleNavClick(); }"
          >

            <span
              v-if="isItemActive(item, isActive, isExactActive)"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-500 rounded-r-full shadow-sm shadow-blue-500/50 transition-all duration-200"
              aria-hidden="true"
            />

            <component
              :is="item.icon"
              :class="[
                'w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110',
                isItemActive(item, isActive, isExactActive)
                  ? 'text-blue-400'
                  : 'text-slate-400 group-hover:text-slate-200'
              ]"
            />

            <span
              v-if="!isCollapsed"
              class="truncate flex-1 tracking-wide"
            >
              {{ item.label }}
            </span>

            <span
              v-if="!isCollapsed && item.badge"
              class="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30"
            >
              {{ item.badge }}
            </span>

            <div
              v-if="isCollapsed"
              class="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-md shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-slate-700/80 hidden lg:block"
            >
              {{ item.label }}
            </div>
          </button>
        </RouterLink>
      </nav>

      <div class="hidden lg:flex px-3 py-2 border-t border-slate-700/40">
        <button
          type="button"
          id="btn-toggle-sidebar"
          class="flex items-center w-full gap-3 px-3.5 py-2 text-xs font-medium text-slate-400 rounded-xl hover:text-white hover:bg-slate-700/40 transition-colors"
          :class="{ 'justify-center': isCollapsed }"
          :title="isCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'"
          @click="$emit('update:isCollapsed', !isCollapsed)"
        >
          <ChevronRight v-if="isCollapsed" class="w-4 h-4 text-slate-300" />
          <ChevronLeft v-else class="w-4 h-4 text-slate-300" />
          <span v-if="!isCollapsed">Recolher menu</span>
        </button>
      </div>

      <div class="p-3 border-t border-slate-700/60 bg-slate-900/40 shrink-0">

        <div
          class="flex items-center gap-3 p-2 rounded-xl mb-1.5 bg-slate-800/40 hover:bg-slate-800/70 transition-colors"
          :class="{ 'justify-center': isCollapsed }"
        >

          <div class="relative flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600/30 text-blue-300 font-bold text-xs border border-blue-500/30 shrink-0">
            <span>{{ userInitials }}</span>
            <span class="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#1E293B]"></span>
          </div>

          <div v-if="!isCollapsed" class="flex flex-col min-w-0 flex-1">
            <span class="text-xs font-semibold text-white truncate">
              {{ userName }}
            </span>
            <span class="text-[10px] text-slate-400 truncate">
              {{ userRole }}
            </span>
          </div>
        </div>

        <button
          type="button"
          id="btn-sidebar-logout"
          class="group relative flex items-center w-full rounded-xl transition-all duration-200 text-left font-medium text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
          :class="isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5 gap-3'"
          title="Encerrar sessão"
          @click="handleLogout"
        >
          <LogOut class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span v-if="!isCollapsed" class="font-medium tracking-wide">
            Logout
          </span>

          <div
            v-if="isCollapsed"
            class="absolute left-full ml-3 px-2.5 py-1.5 bg-red-950 text-red-200 text-xs font-medium rounded-md shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-red-800 hidden lg:block"
          >
            Logout
          </div>
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  LayoutDashboard,
  Factory,
  User,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-vue-next'
import SidebarLogo from './SidebarLogo.vue'
import { useAuthStore } from '@/stores/authStore'
import type { NavigationItem } from '@/types/navigation'

const props = defineProps<{
  isCollapsed: boolean
  isOpenMobile: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isCollapsed', value: boolean): void
  (e: 'update:isOpenMobile', value: boolean): void
  (e: 'closeMobile'): void
}>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const menuItems: NavigationItem[] = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    to: '/',
    icon: LayoutDashboard,
    exact: true
  },
  {
    name: 'producao',
    label: 'Produção',
    to: '/producao',
    icon: Factory
  },
  {
    name: 'perfil',
    label: 'Perfil',
    to: '/perfil',
    icon: User
  },
  {
    name: 'usuarios',
    label: 'Gerenciador de Usuários',
    to: '/usuarios',
    icon: Users
  }
]

function isItemActive(item: NavigationItem, isActive: boolean, isExactActive: boolean): boolean {
  if (item.exact || item.to === '/') {
    return route.path === '/' || route.path === '/dashboard'
  }
  return route.path.startsWith(item.to)
}

function handleNavClick() {
  emit('closeMobile')
}

const userName = computed(() => {
  return authStore.user?.nome || authStore.user?.name || authStore.credentials?.name || 'Administrador'
})

const userRole = computed(() => {
  const role = authStore.user?.role
  if (!role) return 'Administrador'
  return role === 'admin' ? 'Administrador' : role
})

const userInitials = computed(() => {
  const name = userName.value.trim()
  if (!name) return 'TT'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
})

function handleLogout() {
  emit('closeMobile')
  authStore.logout()
  router.push('/login')
}
</script>
