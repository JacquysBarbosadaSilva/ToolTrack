<template>
  <span
    class="inline-flex items-center justify-center px-4 py-1 rounded-full text-xs font-semibold text-slate-800 bg-white border border-slate-300/80 shadow-xs select-none min-w-[70px]"
  >
    <span>{{ shift }}</span>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  shift: string
}>()
</script>
