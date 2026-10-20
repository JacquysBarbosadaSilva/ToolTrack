<template>
  <div
    class="bg-white border border-slate-200 rounded-xl shadow-xs transition-all"
    :class="[
      cardClass
    ]"
  >

    <header
      v-if="$slots.header || title"
      class="px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <slot name="header">
        <div>
          <h2 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <slot name="icon" />
            <span>{{ title }}</span>
          </h2>
          <p v-if="subtitle" class="text-xs text-slate-500 mt-0.5">
            {{ subtitle }}
          </p>
        </div>
        <div v-if="$slots.actions" class="flex items-center gap-2 shrink-0">
          <slot name="actions" />
        </div>
      </slot>
    </header>

    <div :class="noPadding ? '' : (paddingClass || 'p-5 sm:p-6')">
      <slot />
    </div>

    <footer
      v-if="$slots.footer"
      class="px-5 sm:px-6 py-3 border-t border-slate-100 bg-slate-50/50 rounded-b-xl"
    >
      <slot name="footer" />
    </footer>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    noPadding?: boolean
    paddingClass?: string
    cardClass?: string
  }>(),
  {
    title: '',
    subtitle: '',
    noPadding: false,
    paddingClass: 'p-5 sm:p-6',
    cardClass: ''
  }
)
</script>
