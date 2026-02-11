'use client'

import { FC, useState } from 'react'
import styles from './Header.module.css'

interface HeaderProps {
  onSmoothScroll: (targetId: string) => void
}

const Header: FC<HeaderProps> = ({ onSmoothScroll }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    onSmoothScroll(targetId)
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className={styles.mainNav} aria-label="Main Navigation">
      <button 
        className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle Menu"
        aria-expanded={isMenuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`${styles.navList} ${isMenuOpen ? styles.open : ''}`}>
        <li>
          <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')}>
            Projects
          </a>
        </li>
        <li>
          <a href="#services" onClick={(e) => handleNavClick(e, 'services')}>
            Services
          </a>
        </li>
        <li>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>
            Contact
          </a>
        </li>
        <li>
          <a href="/login" className={styles.loginBtn}>
            Log In
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default Header
