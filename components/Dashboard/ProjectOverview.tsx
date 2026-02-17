'use client'

import { FC } from 'react'
import styles from './Dashboard.module.css'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'

interface Project {
  id: string
  name: string
  client: string
  clientEmail: string
  status: 'active' | 'completed' | 'pending' | 'on-hold'
  progress: number
  budget: number
  spent: number
  deadline: string
  priority?: string
  team?: number
}

interface Milestone {
  key: string
  threshold: number
  isCompleted: boolean
}

const ProjectOverview: FC = () => {
  const { t, language } = useLanguage()
  const { sharedData, dashboardSession } = useAuth()
  const isRTL = language === 'ar'

  // Get projects from shared data, filtered by client email
  const clientEmail = dashboardSession?.email || ''
  const clientRole = dashboardSession?.role || ''
  
  const allProjects: Project[] = (sharedData.projects || []) as Project[]
  
  // If user is a client, show only their projects. If manager, show all.
  const clientProjects = clientRole === 'manager' 
    ? allProjects 
    : allProjects.filter(p => p.clientEmail?.toLowerCase() === clientEmail.toLowerCase())

  // Fallback mock data if no shared projects found
  const fallbackProject: Project = {
    id: '1',
    name: 'منصة التجارة الإلكترونية - NIXT Store',
    client: '',
    clientEmail: '',
    status: 'active',
    progress: 75,
    budget: 150000,
    spent: 112500,
    deadline: '2026-04-15T00:00:00Z'
  }

  const projectsToShow = clientProjects.length > 0 ? clientProjects : [fallbackProject]

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed': return '#00C781'
      case 'active': return '#0070F3'
      case 'pending': return '#FF8C00'
      case 'on-hold': return '#666'
      default: return '#666'
    }
  }

  const getStatusText = (status: Project['status']) => {
    const statusMap: Record<string, string> = {
      active: isRTL ? 'قيد التطوير' : 'In Development',
      completed: isRTL ? 'مكتمل' : 'Completed',
      pending: isRTL ? 'قيد الانتظار' : 'Pending',
      'on-hold': isRTL ? 'متوقف' : 'On Hold',
    }
    return statusMap[status] || status
  }

  // Generate milestones based on progress
  const getMilestones = (progress: number) => [
    { name: t.project.phases.analysis, threshold: 20, isCompleted: progress >= 20 },
    { name: t.project.phases.ui, threshold: 45, isCompleted: progress >= 45 },
    { name: t.project.phases.backend, threshold: 70, isCompleted: progress >= 70 },
    { name: t.project.phases.integration, threshold: 90, isCompleted: progress >= 90 },
    { name: t.project.phases.launch, threshold: 100, isCompleted: progress >= 100 },
  ]

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle} style={{ textAlign: isRTL ? 'right' : 'left' }}>
        {t.project.title}
        {clientProjects.length > 0 && (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginRight: isRTL ? '0' : '10px', marginLeft: isRTL ? '10px' : '0' }}>
            ({clientProjects.length} {isRTL ? 'مشاريع' : 'projects'})
          </span>
        )}
      </h2>
      
      {projectsToShow.map((project) => {
        const milestones = getMilestones(project.progress)
        
        return (
          <div key={project.id} className={styles.projectCard} style={{ marginBottom: '20px' }}>
            <div className={styles.projectHeader} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <h3>{project.name}</h3>
              <span 
                className={styles.status}
                style={{ backgroundColor: getStatusColor(project.status) }}
              >
                {getStatusText(project.status)}
              </span>
            </div>

            {/* Timeline Progress Bar */}
            <div className={styles.progressSection} style={{ marginTop: '40px', marginBottom: '40px' }}>
              <div style={{ position: 'relative', height: '60px', paddingTop: '25px' }}>
                {/* Background Line */}
                <div style={{ 
                  position: 'absolute', 
                  top: '40px', 
                  [isRTL ? 'right' : 'left']: 0, 
                  width: '100%', 
                  height: '4px', 
                  background: 'var(--bg-hover)', 
                  borderRadius: '2px' 
                }}></div>

                {/* Active Progress Line */}
                <div style={{ 
                  position: 'absolute', 
                  top: '40px', 
                  [isRTL ? 'right' : 'left']: 0, 
                  width: `${project.progress}%`, 
                  height: '4px', 
                  background: isRTL 
                    ? 'linear-gradient(270deg, #00C781, #0070F3)' 
                    : 'linear-gradient(90deg, #00C781, #0070F3)', 
                  borderRadius: '2px',
                  boxShadow: '0 0 10px rgba(0, 112, 243, 0.5)',
                  zIndex: 1
                }}></div>

                {/* Milestones Markers */}
                {milestones.map((milestone, index) => {
                  const isPassed = project.progress >= milestone.threshold;
                  const isNext = !isPassed && (index === 0 || project.progress >= milestones[index-1].threshold);
                  
                  return (
                    <div 
                      key={index} 
                      style={{ 
                        position: 'absolute', 
                        [isRTL ? 'right' : 'left']: `${milestone.threshold}%`, 
                        top: '36px', 
                        transform: isRTL ? 'translateX(50%)' : 'translateX(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 2
                      }}
                    >
                      <span style={{ 
                        position: 'absolute', 
                        bottom: '15px', 
                        whiteSpace: 'nowrap', 
                        fontSize: '0.75rem', 
                        color: isPassed ? '#00C781' : (isNext ? 'var(--text-white)' : 'var(--text-dim)'),
                        fontWeight: isPassed || isNext ? 600 : 400,
                        opacity: isPassed || isNext ? 1 : 0.5,
                        marginBottom: '5px'
                      }}>
                        {milestone.name}
                      </span>

                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '50%', 
                        background: 'var(--bg-card)',
                        border: `2px solid ${isPassed ? '#00C781' : 'var(--border-color)'}`,
                        backgroundColor: isPassed ? '#00C781' : 'var(--bg-surface)',
                        boxShadow: isPassed ? '0 0 8px rgba(0, 199, 129, 0.6)' : 'none',
                        transition: 'all 0.3s ease'
                      }}></div>
                    </div>
                  )
                })}
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '10px', color: 'var(--text-dim)', fontSize: '0.9rem', direction: isRTL ? 'rtl' : 'ltr' }}>
                {t.project.progress}: <span style={{ color: 'var(--text-white)', fontWeight: 'bold' }}>{isRTL ? `%${project.progress}` : `${project.progress}%`}</span>
              </div>
            </div>

            <div className={styles.projectStats} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
              <div className={styles.statItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <span className={styles.statLabel}>{t.project.budget}</span>
                <span className={styles.statValue}>${project.budget.toLocaleString()}</span>
              </div>
              <div className={styles.statItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <span className={styles.statLabel}>{t.project.spent}</span>
                <span className={styles.statValue}>${project.spent.toLocaleString()}</span>
              </div>
              <div className={styles.statItem} style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <span className={styles.statLabel}>{t.project.deadline}</span>
                <span className={styles.statValue}>
                  {new Date(project.deadline).toLocaleDateString(isRTL ? 'en-GB' : 'en-US')}
                </span>
              </div>
            </div>
          </div>
        )
      })}

      {clientProjects.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px', 
          color: 'var(--text-dim)',
          background: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)'
        }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
            {isRTL ? 'لا توجد مشاريع مرتبطة بحسابك حالياً' : 'No projects linked to your account yet'}
          </p>
          <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>
            {isRTL ? 'سيتم عرض المشاريع هنا بعد إضافتها من قبل المدير' : 'Projects will appear here once added by the manager'}
          </p>
        </div>
      )}
    </div>
  )
}

export default ProjectOverview