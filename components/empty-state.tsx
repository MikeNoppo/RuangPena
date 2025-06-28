import { Button } from "@/components/ui/button"
import { PlusCircle, Sparkles } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  title?: string
  description?: string
  buttonText?: string
  buttonHref?: string
  icon?: "plus" | "sparkles"
  className?: string
}

export function EmptyState({
  title = "Riwayat Anda Masih Kosong",
  description = "Ayo mulai perjalanan refleksi Anda dengan menulis catatan pertama.",
  buttonText = "Tulis Catatan Pertama",
  buttonHref = "/journal/new",
  icon = "sparkles",
  className = "",
}: EmptyStateProps) {
  const IconComponent = icon === "plus" ? PlusCircle : Sparkles

  return (
    <div className={`text-center py-16 sm:py-20 lg:py-24 ${className}`}>
      {/* Icon */}
      <div className="mb-8 sm:mb-10">
        <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-teal-50 to-teal-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-teal-600" strokeWidth={1.5} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto space-y-4 sm:space-y-6 px-4">
        {/* Heading */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-900 leading-tight">{title}</h2>

        {/* Description */}
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">{description}</p>

        {/* Call to Action */}
        <div className="pt-2 sm:pt-4">
          <Button
            asChild
            size="lg"
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-base font-medium"
          >
            <Link href={buttonHref}>{buttonText}</Link>
          </Button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="mt-12 sm:mt-16 opacity-30">
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-teal-300 rounded-full"></div>
          <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
          <div className="w-2 h-2 bg-teal-300 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
