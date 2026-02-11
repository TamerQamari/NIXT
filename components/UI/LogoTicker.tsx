'use client'

import { FC } from 'react'
import Image from 'next/image'
import styles from './LogoTicker.module.css'

interface LogoItem {
  src: string
  alt: string
}

const logos: LogoItem[] = [
  { src: '/sahm_logo.png', alt: 'Sahm' },
  { src: '/LogoWithName.png', alt: 'Genius' },
  { src: '/Asset 11.png', alt: 'Partner' },
  { src: '/logo.webp', alt: 'Partner' },
  { src: '/October.webp', alt: 'Partner' },
  { src: '/IMS.png', alt: 'Partner' },
]

const LogoTicker: FC = () => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Our Projects</h3>
      <div className={styles.logoTicker}>
      <div className={styles.tickerWrapper}>
        {logos.map((logo, index) => (
          <div key={`first-${index}`} className={styles.tickerItem}>
            <Image 
              src={logo.src} 
              alt={logo.alt}
              width={120}
              height={35}
              priority={true}
              loading="eager"
              style={{ objectFit: 'contain' }}
            />
          </div>
        ))}
        
        {logos.map((logo, index) => (
          <div key={`second-${index}`} className={styles.tickerItem}>
            <Image 
              src={logo.src} 
              alt={logo.alt}
              width={120}
              height={35}
              priority={true}
              loading="eager"
              style={{ objectFit: 'contain' }}
            />
          </div>
        ))}
        
        {logos.map((logo, index) => (
          <div key={`third-${index}`} className={styles.tickerItem}>
            <Image 
              src={logo.src} 
              alt={logo.alt}
              width={120}
              height={35}
              priority={true}
              loading="eager"
              style={{ objectFit: 'contain' }}
            />
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}

export default LogoTicker
