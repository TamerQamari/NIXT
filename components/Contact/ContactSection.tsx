'use client'

import { FC, FormEvent, useState } from 'react'
import styles from './Contact.module.css'

const ContactSection: FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('تم إرسال رسالتك بنجاح! سنتواصل معك خلال 24 ساعة.')
    
    setFormData({
      name: '',
      email: '',
      message: ''
    })
  }

  return (
    <div id="contact" className={styles.contactMinimal}>
      <h2 className={styles.sectionTitle}>Begin Your Digital Journey</h2>
      <p className={styles.subtitle}>
        Send your project details and we will contact you within 24 hours.
      </p>
      
      <form className={styles.contactForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <input 
            type="text" 
            name="name"
            placeholder="Full Name" 
            value={formData.name}
            onChange={handleInputChange}
            required 
          />
        </div>
        <div className={styles.formGroup}>
          <input 
            type="email" 
            name="email"
            placeholder="Email Address" 
            value={formData.email}
            onChange={handleInputChange}
            required 
          />
        </div>
        <div className={styles.formGroup}>
          <textarea 
            name="message"
            rows={4} 
            placeholder="Tell us about your project..."
            value={formData.message}
            onChange={handleInputChange}
            required 
          />
        </div>
        <button type="submit" className={styles.submitBtn}>Send Request</button>
      </form>
    </div>
  )
}

export default ContactSection
