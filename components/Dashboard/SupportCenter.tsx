'use client'

import { FC, useState } from 'react'
import styles from './Dashboard.module.css'
import { useLanguage } from '@/hooks/useLanguage'

interface SupportTicket {
  id: string
  title: string
  titleEn: string
  status: 'open' | 'in-progress' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  created: string
  updated: string
}

interface SupportData {
  tickets: SupportTicket[]
  unreadMessages: number
  nextMeeting?: {
    date: string
    time: string
    topic: string
    topicEn: string
  }
}

const SupportCenter: FC = () => {
  const { t, language } = useLanguage()
  const isRTL = language === 'ar'
  
  // Mock data for demonstration
  const support: SupportData = {
    tickets: [
      {
        id: '1',
        title: 'مشكلة في عرض البيانات على الداشبورد',
        titleEn: 'Issue with dashboard data display',
        status: 'in-progress',
        priority: 'high',
        created: '2026-02-14T10:00:00Z',
        updated: '2026-02-15T14:30:00Z'
      },
      {
        id: '2',
        title: 'طلب إضافة ميزة جديدة للتقارير',
        titleEn: 'Feature request for reports',
        status: 'open',
        priority: 'medium',
        created: '2026-02-13T09:15:00Z',
        updated: '2026-02-13T09:15:00Z'
      },
      {
        id: '3',
        title: 'استفسار حول طريقة استخدام النظام',
        titleEn: 'Question about system usage',
        status: 'closed',
        priority: 'low',
        created: '2026-02-10T16:20:00Z',
        updated: '2026-02-12T11:45:00Z'
      }
    ],
    unreadMessages: 3,
    nextMeeting: {
      date: '2026-02-20T10:00:00Z',
      time: '10:00 AM',
      topic: 'مراجعة تقدم المشروع ومناقشة التحديثات الجديدة',
      topicEn: 'Project progress review and updates discussion'
    }
  }
  
  const [newTicketTitle, setNewTicketTitle] = useState('')
  const [newTicketMessage, setNewTicketMessage] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTicketTitle.trim() || !newTicketMessage.trim()) return

    setSubmitLoading(true)
    // Simulate API call
    setTimeout(() => {
      setNewTicketTitle('')
      setNewTicketMessage('')
      setSubmitLoading(false)
      alert(isRTL ? 'تم إنشاء التذكرة بنجاح! (Demo Mode)' : 'Ticket created successfully! (Demo Mode)')
    }, 1000)
  }

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open': return '#FF8C00'
      case 'in-progress': return '#0070F3'
      case 'closed': return '#00C781'
      default: return '#666'
    }
  }

  const getStatusText = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open': return t.support.status.open
      case 'in-progress': return t.support.status['in-progress']
      case 'closed': return t.support.status.closed
      default: return status
    }
  }

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'low': return '#00C781'
      case 'medium': return '#0070F3'
      case 'high': return '#FF8C00'
      case 'urgent': return '#FF4444'
      default: return '#666'
    }
  }

  const getPriorityText = (priority: SupportTicket['priority']) => {
    return t.support.priorities[priority] || priority
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle} style={{ textAlign: isRTL ? 'right' : 'start' }}>{t.support.title}</h2>
      
      <div className={styles.supportGrid}>
        {/* Support Overview */}
        <div className={styles.statCard}>
          <h4 style={{ textAlign: isRTL ? 'right' : 'start' }}>{t.support.overview}</h4>
          <div className={styles.statNumbers}>
            <div className={styles.statItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span>{t.support.openTickets}</span>
              <span>{support.tickets.filter(t => t.status === 'open').length}</span>
            </div>
            <div className={styles.statItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span>{t.support.processing}</span>
              <span>{support.tickets.filter(t => t.status === 'in-progress').length}</span>
            </div>
            <div className={styles.statItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span>{t.support.unread}</span>
              <span>{support.unreadMessages}</span>
            </div>
          </div>
        </div>

        {/* Next Meeting */}
        {support.nextMeeting && (
          <div className={styles.statCard}>
            <h4 style={{ textAlign: isRTL ? 'right' : 'start' }}>{t.support.nextMeeting}</h4>
            <div className={styles.meetingInfo}>
              <div className={styles.meetingDate}>
                {new Date(support.nextMeeting.date).toLocaleDateString(language)}
              </div>
              <div className={styles.meetingTime}>{support.nextMeeting.time}</div>
              <div className={styles.meetingTopic} style={{ textAlign: isRTL ? 'right' : 'left' }}>
                {isRTL ? support.nextMeeting.topic : support.nextMeeting.topicEn}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create New Ticket */}
      <div className={styles.createTicketSection}>
        <h3 style={{ textAlign: isRTL ? 'right' : 'start' }}>{t.support.createNew}</h3>
        <form onSubmit={handleCreateTicket} className={styles.ticketForm}>
          <div className={styles.formGroup}>
            <label htmlFor="ticketTitle" style={{ textAlign: isRTL ? 'right' : 'left' }}>
              {t.support.ticketTitle}
            </label>
            <input
              type="text"
              id="ticketTitle"
              value={newTicketTitle}
              onChange={(e) => setNewTicketTitle(e.target.value)}
              placeholder={t.support.placeholders.subject}
              required
              style={{ textAlign: isRTL ? 'right' : 'left' }}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="ticketMessage" style={{ textAlign: isRTL ? 'right' : 'left' }}>
              {t.support.ticketDesc}
            </label>
            <textarea
              id="ticketMessage"
              value={newTicketMessage}
              onChange={(e) => setNewTicketMessage(e.target.value)}
              placeholder={t.support.placeholders.description}
              rows={4}
              required
              style={{ textAlign: isRTL ? 'right' : 'left' }}
            />
          </div>
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={submitLoading}
          >
            {submitLoading ? t.support.sending : t.support.submit}
          </button>
        </form>
      </div>

      {/* Support Tickets */}
      <div className={styles.ticketsSection}>
        <h3 style={{ textAlign: isRTL ? 'right' : 'start' }}>{t.support.tickets}</h3>
        <div className={styles.ticketsList}>
          {support.tickets.map((ticket) => (
            <div key={ticket.id} className={styles.ticketItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <div className={styles.ticketHeader} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <h4 style={{ textAlign: isRTL ? 'right' : 'left' }}>
                  {isRTL ? ticket.title : ticket.titleEn}
                </h4>
                <div className={styles.ticketMeta} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <span 
                    className={styles.ticketStatus}
                    style={{ backgroundColor: getStatusColor(ticket.status) }}
                  >
                    {getStatusText(ticket.status)}
                  </span>
                  <span 
                    className={styles.ticketPriority}
                    style={{ color: getPriorityColor(ticket.priority) }}
                  >
                    {getPriorityText(ticket.priority)}
                  </span>
                </div>
              </div>
              <div className={styles.ticketDates} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <span>{t.support.created}: {new Date(ticket.created).toLocaleDateString(language)}</span>
                <span>{t.support.updated}: {new Date(ticket.updated).toLocaleDateString(language)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SupportCenter