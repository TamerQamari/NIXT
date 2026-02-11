'use client'

import { FC } from 'react'
import styles from './Projects.module.css'

interface Project {
  badge: string
  title: string
  description: string
  cta: string
}

const projects: Project[] = [
  {
    badge: 'SaaS',
    title: 'Workflow Manager',
    description: 'Platform optimizing operations with analytics and secure access.',
    cta: 'Request demo'
  },
  {
    badge: 'Cloud',
    title: 'Global Infra',
    description: 'Auto-scaled infrastructure serving millions with zero downtime.',
    cta: 'Read case'
  },
  {
    badge: 'UX',
    title: 'Commerce Redesign',
    description: 'Human-centered redesign improved conversion by 28%.',
    cta: 'See results'
  }
]

interface ProjectsProps {
  onContactClick: () => void
}

const ProjectsSection: FC<ProjectsProps> = ({ onContactClick }) => {
  const sliderProjects = [...projects, ...projects, ...projects, ...projects]

  return (
    <div id="projects" className={styles.contentSection}>
      <h2 className={styles.sectionTitle}>Featured Projects</h2>
      
      <div className={styles.slider}>
        <div className={styles.sliderTrack}>
          {sliderProjects.map((project, index) => (
            <div key={index} className={styles.projectCard}>
              <div className={styles.cardContent}>
                <div className={styles.badge}>{project.badge}</div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <a href="#contact" onClick={(e) => { e.preventDefault(); onContactClick(); }} className={styles.serviceCta}>
                  {project.cta}
                </a>
              </div>
              <div className={styles.shine}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectsSection
