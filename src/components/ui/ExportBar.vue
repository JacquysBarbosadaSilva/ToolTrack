<template>
  <div class="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <h2 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
      {{ title }}
    </h2>

    <div class="flex flex-wrap items-center gap-3">

      <button
        type="button"
        @click="$emit('export-pdf')"
        :disabled="loadingPdf"
        class="px-6 py-2 rounded-lg border border-blue-500 text-blue-600 font-medium text-sm hover:bg-blue-50/50 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
      >
        Exportar PDF
      </button>

      <button
        type="button"
        @click="$emit('export-excel')"
        :disabled="loadingExcel"
        class="px-6 py-2 rounded-lg border border-emerald-500 text-emerald-600 font-medium text-sm hover:bg-emerald-50/50 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
      >
        Exportar Excel
      </button>

      <button
        type="button"
        @click="$emit('print')"
        :disabled="loadingPrint"
        class="px-6 py-2 rounded-lg border border-slate-400 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
      >
        Imprimir
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    loadingPdf?: boolean
    loadingExcel?: boolean
    loadingPrint?: boolean
  }>(),
  {
    title: 'Exportar Relatório',
    loadingPdf: false,
    loadingExcel: false,
    loadingPrint: false
  }
)

defineEmits<{
  (e: 'export-pdf'): void
  (e: 'export-excel'): void
  (e: 'print'): void
}>()
</script>
