'use client'

import { FC } from 'react'
import styles from './TawkChatButton.module.css'

// تصريح عام لـ Tawk_API
declare global {
  interface Window {
    Tawk_API?: {
      maximize: () => void;
      hideWidget: () => void;
      showWidget: () => void;
    };
  }
}

const TawkChatButton: FC = () => {
  const openChat = () => {
    if (typeof window !== 'undefined' && window.Tawk_API) {
      window.Tawk_API.maximize();
    }
  }

  return (
    <button onClick={openChat} className={styles.chatButton} aria-label="فتح الدردشة">
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
      </svg>
      <span className={styles.text}>Contact Us</span>
    </button>
  )
}

export default TawkChatButton
