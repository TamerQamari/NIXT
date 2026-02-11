'use client'

import { useState, useEffect } from 'react'

interface ThemeConfig {
  background: string
  textMain: string
  textDim: string
}

const themeConfigs: ThemeConfig[] = [
  // 0: Default Blue-Black
  {
    background: 'radial-gradient(circle at bottom center, #001a4d 0%, #000000 85%)',
    textMain: '#ffffff',
    textDim: 'rgba(255, 255, 255, 0.6)'
  },
  // 1: Purple-Black
  {
    background: 'radial-gradient(circle at bottom center, #2d004d 0%, #000000 85%)',
    textMain: '#ffffff',
    textDim: 'rgba(255, 255, 255, 0.6)'
  },
  // 2: Green-Black
  {
    background: 'radial-gradient(circle at bottom center, #004d33 0%, #000000 85%)',
    textMain: '#ffffff',
    textDim: 'rgba(255, 255, 255, 0.6)'
  },
  // 3: Dark Grey-Black
  {
    background: 'linear-gradient(to bottom, #1a1a1a, #000000)',
    textMain: '#ffffff',
    textDim: 'rgba(255, 255, 255, 0.6)'
  },
  // 4: Blue-White
  {
    background: 'radial-gradient(circle at bottom center, #001a4d 0%, #ffffff 85%)',
    textMain: '#000000',
    textDim: 'rgba(0, 0, 0, 0.6)'
  }
]

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState(0)

  const applyTheme = (index: number) => {
    if (typeof document === 'undefined') return
    
    const theme = themeConfigs[index]
    
    document.body.style.background = theme.background
    document.body.style.backgroundAttachment = 'fixed'
    
    document.documentElement.style.setProperty('--text-white', theme.textMain)
    document.documentElement.style.setProperty('--text-dim', theme.textDim)
  }

  const nextTheme = () => {
    const newTheme = (currentTheme + 1) % themeConfigs.length
    setCurrentTheme(newTheme)
    applyTheme(newTheme)
  }

  useEffect(() => {
    applyTheme(currentTheme)
  }, [currentTheme])

  return {
    currentTheme,
    nextTheme,
    themes: themeConfigs.map(t => t.background)
  }
}
