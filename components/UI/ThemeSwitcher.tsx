'use client'

import { FC } from 'react'
import styles from './ThemeSwitcher.module.css'

interface ThemeSwitcherProps {
  onThemeChange: () => void // This might not be needed if we custom implement the toggle
  onSetTheme?: (index: number) => void
  currentTheme?: number
}

const ThemeSwitcher: FC<ThemeSwitcherProps> = ({ onSetTheme, currentTheme = 0 }) => {
  // If onSetTheme is not provided, don't render anything (following previous logic where it was hidden on home)
  if (!onSetTheme) return null;

  const isWhiteTheme = currentTheme === 4;

  const toggleTheme = () => {
    if (isWhiteTheme) {
      onSetTheme(0); // Go back to Default (Blue-Black)
    } else {
      onSetTheme(4); // Go to White-Blue
    }
  }

  return (
    <div className={styles.themeSw}>
      <button 
        className={styles.thBtn} 
        onClick={toggleTheme} 
        title={isWhiteTheme ? "Switch to Dark Theme" : "Switch to White Theme"}
        aria-label="Toggle Theme"
        style={{ 
          background: isWhiteTheme ? '#000' : 'white', 
          color: isWhiteTheme ? 'white' : '#0055ff', 
          border: isWhiteTheme ? '1px solid rgba(255,255,255,0.2)' : '2px solid #0055ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isWhiteTheme ? (
          // Moon icon for Dark Mode
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        ) : (
          // Sun icon for Light Mode
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2"/>
            <path d="M12 20v2"/>
            <path d="m4.93 4.93 1.41 1.41"/>
            <path d="m17.66 17.66 1.41 1.41"/>
            <path d="M2 12h2"/>
            <path d="M20 12h2"/>
            <path d="m6.34 17.66-1.41 1.41"/>
            <path d="m19.07 4.93-1.41 1.41"/>
          </svg>
        )}
      </button>
    </div>
  )
}

export default ThemeSwitcher
