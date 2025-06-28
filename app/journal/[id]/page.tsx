"use client"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Heart, Moon, Target } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { JournalEntry, ApiResponse, JOURNAL_TYPES } from "@/lib/types"
import { JournalType } from "@prisma/client"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"

interface JournalEntryDetailProps {
  params:{
    id: string
  }
}

// Helper function to get icon and colors for journal types
const getJournalTypeInfo = (type: JournalType) => {
  switch (type) {
    case JournalType.DAILY:
      return {
        icon: BookOpen,
        color: "bg-blue-100 text-blue-700 border-blue-200",
        iconColor: "text-blue-600"
      }
    case JournalType.GRATITUDE:
      return {
        icon: Heart,
        color: "bg-pink-100 text-pink-700 border-pink-200",
        iconColor: "text-pink-600"
      }
    case JournalType.DREAM:
      return {
        icon: Moon,
        color: "bg-purple-100 text-purple-700 border-purple-200",
        iconColor: "text-purple-600"
      }
    case JournalType.BULLET:
      return {
        icon: Target,
        color: "bg-earth-100 text-earth-700 border-earth-200",
        iconColor: "text-earth-600"
      }
    default:
      return {
        icon: BookOpen,
        color: "bg-gray-100 text-gray-700 border-gray-200",
        iconColor: "text-gray-600"
      }
  }
}

export default function JournalEntryDetail({ params }: JournalEntryDetailProps) {
  const { user, token } = useAuth()
  const router = useRouter()
  const [entry, setEntry] = useState<JournalEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/auth')
      return
    }

    fetchEntry(params.id)
  }, [user, router, token, params.id])

  const fetchEntry = async (journalId: string) => {
    if (!token) return
    
    setIsLoading(true)
    setError("")
    
    try {
      const response = await fetch(`/api/journal/${journalId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data: ApiResponse<JournalEntry> = await response.json()
      
      if (data.success && data.data) {
        setEntry(data.data)
      } else {
        setError(data.message || 'Jurnal tidak ditemukan')
      }
    } catch (error) {
      setError('Terjadi kesalahan jaringan')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-earth-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Memuat catatan...</p>
        </div>
      </div>
    )
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-medium text-gray-900">Catatan tidak ditemukan</h1>
            <p className="text-gray-600">
              {error || "Catatan yang Anda cari mungkin telah dihapus atau tidak tersedia."}
            </p>
          </div>
          <Button onClick={() => router.push("/history")} className="bg-earth-400 hover:bg-earth-500 text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Riwayat
          </Button>
        </div>
      </div>
    )
  }

  const typeInfo = getJournalTypeInfo(entry.type)
  const formattedDate = format(new Date(entry.createdAt), "d MMMM yyyy", { locale: localeId })

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Navigation */}
        <div className="mb-8 sm:mb-12">
          <Link
            href="/history"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm font-medium">Kembali ke Riwayat</span>
          </Link>
        </div>

        {/* Entry Header */}
        <header className="mb-8 sm:mb-12 space-y-4 sm:space-y-6">
          {/* Entry Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 leading-tight">
            {entry.title || 'Tanpa Judul'}
          </h1>

          {/* Entry Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            {/* Date */}
            <time className="text-gray-600 text-base sm:text-lg">{formattedDate}</time>

            {/* Journal Type Tag */}
            <div className="flex items-center">
              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${typeInfo.color}`}
              >
                <typeInfo.icon className="h-4 w-4" />
                {JOURNAL_TYPES[entry.type]}
              </span>
            </div>
          </div>
        </header>

        {/* Entry Content */}
        <article className="prose prose-lg max-w-none">
          <div
            className="text-gray-800 leading-relaxed space-y-6"
            style={{
              fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
              fontSize: "1.125rem",
              lineHeight: "1.8",
            }}
          >
            {entry.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-6 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        {/* Tags Section */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link
              href="/history"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="text-sm font-medium">Kembali ke Riwayat</span>
            </Link>

            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>Dibuat pada {formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}