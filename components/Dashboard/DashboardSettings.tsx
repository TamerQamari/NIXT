'use client'

import { FC, useState } from 'react'
import styles from './Dashboard.module.css'
import { useLanguage } from '@/hooks/useLanguage'

interface DashboardSettings {
  refreshInterval: number
  enableNotifications: boolean
  defaultView: 'grid' | 'list'
  enabledSections: string[]
  currency: 'USD' | 'EUR' | 'SAR'
  timezone: string
}

interface SettingsProps {
  settings: DashboardSettings
  onSettingsUpdate: (newSettings: DashboardSettings) => void
}

const DashboardSettings: FC<SettingsProps> = ({ settings, onSettingsUpdate }) => {
  const { t, language } = useLanguage()
  const isRTL = language === 'ar'
  
  const [localSettings, setLocalSettings] = useState<DashboardSettings>(settings)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    setTimeout(() => {
      onSettingsUpdate(localSettings)
      setSaving(false)
      alert(isRTL ? 'تم حفظ الإعدادات بنجاح! (Demo Mode)' : 'Settings saved successfully! (Demo Mode)')
    }, 800)
  }

  const handleInputChange = (key: keyof DashboardSettings, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const getSectionName = (id: string) => {
    switch (id) {
      case 'project': return t.sections.project
      case 'analytics': return t.sections.analytics
      case 'financial': return t.sections.financial
      case 'support': return t.sections.support
      case 'content': return t.settings.content
      case 'security': return t.settings.security
      default: return id
    }
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle} style={{ textAlign: isRTL ? 'right' : 'start' }}>{t.settings.title}</h2>
      
      <div className={styles.settingsGrid}>
        {/* General Settings */}
        <div className={styles.settingsCard}>
          <h4 style={{ textAlign: isRTL ? 'right' : 'start' }}>{t.settings.general}</h4>
          
          <div className={styles.settingItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            <label style={{ textAlign: isRTL ? 'right' : 'left' }}>{t.settings.refreshPeriod}</label>
            <input
              type="number"
              value={localSettings.refreshInterval / 1000}
              onChange={(e) => handleInputChange('refreshInterval', parseInt(e.target.value) * 1000)}
              min="10"
              max="300"
              style={{ direction: 'ltr' }}
            />
          </div>

          <div className={styles.settingItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            <label style={{ textAlign: isRTL ? 'right' : 'left' }}>{t.settings.currency}</label>
            <select
              value={localSettings.currency}
              onChange={(e) => handleInputChange('currency', e.target.value as 'USD' | 'EUR' | 'SAR')}
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            >
              <option value="USD">{isRTL ? 'دولار أمريكي (USD)' : 'US Dollar (USD)'}</option>
              <option value="EUR">{isRTL ? 'يورو (EUR)' : 'Euro (EUR)'}</option>
              <option value="SAR">{isRTL ? 'ريال سعودي (SAR)' : 'Saudi Riyal (SAR)'}</option>
            </select>
          </div>

          <div className={styles.settingItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            <label style={{ textAlign: isRTL ? 'right' : 'left' }}>{t.settings.timezone}</label>
            <select
              value={localSettings.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            >
              <option value="UTC">UTC</option>
              <option value="Asia/Riyadh">{isRTL ? 'الرياض' : 'Riyadh'}</option>
              <option value="Europe/London">{isRTL ? 'لندن' : 'London'}</option>
              <option value="America/New_York">{isRTL ? 'نيويورك' : 'New York'}</option>
            </select>
          </div>
        </div>

        {/* Display Settings */}
        <div className={styles.settingsCard}>
          <h4 style={{ textAlign: isRTL ? 'right' : 'start' }}>{t.settings.display}</h4>
          
          <div className={styles.settingItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            <label style={{ textAlign: isRTL ? 'right' : 'left' }}>{t.settings.defaultView}</label>
            <div className={styles.radioGroup} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <label style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <input
                  type="radio"
                  value="grid"
                  checked={localSettings.defaultView === 'grid'}
                  onChange={(e) => handleInputChange('defaultView', e.target.value)}
                  style={{ marginLeft: isRTL ? '8px' : '0', marginRight: isRTL ? '0' : '8px' }}
                />
                {t.settings.grid}
              </label>
              <label style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <input
                  type="radio"
                  value="list"
                  checked={localSettings.defaultView === 'list'}
                  onChange={(e) => handleInputChange('defaultView', e.target.value)}
                  style={{ marginLeft: isRTL ? '8px' : '0', marginRight: isRTL ? '0' : '8px' }}
                />
                {t.settings.list}
              </label>
            </div>
          </div>

          <div className={styles.settingItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            <label style={{ textAlign: isRTL ? 'right' : 'left' }}>{t.settings.enableNotifications}</label>
            <input
              type="checkbox"
              checked={localSettings.enableNotifications}
              onChange={(e) => handleInputChange('enableNotifications', e.target.checked)}
              className={styles.checkbox}
            />
          </div>
        </div>

        {/* Sections Settings */}
        <div className={styles.settingsCard}>
          <h4 style={{ textAlign: isRTL ? 'right' : 'start' }}>{t.settings.enabledSections}</h4>
          
          <div className={styles.sectionsCheckboxes} style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
            {['project', 'analytics', 'financial', 'support', 'content', 'security'].map((sectionId) => (
              <label key={sectionId} className={styles.checkboxLabel} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <input
                  type="checkbox"
                  checked={localSettings.enabledSections.includes(sectionId)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleInputChange('enabledSections', [...localSettings.enabledSections, sectionId])
                    } else {
                      handleInputChange('enabledSections', localSettings.enabledSections.filter(id => id !== sectionId))
                    }
                  }}
                  className={styles.checkbox}
                  style={{ marginLeft: isRTL ? '10px' : '0', marginRight: isRTL ? '0' : '10px' }}
                />
                {getSectionName(sectionId)}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.settingsActions} style={{ justifyContent: isRTL ? 'flex-end' : 'flex-end' }}>
        <button 
          onClick={handleSave}
          disabled={saving}
          className={styles.saveBtn}
        >
          {saving ? t.settings.saving : t.settings.save}
        </button>
      </div>
    </div>
  )
}

export default DashboardSettings