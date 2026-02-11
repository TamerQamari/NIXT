'use client'

import { FC } from 'react'
import styles from './ThemeSwitcher.module.css'

interface ThemeSwitcherProps {
  onThemeChange: () => void
}

const ThemeSwitcher: FC<ThemeSwitcherProps> = ({ onThemeChange }) => {
  return (
    <div className={styles.themeSw}>
      <button 
        className={styles.thBtn} 
        onClick={onThemeChange} 
        title="Change Theme" 
        aria-label="Change Theme"
      >
        🧿
      </button>
    </div>
  )
}

export default ThemeSwitcher
