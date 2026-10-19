import { ref } from 'vue'

export interface ToastItem {
  id: string
  message: string
  type: 'info' | 'error' | 'success' | 'warning'
}

export const activeToasts = ref<ToastItem[]>([])

export function showToast(
  message: string,
  type: 'info' | 'error' | 'success' | 'warning' = 'info',
  duration = 5000
) {
  const id = Math.random().toString(36).substring(2)
  activeToasts.value.push({ id, message, type })

  setTimeout(() => {
    removeToast(id)
  }, duration)
}

export function removeToast(id: string) {
  activeToasts.value = activeToasts.value.filter((t) => t.id !== id)
}
