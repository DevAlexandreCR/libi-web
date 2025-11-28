import { defineStore } from 'pinia'

type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'libi-theme'

const getInitialMode = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const applyMode = (mode: ThemeMode) => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement
    root.classList.toggle('dark', mode === 'dark')
    root.style.setProperty('color-scheme', mode)
  }
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    mode: getInitialMode()
  }),
  actions: {
    setMode(mode: ThemeMode) {
      this.mode = mode
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, mode)
      }
      applyMode(mode)
    },
    toggle() {
      this.setMode(this.mode === 'dark' ? 'light' : 'dark')
    },
    init() {
      applyMode(this.mode)
    }
  }
})
