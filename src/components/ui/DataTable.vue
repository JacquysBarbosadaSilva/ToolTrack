<template>
  <AppCard :no-padding="true">

    <template #header v-if="title || $slots.header || $slots.actions">
      <slot name="header">
        <div>
          <h2 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Box class="w-5 h-5 text-[#0B4FB3] shrink-0" />
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
    </template>

    <div class="overflow-x-auto">
      <table class="w-full table-auto border-collapse">

        <thead>
          <tr class="bg-slate-50/70 border-b border-slate-200">
            <th
              v-for="col in columns"
              :key="col.key"
              scope="col"
              class="py-4 px-4 sm:px-6 text-sm font-medium text-slate-600 tracking-normal whitespace-nowrap select-none"
              :class="[
                col.align === 'left' ? 'text-left' : col.align === 'right' ? 'text-right' : 'text-center',
                col.headerClass || ''
              ]"
              :style="col.width ? { width: col.width } : {}"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-200">

          <template v-if="loading">
            <tr v-for="n in skeletonRows" :key="`skeleton-${n}`" class="h-16">
              <td
                v-for="col in columns"
                :key="`sk-col-${col.key}`"
                class="px-4 py-4 text-center align-middle whitespace-nowrap"
              >
                <SkeletonBlock class="h-4 w-20 mx-auto rounded" />
              </td>
            </tr>
          </template>

          <tr v-else-if="error" class="h-32">
            <td :colspan="columns.length" class="text-center py-6 px-4">
              <ErrorState :message="error" @retry="$emit('retry')" />
            </td>
          </tr>

          <tr v-else-if="!items || items.length === 0" class="h-32">
            <td :colspan="columns.length" class="text-center py-6 px-4">
              <slot name="empty">
                <EmptyState title="Nenhum registro encontrado" />
              </slot>
            </td>
          </tr>

          <template v-else>
            <tr
              v-for="(item, index) in items"
              :key="item.id || item.PK || index"
              class="h-16 hover:bg-slate-50/60 transition-colors"
            >
              <td
                v-for="col in columns"
                :key="col.key"
                class="px-4 py-4 text-center align-middle whitespace-nowrap text-sm text-slate-800"
                :class="[
                  col.align === 'left' ? '!text-left' : col.align === 'right' ? '!text-right' : '!text-center',
                  col.cellClass || ''
                ]"
              >
                <slot
                  :name="`cell-${col.key}`"
                  :item="item"
                  :value="item[col.key]"
                  :index="index"
                >
                  {{ item[col.key] !== undefined && item[col.key] !== null ? item[col.key] : '-' }}
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <template #footer v-if="$slots.footer">
      <slot name="footer" />
    </template>
  </AppCard>
</template>

<script setup lang="ts">
import { Box } from 'lucide-vue-next'
import AppCard from './AppCard.vue'
import SkeletonBlock from './SkeletonBlock.vue'
import ErrorState from './ErrorState.vue'
import EmptyState from './EmptyState.vue'

export interface ColumnDefinition {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  width?: string
  headerClass?: string
  cellClass?: string
}

withDefaults(
  defineProps<{
    columns: ColumnDefinition[]
    items: Record<string, any>[]
    loading?: boolean
    error?: string | null
    title?: string
    subtitle?: string
    skeletonRows?: number
    emptyMessage?: string
  }>(),
  {
    loading: false,
    error: null,
    title: '',
    subtitle: '',
    skeletonRows: 5,
    emptyMessage: 'Nenhum item disponível no momento.'
  }
)

defineEmits<{
  (e: 'retry'): void
}>()
</script>
