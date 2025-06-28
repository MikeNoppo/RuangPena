"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [isHeroLoaded, setIsHeroLoaded] = useState(false)

  // Trigger hero animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsHeroLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      className="hero-section py-12 sm:py-20 lg:py-32 relative overflow-hidden bg-gradient-to-br from-earth-50 to-warm-100"
      aria-labelledby="hero-heading"
    >
      {/* Floating background elements with warm earth tones */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-earth-200 rounded-full opacity-30 animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-16 h-16 bg-warm-300 rounded-full opacity-25 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-40 left-20 w-12 h-12 bg-earth-300 rounded-full opacity-20 animate-pulse"
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
            className={`hero-description text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed px-4 transition-all duration-1000 ease-out ${
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
              className="hero-cta bg-earth-400 hover:bg-earth-500 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-lg shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-xl border-0"
            >
              <Link href="/auth">Mulai Menulis Gratis</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}