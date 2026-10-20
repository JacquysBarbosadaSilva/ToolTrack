<template>
  <div class="flex items-center gap-2.5 select-none transition-all duration-300" :class="{ 'justify-center': collapsed }">

    <div
      class="relative flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
    >
      <img
        :src="logoImg"
        alt="ToolTrack Logo"
        class="w-14 h-14 object-contain translate-y-1 select-none pointer-events-none"
      />
    </div>

    <div v-if="!collapsed" class="flex flex-col min-w-0 transition-opacity duration-300">
      <div class="flex items-center gap-1.5">
        <span class="font-bold text-lg tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
          Tool<span class="text-blue-400">Track</span>
        </span>
      </div>
      <span class="text-[10px] font-medium uppercase tracking-wider text-slate-400">
        Gestão Inteligente
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import logoImg from '@/assets/logo-borda-branca.png'

defineProps<{
  collapsed?: boolean
}>()
</script>
