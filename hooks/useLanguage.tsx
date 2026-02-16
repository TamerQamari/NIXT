'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { translations } from './translations'

type Language = 'ar' | 'en'
type TranslationsType = typeof translations.ar

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationsType
  dir: 'rtl' | 'ltr'
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('ar')

  useEffect(() => {
    // Load saved language
    const saved = localStorage.getItem('nixt-lang') as Language
    if (saved && (saved === 'ar' || saved === 'en')) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('nixt-lang', lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }

  const value = {
    language,
    setLanguage,
    t: translations[language],
    dir: language === 'ar' ? 'rtl' : 'ltr'
  }

  return (
    <LanguageContext.Provider value={value as any}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
