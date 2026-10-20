<template>
  <div class="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">

    <h2 class="text-xl font-bold text-slate-900 mb-4 tracking-tight">
      {{ title }}
    </h2>

    <form @submit.prevent="$emit('filter')" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
      <slot />

      <div v-if="!hideSubmit" class="w-full">
        <button
          type="submit"
          :disabled="loading"
          class="w-full h-10 px-6 py-2 bg-[#0B4FB3] hover:bg-[#093F8F] active:bg-[#073275] text-white font-semibold text-sm rounded-md shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
        >
          <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span>{{ loading ? 'Filtrando...' : submitLabel }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    loading?: boolean
    submitLabel?: string
    hideSubmit?: boolean
  }>(),
  {
    title: 'Filtros do Relatório',
    loading: false,
    submitLabel: 'Filtrar',
    hideSubmit: false
  }
)

defineEmits<{
  (e: 'filter'): void
}>()
</script>
