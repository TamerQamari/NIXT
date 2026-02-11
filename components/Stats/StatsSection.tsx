import { FC } from 'react'
import styles from './Stats.module.css'

interface Stat {
  value: string
  label: string
}

const stats: Stat[] = [
  { value: '07', label: 'Major Projects' },
  { value: '30', label: 'Countries Globally' },
  { value: '+20K', label: 'Revenue' }
]

const StatsSection: FC = () => {
  return (
    <div className={styles.minimalStats}>
      {stats.map((stat, index) => (
        <div key={index} className={styles.mStatItem}>
          <span className={styles.mStatVal}>{stat.value}</span>
          <span className={styles.mStatLabel}>{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

export default StatsSection
