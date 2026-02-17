'use client'

import { FC, FormEvent, useState } from 'react'
import emailjs from '@emailjs/browser'
import styles from './Contact.module.css'

const ContactSection: FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Replace these with your EmailJS credentials
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_name: 'NIXT Team',
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'
      )

      if (result.status === 200) {
        alert('✅ تم إرسال رسالتك بنجاح! سنتواصل معك خلال 24 ساعة.')
        setFormData({
          name: '',
          email: '',
          message: ''
        })
      }
    } catch (error) {
      console.error('EmailJS Error:', error)
      alert('❌ حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return null
}

export default ContactSection
