import { SiteHeader } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

const FeaturesSection = dynamic(
  () =>
    import("@/components/landing/features-section").then(
      (mod) => mod.FeaturesSection,
    ),
  { loading: () => <Skeleton className="h-[400px] w-full" /> },
)
const AboutSection = dynamic(
  () =>
    import("@/components/landing/about-section").then((mod) => mod.AboutSection),
  { loading: () => <Skeleton className="h-[400px] w-full" /> },
)
const CtaSection = dynamic(
  () => import("@/components/landing/cta-section").then((mod) => mod.CtaSection),
  { loading: () => <Skeleton className="h-[300px] w-full" /> },
)
const SiteFooter = dynamic(
  () =>
    import("@/components/landing/site-footer").then((mod) => mod.SiteFooter),
  { loading: () => <Skeleton className="h-[200px] w-full" /> },
)

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ scrollBehavior: "smooth" }}
    >
      <SiteHeader />

      {/* Main Content */}
      <main className="main-content" role="main">
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
        <CtaSection />
      </main>

      <SiteFooter />
    </div>
  )
}
