import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Heart, Moon } from "lucide-react"
import { AnimatedSection } from "./animated-section"

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

export function FeaturesSection() {
  return (
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
                      <div className="feature-icon w-12 h-12 sm:w-16 sm:h-16 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-all duration-300 group-hover:bg-earth-200 group-hover:scale-110">
                        <feature.icon
                          className="w-6 h-6 sm:w-8 sm:h-8 text-earth-600 transition-all duration-300 group-hover:text-earth-700"
                          aria-hidden="true"
                        />
                      </div>
                      <h3
                        id={`feature-${index}-title`}
                        className="feature-title text-lg sm:text-xl font-medium text-gray-900 mb-3 sm:mb-4 transition-colors duration-300 group-hover:text-earth-700"
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
  )
}