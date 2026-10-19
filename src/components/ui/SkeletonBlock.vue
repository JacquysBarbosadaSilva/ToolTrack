<template>
  <div
    class="bg-slate-200/80 animate-pulse"
    :class="[
      rounded || 'rounded-lg',
      width || 'w-full',
      height || 'h-4',
      blockClass || ''
    ]"
    aria-hidden="true"
  ></div>
</template>

<script setup lang="ts">
defineProps<{
  width?: string
  height?: string
  rounded?: string
  blockClass?: string
}>()
</script>
