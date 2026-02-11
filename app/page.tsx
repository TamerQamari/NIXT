'use client'

import { useTheme } from '@/hooks/useTheme'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'

import Header from '@/components/Header'
import HeroSection from '@/components/Hero'
import LogoTicker from '@/components/UI/LogoTicker'
import BentoGrid from '@/components/Bento/BentoGrid'
import ProjectsSection from '@/components/Projects'
import ServicesSection from '@/components/Services'
import ProductDirection from '@/components/ProductDirection'
import StatsSection from '@/components/Stats'
import ContactSection from '@/components/Contact'
import ThemeSwitcher from '@/components/UI/ThemeSwitcher'

export default function Home() {
  const { nextTheme } = useTheme()
  const { scrollToSection } = useSmoothScroll()

  const handleContactClick = () => {
    scrollToSection('contact')
  }

  return (
    <main>
      {/* Navigation */}
      <Header onSmoothScroll={scrollToSection} />

      {/* Hero Section */}
      <HeroSection />

      {/* Logo Ticker */}
      <LogoTicker />

      {/* Bento Grid Features */}
      <BentoGrid />

      {/* Featured Projects */}
      <ProjectsSection onContactClick={handleContactClick} />

      {/* Services */}
      <ServicesSection onContactClick={handleContactClick} />

      {/* Product Direction */}
      <ProductDirection />

      {/* Stats */}
      <StatsSection />

      {/* Contact */}
      <ContactSection />

      {/* Footer */}
      <footer className="site-footer">
        © 2026 NIXT . ALL RIGHTS RESERVED.
      </footer>

      {/* Theme Switcher */}
      <ThemeSwitcher onThemeChange={nextTheme} />
    </main>
  )
}
