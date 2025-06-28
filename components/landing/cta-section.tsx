import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AnimatedSection } from "./animated-section"

export function CtaSection() {
  return (
    <AnimatedSection>
      <section
        className="cta-section py-12 sm:py-20 bg-gradient-to-br from-earth-100 to-warm-200 relative overflow-hidden"
        aria-labelledby="cta-heading"
      >
        {/* Subtle background pattern with warm earth tones */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-earth-400 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-warm-500 rounded-full"></div>
        </div>

        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="cta-content text-center">
            <h2 id="cta-heading" className="cta-title text-2xl sm:text-3xl font-light text-gray-900 mb-4">
              Mulai Perjalanan Penuh Kesadaran Anda Hari Ini
            </h2>
            <p className="cta-description text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Bergabunglah dengan ribuan orang yang telah menemukan kedamaian dan kejelasan melalui jurnal penuh
              kesadaran. Perjalanan kesehatan mental Anda dimulai dengan satu catatan.
            </p>
            <div className="cta-actions">
              <Button
                asChild
                size="lg"
                className="cta-button bg-earth-400 hover:bg-earth-500 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-lg shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-xl border-0"
              >
                <Link href="/auth">Mulai Menulis Gratis</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  )
}