"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BookOpen, Heart, Moon, Menu, Users, Target, Shield } from "lucide-react"
import Link from "next/link"

// Custom hook for intersection observer
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return [ref, isIntersecting] as const
}

// Animated section wrapper component
function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const [ref, isIntersecting] = useIntersectionObserver()

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{
        transitionDelay: isIntersecting ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  )
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHeroLoaded, setIsHeroLoaded] = useState(false)

  // Trigger hero animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsHeroLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const navigationLinks = [
    { href: "#fitur", label: "Fitur" },
    { href: "#tentang", label: "Tentang Kami" },
  ]

  const features = [
    {
      icon: BookOpen,
      title: "Jurnal Harian",
      description:
        "Tuangkan pikiran, perasaan, dan pengalaman Anda dalam ruang yang aman dan pribadi. Refleksikan hari Anda dan dapatkan wawasan tentang pola emosional Anda.",
    },
    {
      icon: Heart,
      title: "Jurnal Syukur",
      description:
        "Kembangkan rasa apresiasi dan pemikiran positif dengan mencatat hal-hal yang Anda syukuri. Bangun kebiasaan yang mengalihkan fokus Anda pada berkah kehidupan.",
    },
    {
      icon: Moon,
      title: "Jurnal Mimpi",
      description:
        "Catat dan jelajahi mimpi Anda untuk membuka wawasan dari alam bawah sadar. Temukan pola dan makna dalam perjalanan malam Anda.",
    },
  ]

  const aboutFeatures = [
    {
      icon: Users,
      title: "Komunitas Supportif",
      description: "Bergabung dengan komunitas yang peduli dengan kesehatan mental dan pertumbuhan pribadi.",
    },
    {
      icon: Shield,
      title: "Privasi Terjamin",
      description: "Data dan catatan pribadi Anda dilindungi.",
    },
    {
      icon: Target,
      title: "Pertumbuhan Berkelanjutan",
      description: "Kami memiliki materi yang bisa anda baca untuk membantu Anda memahami pola dan kemajuan diri.",
    },
  ]

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ scrollBehavior: "smooth" }}>
      {/* Site Header */}
      <header className="site-header">
        <nav
          className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95"
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Brand Logo with subtle animation */}
              <div className="brand-logo flex items-center">
                <h1 className="text-xl font-semibold text-gray-900 hover:text-teal-600 transition-colors duration-300">
                  RuangPena
                </h1>
              </div>

              {/* Desktop Navigation */}
              <div className="desktop-nav hidden md:block">
                <div className="flex items-baseline space-x-8 items-stretch ml-[635px] mr-[-186px]">
                  {navigationLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => handleNavClick(link.href)}
                      className="nav-link text-gray-600 hover:text-gray-900 text-sm font-medium transition-all duration-300 cursor-pointer px-0 py-0 text-left border-0 mx-0 relative group"
                      aria-label={`Navigate to ${link.label} section`}
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop Auth Actions */}
              <div className="desktop-auth hidden md:flex items-center space-x-4">
                <Button
                  asChild
                  className="cta-button bg-teal-600 hover:bg-teal-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <Link href="/auth">Masuk</Link>
                </Button>
              </div>

              {/* Mobile Menu Toggle */}
              <div className="mobile-menu-toggle md:hidden">
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300"
                      aria-label="Open mobile menu"
                    >
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Buka menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="mobile-menu w-[300px] sm:w-[400px]">
                    <div className="flex flex-col h-full">
                      {/* Mobile Menu Header */}
                      <div className="mobile-menu-header flex items-center justify-between pb-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">RuangPena</h2>
                      </div>

                      {/* Mobile Navigation Links */}
                      <nav className="mobile-nav flex-1 py-6" role="navigation" aria-label="Mobile navigation">
                        <div className="space-y-4">
                          {navigationLinks.map((link) => (
                            <button
                              key={link.href}
                              onClick={() => handleNavClick(link.href)}
                              className="mobile-nav-link block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-all duration-300"
                              aria-label={`Navigate to ${link.label} section`}
                            >
                              {link.label}
                            </button>
                          ))}
                        </div>
                      </nav>

                      {/* Mobile Auth Actions */}
                      <div className="mobile-auth border-t border-gray-100 pt-6 space-y-3">
                        <Button
                          asChild
                          variant="ghost"
                          className="w-full justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300"
                        >
                          <Link href="/auth">Masuk</Link>
                        </Button>
                        <Button
                          asChild
                          className="w-full bg-teal-600 hover:bg-teal-700 text-white transition-all duration-300 hover:scale-105"
                        >
                          <Link href="/auth">Mulai</Link>
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content" role="main">
        {/* Hero Section with staggered animations */}
        <section
          className="hero-section py-12 sm:py-20 lg:py-32 relative overflow-hidden"
          aria-labelledby="hero-heading"
        >
          {/* Floating background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-20 h-20 bg-teal-100 rounded-full opacity-20 animate-pulse"></div>
            <div
              className="absolute top-40 right-20 w-16 h-16 bg-blue-100 rounded-full opacity-20 animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-40 left-20 w-12 h-12 bg-pink-100 rounded-full opacity-20 animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>

          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="hero-content text-center">
              <h1
                id="hero-heading"
                className={`hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight transition-all duration-1000 ease-out ${
                  isHeroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                Temukan Kedamaian dalam Catatan Harian Anda
              </h1>
              <p
                className={`hero-description text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed px-4 transition-all duration-1000 ease-out ${
                  isHeroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                Ubah pikiran Anda menjadi kejelasan dengan RuangPena. Ruang yang lembut untuk refleksi harian, praktik
                syukur, dan jurnal penuh kesadaran yang memelihara kesejahteraan mental Anda.
              </p>
              <div
                className={`hero-actions transition-all duration-1000 ease-out ${
                  isHeroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: "400ms" }}
              >
                <Button
                  asChild
                  size="lg"
                  className="hero-cta bg-teal-600 hover:bg-teal-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-lg shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <Link href="/auth">Mulai Menulis Gratis</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with scroll animations */}
        <AnimatedSection>
          <section id="fitur" className="features-section py-12 sm:py-20 bg-white" aria-labelledby="features-heading">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <header className="section-header text-center mb-12 sm:mb-16">
                <h2 id="features-heading" className="section-title text-2xl sm:text-3xl font-light text-gray-900 mb-4">
                  Tiga Cara Menulis Jurnal dengan Penuh Kesadaran
                </h2>
                <p className="section-description text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                  Pilih gaya jurnal yang sesuai dengan Anda, atau jelajahi ketiganya untuk menciptakan praktik kesadaran
                  yang lengkap.
                </p>
              </header>

              {/* Feature Cards Grid with staggered animations */}
              <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {features.map((feature, index) => (
                  <AnimatedSection key={index} delay={index * 200}>
                    <article className="feature-card group" aria-labelledby={`feature-${index}-title`}>
                      <Card className="h-full border-0 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group-hover:scale-105">
                        <CardContent className="card-content p-6 sm:p-8 text-center h-full flex flex-col">
                          <div className="feature-icon w-12 h-12 sm:w-16 sm:h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-all duration-300 group-hover:bg-teal-200 group-hover:scale-110">
                            <feature.icon
                              className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600 transition-all duration-300 group-hover:text-teal-700"
                              aria-hidden="true"
                            />
                          </div>
                          <h3
                            id={`feature-${index}-title`}
                            className="feature-title text-lg sm:text-xl font-medium text-gray-900 mb-3 sm:mb-4 transition-colors duration-300 group-hover:text-teal-700"
                          >
                            {feature.title}
                          </h3>
                          <p className="feature-description text-sm sm:text-base text-gray-600 leading-relaxed flex-grow">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    </article>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* About Us Section with scroll animations */}
        <AnimatedSection>
          <section id="tentang" className="about-section py-12 sm:py-20 bg-gray-50" aria-labelledby="about-heading">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <header className="section-header text-center mb-12 sm:mb-16">
                <h2 id="about-heading" className="section-title text-2xl sm:text-3xl font-light text-gray-900 mb-4">
                  Tentang Kami
                </h2>
                <p className="section-description text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                  RuangPena lahir dari keyakinan bahwa setiap orang berhak memiliki ruang yang aman untuk
                  mengekspresikan pikiran dan perasaan mereka. Kami berkomitmen untuk menyediakan platform yang
                  mendukung kesehatan mental dan pertumbuhan pribadi melalui praktik jurnal yang penuh kesadaran.
                </p>
              </header>

              {/* About Features Grid with staggered animations */}
              <div className="about-features-grid grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {aboutFeatures.map((feature, index) => (
                  <AnimatedSection key={index} delay={index * 200}>
                    <article className="about-feature-card group" aria-labelledby={`about-feature-${index}-title`}>
                      <Card className="h-full border-0 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group-hover:scale-105">
                        <CardContent className="card-content p-6 sm:p-8 text-center h-full flex flex-col">
                          <div className="feature-icon w-12 h-12 sm:w-16 sm:h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-all duration-300 group-hover:bg-teal-200 group-hover:scale-110">
                            <feature.icon
                              className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600 transition-all duration-300 group-hover:text-teal-700"
                              aria-hidden="true"
                            />
                          </div>
                          <h3
                            id={`about-feature-${index}-title`}
                            className="feature-title text-lg sm:text-xl font-medium text-gray-900 mb-3 sm:mb-4 transition-colors duration-300 group-hover:text-teal-700"
                          >
                            {feature.title}
                          </h3>
                          <p className="feature-description text-sm sm:text-base text-gray-600 leading-relaxed flex-grow">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    </article>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Call to Action Section with scroll animation */}
        <AnimatedSection>
          <section
            className="cta-section py-12 sm:py-20 bg-teal-50 relative overflow-hidden"
            aria-labelledby="cta-heading"
          >
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 left-10 w-32 h-32 bg-teal-300 rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-24 h-24 bg-teal-400 rounded-full"></div>
            </div>

            <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="cta-content text-center">
                <h2 id="cta-heading" className="cta-title text-2xl sm:text-3xl font-light text-gray-900 mb-4">
                  Mulai Perjalanan Penuh Kesadaran Anda Hari Ini
                </h2>
                <p className="cta-description text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                  Bergabunglah dengan ribuan orang yang telah menemukan kedamaian dan kejelasan melalui jurnal penuh
                  kesadaran. Perjalanan kesehatan mental Anda dimulai dengan satu catatan.
                </p>
                <div className="cta-actions">
                  <Button
                    asChild
                    size="lg"
                    className="cta-button bg-teal-600 hover:bg-teal-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-lg shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <Link href="/auth">Mulai Menulis Gratis</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>
      </main>

      {/* Site Footer with scroll animation */}
      <AnimatedSection>
        <footer className="site-footer bg-white border-t border-gray-100" role="contentinfo">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="footer-content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {/* Brand Section */}
              <div className="footer-brand sm:col-span-2">
                <h3 className="brand-name text-lg font-semibold text-gray-900 mb-4 hover:text-teal-600 transition-colors duration-300">
                  RuangPena
                </h3>
                <p className="brand-description text-gray-600 max-w-md">
                  Ruang yang lembut untuk jurnal penuh kesadaran dan kesehatan mental. Temukan kedamaian dalam catatan
                  harian Anda dan pelihara pertumbuhan batin Anda.
                </p>
              </div>

              {/* Product Links */}
              <div className="footer-section">
                <h4 className="section-title text-sm font-medium text-gray-900 mb-4">Produk</h4>
                <nav className="footer-nav" role="navigation" aria-label="Product navigation">
                  <ul className="nav-list space-y-2">
                    <li>
                      <button
                        onClick={() => handleNavClick("#fitur")}
                        className="footer-link text-gray-600 hover:text-gray-900 text-sm transition-colors duration-300 cursor-pointer hover:translate-x-1 transform"
                      >
                        Fitur
                      </button>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="footer-link text-gray-600 hover:text-gray-900 text-sm transition-all duration-300 hover:translate-x-1 transform inline-block"
                      >
                        Privasi
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>

              {/* Support Links */}
              <div className="footer-section">
                <h4 className="section-title text-sm font-medium text-gray-900 mb-4">Dukungan</h4>
                <nav className="footer-nav" role="navigation" aria-label="Support navigation">
                  <ul className="nav-list space-y-2">
                    <li>
                      <Link
                        href="#"
                        className="footer-link text-gray-600 hover:text-gray-900 text-sm transition-all duration-300 hover:translate-x-1 transform inline-block"
                      >
                        Pusat Bantuan
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="footer-link text-gray-600 hover:text-gray-900 text-sm transition-all duration-300 hover:translate-x-1 transform inline-block"
                      >
                        Hubungi Kami
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick("#tentang")}
                        className="footer-link text-gray-600 hover:text-gray-900 text-sm transition-all duration-300 cursor-pointer hover:translate-x-1 transform"
                      >
                        Tentang Kami
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom border-t border-gray-100 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
              <p className="copyright text-gray-500 text-sm">
                © {new Date().getFullYear()} RuangPena. Semua hak dilindungi.
              </p>
            </div>
          </div>
        </footer>
      </AnimatedSection>
    </div>
  )
}
