'use client'

import { FC } from 'react'
import styles from './Dashboard.module.css'
import { useLanguage } from '@/hooks/useLanguage'

interface FinancialReport {
  sales: {
    today: number
    thisMonth: number
    lastMonth: number
    change: number
  }
  revenue: {
    total: number
    thisMonth: number
    pending: number
  }
  invoices: {
    paid: number
    pending: number
    overdue: number
  }
  recentTransactions: Array<{
    id: string
    description: string
    descriptionEn: string
    amount: number
    date: string
    status: 'paid' | 'pending' | 'failed'
  }>
}

const FinancialDashboard: FC = () => {
  const { t, language } = useLanguage()
  const isRTL = language === 'ar'

  // Mock data for demonstration
  const financial: FinancialReport = {
    sales: {
      today: 12450,
      thisMonth: 387600,
      lastMonth: 342100,
      change: 13.3
    },
    revenue: {
      total: 2847300,
      thisMonth: 387600,
      pending: 45200
    },
    invoices: {
      paid: 124,
      pending: 8,
      overdue: 2
    },
    recentTransactions: [
      {
        id: '1',
        description: 'دفعة من عميل شركة الرياض التقنية',
        descriptionEn: 'Payment from Riyadh Tech Client',
        amount: 25000,
        date: '2026-02-15T10:30:00Z',
        status: 'paid'
      },
      {
        id: '2', 
        description: 'مشروع تطوير موقع إلكتروني',
        descriptionEn: 'Website Development Project',
        amount: 8500,
        date: '2026-02-14T14:22:00Z', 
        status: 'pending'
      },
      {
        id: '3',
        description: 'خدمات الاستضافة الشهرية',
        descriptionEn: 'Monthly Hosting Services',
        amount: 1200,
        date: '2026-02-13T09:15:00Z',
        status: 'paid'
      },
      {
        id: '4',
        description: 'تطوير تطبيق جوال',
        descriptionEn: 'Mobile App Development',
        amount: 15000,
        date: '2026-02-12T16:45:00Z',
        status: 'failed'
      }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#00C781'
      case 'pending': return '#FF8C00'
      case 'failed': return '#FF4444'
      default: return '#666'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return t.financial.paid
      case 'pending': return t.financial.pending
      case 'failed': return t.financial.failed
      default: return status
    }
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle} style={{ textAlign: isRTL ? 'right' : 'start' }}>{t.financial.title}</h2>
      
      <div className={styles.financialGrid}>
        {/* Sales Overview */}
        <div className={styles.statCard}>
          <h4 style={{ textAlign: isRTL ? 'right' : 'start' }}>{t.financial.salesOverview}</h4>
          <div className={styles.statNumbers}>
            <div className={styles.statItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span>{t.financial.today}</span>
              <span>${financial.sales.today.toLocaleString()}</span>
            </div>
            <div className={styles.statItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span>{t.financial.thisMonth}</span>
              <span>${financial.sales.thisMonth.toLocaleString()}</span>
            </div>
            <div className={styles.statItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span>{t.financial.lastMonth}</span>
              <span>${financial.sales.lastMonth.toLocaleString()}</span>
            </div>
          </div>
          <div className={`${styles.changeIndicator} ${financial.sales.change >= 0 ? styles.positive : styles.negative}`}>
            {financial.sales.change >= 0 ? '↗' : '↘'} {Math.abs(financial.sales.change)}%
          </div>
        </div>

        {/* Revenue */}
        <div className={styles.statCard}>
          <h4 style={{ textAlign: isRTL ? 'right' : 'start' }}>{t.financial.revenue}</h4>
          <div className={styles.bigStat}>
            ${financial.revenue.total.toLocaleString()}
          </div>
          <div className={styles.statNumbers}>
            <div className={styles.statItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span>{t.financial.thisMonth}</span>
              <span>${financial.revenue.thisMonth.toLocaleString()}</span>
            </div>
            <div className={styles.statItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span>{t.financial.pending}</span>
              <span>${financial.revenue.pending.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Invoices */}
        <div className={styles.statCard}>
          <h4 style={{ textAlign: isRTL ? 'right' : 'start' }}>{t.financial.invoices}</h4>
          <div className={styles.statNumbers}>
            <div className={styles.statItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span>{t.financial.paid}</span>
              <span>{financial.invoices.paid}</span>
            </div>
            <div className={styles.statItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span>{t.financial.pending}</span>
              <span>{financial.invoices.pending}</span>
            </div>
            <div className={styles.statItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span>{t.financial.overdue}</span>
              <span>{financial.invoices.overdue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className={styles.transactionsSection}>
        <h3 style={{ textAlign: isRTL ? 'right' : 'start' }}>{t.financial.recentTransactions}</h3>
        <div className={styles.transactionsList}>
          {financial.recentTransactions.map((transaction) => (
            <div key={transaction.id} className={styles.transactionItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <div className={styles.transactionInfo} style={{ textAlign: isRTL ? 'right' : 'left' }}>
                <span className={styles.transactionDesc}>
                  {isRTL ? transaction.description : transaction.descriptionEn}
                </span>
                <span className={styles.transactionDate}>
                  {new Date(transaction.date).toLocaleDateString(language)}
                </span>
              </div>
              <div className={styles.transactionAmount}>
                ${transaction.amount.toLocaleString()}
              </div>
              <span 
                className={styles.transactionStatus}
                style={{ color: getStatusColor(transaction.status) }}
              >
                {getStatusText(transaction.status)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FinancialDashboard