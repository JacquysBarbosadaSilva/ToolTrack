import type { Component } from 'vue'

export interface NavigationItem {
  name: string
  label: string
  to: string
  icon: Component
  badge?: string | number
  exact?: boolean
}
