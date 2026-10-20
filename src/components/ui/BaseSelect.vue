<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="inputId"
      class="block text-xs font-medium text-slate-700 mb-1.5"
    >
      {{ label }}
    </label>

    <div class="relative">
      <select
        :id="inputId"
        :value="modelValue"
        :disabled="disabled"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        class="w-full px-4 py-2 pr-9 text-xs font-normal text-slate-800 bg-white border border-slate-300 rounded-full focus:bg-white focus:border-[#0B4FB3] focus:ring-2 focus:ring-[#0B4FB3]/20 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed appearance-none cursor-pointer shadow-xs"
        :class="selectClass"
      >
        <option v-if="placeholder" value="">
          {{ placeholder }}
        </option>
        <option
          v-for="opt in normalizedOptions"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>

      <div class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface SelectOption {
  value: string | number
  label: string
}

const props = withDefaults(
  defineProps<{
    modelValue: string | number
    options: (string | SelectOption)[]
    label?: string
    id?: string
    placeholder?: string
    disabled?: boolean
    selectClass?: string
  }>(),
  {
    label: '',
    id: '',
    placeholder: '',
    disabled: false,
    selectClass: ''
  }
)

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const inputId = computed(() => props.id || (props.label ? `select-${props.label.toLowerCase().replace(/\s+/g, '-')}` : undefined))

const normalizedOptions = computed<SelectOption[]>(() => {
  return props.options.map(opt => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { value: opt, label: String(opt) }
    }
    return opt
  })
})
</script>
