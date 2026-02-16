'use client'

import { FC } from 'react'
import styles from './Dashboard.module.css'
import { useLanguage } from '@/hooks/useLanguage'

interface Project {
  id: string
  name: string
  status: 'development' | 'completed' | 'review' | 'planning'
  progress: number
  budget: number
  spent: number
  deadline: string
}

interface Milestone {
  key: string
  threshold: number
  isCompleted: boolean
}

const ProjectOverview: FC = () => {
  const { t, language } = useLanguage()
  const isRTL = language === 'ar'

  // Mock phases mapping to progress percentage
  const milestones = [
    { name: t.project.phases.analysis, threshold: 20, isCompleted: true },
    { name: t.project.phases.ui, threshold: 45, isCompleted: true },
    { name: t.project.phases.backend, threshold: 70, isCompleted: true },
    { name: t.project.phases.integration, threshold: 90, isCompleted: false },
    { name: t.project.phases.launch, threshold: 100, isCompleted: false },
  ]

  // Mock data for demonstration
  const project: Project = {
    id: '1',
    name: 'منصة التجارة الإلكترونية - NIXT Store',
    status: 'development',
    progress: 75,
    budget: 150000,
    spent: 112500,
    deadline: '2026-04-15T00:00:00Z'
  }

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed': return '#00C781'
      case 'development': return '#0070F3'
      case 'review': return '#FF8C00'
      case 'planning': return '#666'
      default: return '#666'
    }
  }

  const getStatusText = (status: Project['status']) => {
    return t.project.status[status] || status
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle} style={{ textAlign: isRTL ? 'right' : 'left' }}>{t.project.title}</h2>
      
      <div className={styles.projectCard}>
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
               // Show label only if completed or is the current active phase
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
                  {/* Label above the line - only show for nearby or completed items to avoid clutter */}
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

                  {/* Dot on the line */}
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
    </div>
  )
}

export default ProjectOverview