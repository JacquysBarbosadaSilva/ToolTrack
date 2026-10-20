<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center gap-2 font-medium text-xs sm:text-sm rounded-md transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed select-none"
    :class="[
      variantClasses,
      sizeClasses,
      buttonClass
    ]"
    @click="$emit('click', $event)"
  >

    <Loader2
      v-if="loading"
      class="w-4 h-4 animate-spin shrink-0"
    />

    <component
      :is="icon"
      v-else-if="icon"
      class="w-4 h-4 shrink-0"
    />

    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { Loader2 } from 'lucide-vue-next'

export type ButtonVariant = 'primary' | 'outline-blue' | 'outline-green' | 'outline-gray'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    icon?: Component
    size?: 'sm' | 'md' | 'lg'
    buttonClass?: string
  }>(),
  {
    variant: 'primary',
    loading: false,
    disabled: false,
    type: 'button',
    size: 'md',
    buttonClass: ''
  }
)

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-xs'
    case 'lg':
      return 'px-6 py-2.5 text-sm'
    case 'md':
    default:
      return 'px-5 py-2 text-xs'
  }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'outline-blue':
      return 'bg-white border border-blue-200 text-[#0B4FB3] hover:bg-blue-50/70 shadow-xs'
    case 'outline-green':
      return 'bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50/70 shadow-xs'
    case 'outline-gray':
      return 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
    case 'primary':
    default:
      return 'bg-[#0B4FB3] hover:bg-[#093F8F] text-white shadow-xs font-semibold'
  }
})
</script>
