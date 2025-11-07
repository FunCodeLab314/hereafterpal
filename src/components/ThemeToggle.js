'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      className="p-2 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon size={20} className="text-light-textPrimary" />
      ) : (
        <Sun size={20} className="text-dark-textPrimary" />
      )}
    </button>
  )
}

