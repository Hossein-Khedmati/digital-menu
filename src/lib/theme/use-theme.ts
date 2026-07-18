'use client'

import { useEffect, useState } from 'react'

type Theme    = 'light' | 'dark' | 'system'
type Resolved = 'light' | 'dark'

function getResolved(theme: Theme): Resolved {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light'
  }
  return theme
}

function applyTheme(resolved: Resolved) {
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system')

  // ── hydration sync ──
  useEffect(() => {
    const stored = (localStorage.getItem('theme') ?? 'system') as Theme
    setThemeState(stored)
    applyTheme(getResolved(stored))

    // گوش دادن به system preference
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if ((localStorage.getItem('theme') ?? 'system') === 'system') {
        applyTheme(media.matches ? 'dark' : 'light')
      }
    }
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme)
    setThemeState(newTheme)
    applyTheme(getResolved(newTheme))
  }

  return { theme, setTheme }
}