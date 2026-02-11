import { FC } from 'react'
import styles from './Hero.module.css'

const HeroSection: FC = () => {
  return (
    <div className={styles.introContainer}>
      <div className={styles.topInfo} dir="ltr">
        DIGITAL INNOVATION & TECH GROUP
      </div>

      <div className={styles.centerLogo}>
        <h1 dir="ltr">Nixt</h1>
        <span className={styles.tagline}>building the future</span>
        
        <div className={styles.ctaContainer}>
          <a href="#projects" className="vercel-btn vercel-btn-primary">
            Start Building
          </a>
          <a href="#contact" className="vercel-btn vercel-btn-secondary">
            Get in Touch
          </a>
        </div>
      </div>

      <div className={styles.bottomSections}>
        <div className={styles.bottomItem}>
          <h4>NIXT TECH</h4>
          <p>
            Integrated Software Solutions
            <br />& Smart Systems Development
          </p>
        </div>
        <div className={`${styles.bottomItem} ${styles.center}`}>
          <h4>SERVICES</h4>
          <p>
            Web Development | Apps | SaaS
            <br />
            Cloud Infrastructure
          </p>
        </div>
        <div className={`${styles.bottomItem} ${styles.right}`}>
          <h4>BRANDING</h4>
          <p>
            CREATIVE DESIGN
            <br />
            DIGITAL SOLUTIONS
          </p>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
