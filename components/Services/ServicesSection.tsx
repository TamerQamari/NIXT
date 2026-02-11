'use client'

import { FC } from 'react'
import styles from './Services.module.css'

interface Service {
  title: string
  description: string
}

const services: Service[] = [
  {
    title: 'Systems Development',
    description: "We don't just build websites; we design powerful systems that manage your business with high efficiency and superior security, considering every technical detail."
  },
  {
    title: 'Cloud Solutions',
    description: 'Advanced infrastructure ensuring complete stability for your project and the ability to scale globally without any technical or software obstacles.'
  },
  {
    title: 'User Experience',
    description: "Modern designs focused on user psychology and accessibility, just as seen in the world's most prestigious tech platforms."
  }
]

interface ServicesProps {
  onContactClick: () => void
}

const ServicesSection: FC<ServicesProps> = ({ onContactClick }) => {
  return (
    <div id="services" className={styles.contentSection}>
      <h2 className={styles.sectionTitle}>The Essence of Innovation</h2>
      <div className={styles.servicesMinimal}>
        {services.map((service, index) => (
          <div key={index} className={styles.minimalCard}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <a href="#contact" onClick={(e) => { e.preventDefault(); onContactClick(); }} className={styles.serviceCta}>
              More Info
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ServicesSection
