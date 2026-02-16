'use client'

import { FC } from 'react'
import styles from './Dashboard.module.css'
import { useLanguage } from '@/hooks/useLanguage'

interface Analytics {
  visitors: {
    today: number
    thisWeek: number
    thisMonth: number
    change: number
  }
  performance: {
    loadTime: number
    responseTime: number
    uptime: number
  }
  conversions: {
    rate: number
    total: number
    revenue: number
  }
  activeUsers: number
}

const AnalyticsDashboard: FC = () => {
  const { t, language } = useLanguage()
  const isRTL = language === 'ar'

  // Mock data for demonstration
  const analytics: Analytics = {
    visitors: {
      today: 2847,
      thisWeek: 18392,
      thisMonth: 75634,
      change: 12.5
    },
    performance: {
      loadTime: 1.2,
      responseTime: 85,
      uptime: 99.9
    },
    conversions: {
      rate: 3.4,
      total: 1284,
      revenue: 45780
    },
    activeUsers: 847
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle} style={{ textAlign: isRTL ? 'right' : 'left' }}>{t.analytics.title}</h2>
      
      <div className={styles.statsGrid}>
        {/* System Status - New Section for Enterprise */}
        <div className={styles.statCard} style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            <h4 style={{ margin: 0 }}>{t.analytics.systemStatus}</h4>
            <span style={{ 
              background: '#00C781', 
              color: 'white', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              fontSize: '0.8rem',
              fontWeight: 600 
            }}>
              {t.analytics.allSystemsOperational}
            </span>
          </div>
          
          <div className={styles.statNumbers} style={{ flexDirection: 'row', gap: '40px', justifyContent: 'space-around' }}>
            <div className={styles.statItem} style={{ flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '0.9rem' }}>{t.analytics.apiUptime}</span>
              <span style={{ fontSize: '1.2rem', color: '#00C781' }}>99.99%</span>
            </div>
            <div className={styles.statItem} style={{ flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '0.9rem' }}>{t.analytics.dbLoad}</span>
              <span style={{ fontSize: '1.2rem', color: '#0070F3' }}>24%</span>
            </div>
            <div className={styles.statItem} style={{ flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '0.9rem' }}>{t.analytics.storage}</span>
              <span style={{ fontSize: '1.2rem', color: '#FF8C00' }}>45%</span>
            </div>
            <div className={styles.statItem} style={{ flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '0.9rem' }}>{t.analytics.activeSessions}</span>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-white)' }}>2,842</span>
            </div>
          </div>
        </div>

        {/* Visitors */}
        <div className={styles.statCard}>
          <h4 style={{ textAlign: isRTL ? 'right' : 'left' }}>{t.analytics.visitors}</h4>
          <div className={styles.statNumbers}>
            <div className={styles.statItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span>{t.analytics.today}</span>
              <span>{analytics.visitors.today.toLocaleString()}</span>
            </div>
            <div className={styles.statItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span>{t.analytics.thisWeek}</span>
              <span>{analytics.visitors.thisWeek.toLocaleString()}</span>
            </div>
            <div className={styles.statItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span>{t.analytics.thisMonth}</span>
              <span>{analytics.visitors.thisMonth.toLocaleString()}</span>
            </div>
          </div>
          <div className={`${styles.changeIndicator} ${analytics.visitors.change >= 0 ? styles.positive : styles.negative}`}>
            {analytics.visitors.change >= 0 ? '↗' : '↘'} {Math.abs(analytics.visitors.change)}%
          </div>
        </div>

        {/* Performance */}
        <div className={styles.statCard}>
          <h4 style={{ textAlign: isRTL ? 'right' : 'left' }}>{t.analytics.performance}</h4>
          <div className={styles.statNumbers}>
            <div className={styles.statItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span>{t.analytics.loadTime}</span>
              <span>{analytics.performance.loadTime}ms</span>
            </div>
            <div className={styles.statItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span>{t.analytics.responseTime}</span>
              <span>{analytics.performance.responseTime}ms</span>
            </div>
            <div className={styles.statItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span>{t.analytics.uptime}</span>
              <span>{analytics.performance.uptime}%</span>
            </div>
          </div>
        </div>

        {/* Conversions */}
        <div className={styles.statCard}>
          <h4 style={{ textAlign: isRTL ? 'right' : 'left' }}>{t.analytics.conversions}</h4>
          <div className={styles.statNumbers}>
            <div className={styles.statItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span>{t.analytics.rate}</span>
              <span>{analytics.conversions.rate}%</span>
            </div>
            <div className={styles.statItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span>{t.analytics.total}</span>
              <span>{analytics.conversions.total}</span>
            </div>
            <div className={styles.statItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span>{t.analytics.revenue}</span>
              <span>${analytics.conversions.revenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className={styles.statCard}>
          <h4 style={{ textAlign: isRTL ? 'right' : 'left' }}>{t.analytics.activeUsers}</h4>
          <div className={styles.bigStat}>
            {analytics.activeUsers.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard