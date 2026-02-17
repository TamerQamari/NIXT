'use client'

import { useState } from 'react'
import ProjectOverview from '@/components/Dashboard/ProjectOverview'
import AnalyticsDashboard from '@/components/Dashboard/AnalyticsDashboard'
import FinancialDashboard from '@/components/Dashboard/FinancialDashboard'
import SupportCenter from '@/components/Dashboard/SupportCenter'
import DashboardSettings from '@/components/Dashboard/DashboardSettings'
import DashboardLogin from '@/components/Dashboard/DashboardLogin'
import styles from '@/components/Dashboard/Dashboard.module.css'
import ThemeSwitcher from '@/components/UI/ThemeSwitcher'
import { useTheme } from '@/hooks/useTheme'
import { LanguageProvider, useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'

interface DashboardSection {
  id: string
  name: string
  component: React.ComponentType<any>
  enabled: boolean
}

interface DashboardSettingsType {
  refreshInterval: number
  enableNotifications: boolean
  defaultView: 'grid' | 'list'
  enabledSections: string[]
  currency: 'USD' | 'EUR' | 'SAR'
  timezone: string
}

function DashboardContent() {
  // Use translations hook
  const { t, language, setLanguage, dir } = useLanguage()
  const { dashboardSession, isLoggedIn, logoutFromDashboard } = useAuth()
  
  const [showSettings, setShowSettings] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  const { nextTheme, setTheme, currentTheme } = useTheme()

  const [dashboardSettings, setDashboardSettings] = useState<DashboardSettingsType>({
    refreshInterval: 30000,
    enableNotifications: true,
    defaultView: 'grid',
    enabledSections: ['project', 'analytics', 'financial', 'support'],
    currency: 'USD',
    timezone: 'UTC'
  })

  const sectionsList = [
    { id: 'project', component: ProjectOverview, nameKey: 'project' },
    { id: 'analytics', component: AnalyticsDashboard, nameKey: 'analytics' },
    { id: 'financial', component: FinancialDashboard, nameKey: 'financial' },
    { id: 'support', component: SupportCenter, nameKey: 'support' },
  ]

  const [enabledSectionIds, setEnabledSectionIds] = useState<string[]>(
    ['project', 'analytics', 'financial', 'support']
  )

  // All hooks are above — now we can do conditional returns

  // Check if user is logged in
  const userIsLoggedIn = isLoggedIn && dashboardSession

  // If not logged in, show login page
  if (!userIsLoggedIn && !isAuthenticated) {
    return <DashboardLogin onLoginSuccess={() => setIsAuthenticated(true)} />
  }

  // Filter sections based on user permissions
  const userAllowedSections = dashboardSession?.dashboardSections || []
  const availableSections = sectionsList.filter(
    s => userAllowedSections.length === 0 || userAllowedSections.includes(s.id)
  )

  const toggleSection = (sectionId: string) => {
    setEnabledSectionIds(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleSettingsUpdate = (newSettings: DashboardSettingsType) => {
    setDashboardSettings(newSettings)
    setEnabledSectionIds(newSettings.enabledSections)
  }

  if (showSettings) {
    return (
      <div className={styles.dashboard} style={{ direction: dir }}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.dashboardTitle}>{t.settings.title}</h1>
          <button
            className={styles.toggleBtn}
            onClick={() => setShowSettings(false)}
          >
            {language === 'ar' ? 'العودة للداشبورد' : 'Back to Dashboard'}
          </button>
        </div>

        <DashboardSettings 
          settings={dashboardSettings}
          onSettingsUpdate={handleSettingsUpdate}
        />
      </div>
    )
  }

  return (
    <div className={styles.dashboard} style={{ direction: dir }}>
      <div className={styles.dashboardHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h1 className={styles.dashboardTitle}>{t.dashboard.title}</h1>
          {/* Language Switcher */}
          <button 
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className={styles.toggleBtn}
            style={{ fontSize: '0.9rem', padding: '6px 12px' }}
          >
            {language === 'ar' ? 'English' : 'عربي'}
          </button>
        </div>
        
        <div className={styles.headerControls}>
          {/* User Info */}
          {dashboardSession && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              padding: '6px 14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              fontSize: '0.85rem',
              color: 'var(--text-dim)'
            }}>
              <span style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: '#00C781',
                display: 'inline-block'
              }} />
              <span>{dashboardSession.name}</span>
              <span style={{ opacity: 0.5 }}>|</span>
              <span style={{ color: '#7042f8', fontWeight: 600 }}>{dashboardSession.role}</span>
            </div>
          )}

          <div className={styles.sectionsToggle}>
            {availableSections.map((section) => (
              <button
                key={section.id}
                className={`${styles.toggleBtn} ${enabledSectionIds.includes(section.id) ? styles.active : ''}`}
                onClick={() => toggleSection(section.id)}
              >
                {t.sections[section.nameKey as keyof typeof t.sections]}
              </button>
            ))}
          </div>
          
          <button
            className={styles.settingsBtn}
            onClick={() => setShowSettings(true)}
          >
            ⚙️ {t.dashboard.settings}
          </button>

          {/* Logout Button */}
          <button
            className={styles.settingsBtn}
            onClick={() => {
              logoutFromDashboard()
              setIsAuthenticated(false)
            }}
            style={{ 
              background: 'rgba(255, 68, 68, 0.1)', 
              borderColor: 'rgba(255, 68, 68, 0.2)',
              color: '#ff6b6b'
            }}
          >
            {t.login.logout}
          </button>
        </div>
      </div>

      <div className={styles.dashboardContent}>
        {availableSections.map((section) => {
          if (!enabledSectionIds.includes(section.id)) return null
          
          const Component = section.component
          return <Component key={section.id} />
        })}
      </div>

      {/* Demo Mode Indicator */}
      <div className={styles.apiStatus} style={language === 'ar' ? { left: '20px', right: 'auto' } : { right: '20px', left: 'auto' }}>
        <div className={styles.statusIndicator}>
          <span className={styles.statusDot}></span>
          {t.dashboard.demoMode}
        </div>
      </div>

      <ThemeSwitcher 
        onThemeChange={nextTheme} 
        onSetTheme={setTheme} 
        currentTheme={currentTheme}
      />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <LanguageProvider>
      <DashboardContent />
    </LanguageProvider>
  )
}
