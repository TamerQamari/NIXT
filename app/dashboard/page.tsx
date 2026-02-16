'use client'

import { useState } from 'react'
import ProjectOverview from '@/components/Dashboard/ProjectOverview'
import AnalyticsDashboard from '@/components/Dashboard/AnalyticsDashboard'
import FinancialDashboard from '@/components/Dashboard/FinancialDashboard'
import SupportCenter from '@/components/Dashboard/SupportCenter'
import DashboardSettings from '@/components/Dashboard/DashboardSettings'
import styles from '@/components/Dashboard/Dashboard.module.css'
import ThemeSwitcher from '@/components/UI/ThemeSwitcher'
import { useTheme } from '@/hooks/useTheme'
import { LanguageProvider, useLanguage } from '@/hooks/useLanguage'

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
  
  const [showSettings, setShowSettings] = useState(false)
  
  const { nextTheme, setTheme, currentTheme } = useTheme()

  const [dashboardSettings, setDashboardSettings] = useState<DashboardSettingsType>({
    refreshInterval: 30000,
    enableNotifications: true,
    defaultView: 'grid',
    enabledSections: ['project', 'analytics', 'financial', 'support'],
    currency: 'USD',
    timezone: 'UTC'
  })

  // We need to keep sections state in sync with translations if names are dynamic
  // But component references can't easily change. Let's just render the name dynamically in the JSX.
  const sectionsList = [
    { id: 'project', component: ProjectOverview, nameKey: 'project' },
    { id: 'analytics', component: AnalyticsDashboard, nameKey: 'analytics' },
    { id: 'financial', component: FinancialDashboard, nameKey: 'financial' },
    { id: 'support', component: SupportCenter, nameKey: 'support' },
  ]

  const [enabledSectionIds, setEnabledSectionIds] = useState<string[]>(
    ['project', 'analytics', 'financial', 'support']
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
          <div className={styles.sectionsToggle}>
            {sectionsList.map((section) => (
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
        </div>
      </div>

      <div className={styles.dashboardContent}>
        {sectionsList.map((section) => {
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
