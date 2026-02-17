'use client'

import { LanguageProvider } from '@/hooks/useLanguage'
import DashboardLogin from '@/components/Dashboard/DashboardLogin'

function LoginContent() {
  return (
    <DashboardLogin 
      onLoginSuccess={() => {
        // Fallback - will be handled by navigateByRole in DashboardLogin
        window.location.href = '/dashboard'
      }}
      context="global"
    />
  )
}

export default function LoginPage() {
  return (
    <LanguageProvider>
      <LoginContent />
    </LanguageProvider>
  )
}
