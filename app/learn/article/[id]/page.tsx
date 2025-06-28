"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, User, Calendar, BookOpen } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock article data (in a real app, this would come from an API or database)
const articles = [
  {
    id: 1,
    title: "5 Cara Efektif Mengelola Stres di Tempat Kerja",
    author: "Tim RuangPena",
    publishDate: "28 Juni 2025",
    readTime: "Bacaan 5 menit",
    category: "Manajemen Stres",
    headerImage: "/placeholder.svg?height=400&width=800",
    content: `Stres adalah bagian tak terhindarkan dari kehidupan profesional modern. Namun, kunci untuk tidak tenggelam di dalamnya adalah dengan membangun strategi pengelolaan yang efektif.

## 1. Kenali Pemicu Stres Anda

Langkah pertama adalah identifikasi. Apakah tenggat waktu yang ketat, beban kerja yang berlebihan, atau konflik dengan rekan kerja? Dengan mengetahui sumbernya, Anda bisa mulai mencari solusi yang tepat.

Cobalah untuk mencatat situasi-situasi yang membuat Anda merasa tertekan selama seminggu. Pola yang muncul akan membantu Anda memahami trigger utama stres di tempat kerja.

## 2. Terapkan Teknik 'Time Blocking'

Alih-alih membuat to-do list yang panjang, alokasikan blok waktu spesifik untuk setiap tugas. Ini membantu mengurangi rasa kewalahan dan memberikan struktur pada hari Anda.

Contoh penerapan time blocking:
- 09:00-10:30: Fokus pada proyek utama
- 10:30-10:45: Break dan peregangan
- 10:45-12:00: Menjawab email dan komunikasi
- 12:00-13:00: Istirahat makan siang

## 3. Ambil Jeda Singkat Secara Teratur

Bekerja non-stop justru menurunkan produktivitas. Gunakan teknik Pomodoro (25 menit kerja, 5 menit istirahat) untuk menjaga pikiran tetap segar dan fokus.

Selama jeda 5 menit, cobalah:
- Berdiri dan melakukan peregangan ringan
- Melihat keluar jendela untuk mengistirahatkan mata
- Melakukan pernapasan dalam selama beberapa kali
- Minum air putih untuk menjaga hidrasi

## 4. Komunikasi yang Efektif

Jangan ragu untuk berkomunikasi dengan atasan atau rekan kerja ketika merasa kewalahan. Seringkali, solusi bisa ditemukan melalui diskusi terbuka dan honest tentang beban kerja atau ekspektasi yang tidak realistis.

Tips komunikasi yang efektif:
- Sampaikan masalah dengan data konkret
- Tawarkan solusi alternatif
- Minta feedback dan saran
- Tetap profesional dan konstruktif

## 5. Ciptakan Ritual Transisi

Buat ritual sederhana untuk memisahkan waktu kerja dan waktu pribadi. Ini bisa berupa jalan kaki singkat setelah kerja, mendengarkan musik favorit, atau melakukan aktivitas yang Anda nikmati.

Ritual transisi membantu otak untuk "switch off" dari mode kerja dan mempersiapkan diri untuk waktu istirahat yang berkualitas.

## Kesimpulan

Mengelola stres di tempat kerja adalah keterampilan yang bisa dipelajari dan dikembangkan. Mulailah dengan satu atau dua teknik yang paling resonan dengan situasi Anda, lalu secara bertahap integrasikan strategi lainnya.

Ingatlah bahwa kesehatan mental Anda adalah prioritas. Jika stres terus berlanjut dan mengganggu kehidupan sehari-hari, jangan ragu untuk mencari bantuan profesional.`,
  },
  // Add more articles as needed
]

interface ArticleDetailProps {
  params: {
    id: string
  }
}

export default function ArticleDetail({ params }: ArticleDetailProps) {
  const [article, setArticle] = useState<(typeof articles)[0] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simulate API call to fetch article by ID
    const fetchArticle = async () => {
      setIsLoading(true)

      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const foundArticle = articles.find((a) => a.id === Number.parseInt(params.id))
      setArticle(foundArticle || null)
      setIsLoading(false)
    }

    fetchArticle()
  }, [params.id])

  // Function to render article content with proper formatting
  const renderContent = (content: string) => {
    const paragraphs = content.split("\n\n")

    return paragraphs.map((paragraph, index) => {
      // Handle headings
      if (paragraph.startsWith("## ")) {
        return (
          <h2 key={index} className="text-xl sm:text-2xl font-medium text-gray-900 mt-8 mb-4 first:mt-0">
            {paragraph.replace("## ", "")}
          </h2>
        )
      }

      // Handle bullet points
      if (paragraph.includes("- ")) {
        const lines = paragraph.split("\n")
        const beforeList = lines.filter((line) => !line.startsWith("- "))
        const listItems = lines.filter((line) => line.startsWith("- "))

        return (
          <div key={index} className="space-y-4">
            {beforeList.map(
              (line, lineIndex) =>
                line.trim() && (
                  <p key={lineIndex} className="text-gray-800 leading-relaxed">
                    {line}
                  </p>
                ),
            )}
            {listItems.length > 0 && (
              <ul className="space-y-2 ml-6">
                {listItems.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-gray-800 leading-relaxed list-disc">
                    {item.replace("- ", "")}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      }

      // Regular paragraphs
      return (
        <p key={index} className="text-gray-800 leading-relaxed mb-6 last:mb-0">
          {paragraph}
        </p>
      )
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Memuat artikel...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-medium text-gray-900">Artikel tidak ditemukan</h1>
            <p className="text-gray-600">Artikel yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
          </div>
          <Button onClick={() => router.push("/learn")} className="bg-teal-600 hover:bg-teal-700 text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Pustaka
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Navigation */}
        <div className="mb-8 sm:mb-12">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm font-medium">Kembali ke Pustaka</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-8 sm:mb-12 space-y-4 sm:space-y-6">
          {/* Article Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 leading-tight">{article.title}</h1>

          {/* Article Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm sm:text-base text-gray-600">
            {/* Author */}
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Oleh: {article.author}</span>
            </div>

            {/* Publish Date */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Dipublikasikan: {article.publishDate}</span>
            </div>

            {/* Read Time */}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </header>

        {/* Header Image */}
        <div className="mb-8 sm:mb-12">
          <div className="w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg overflow-hidden">
            <img
              src={article.headerImage || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <div
            className="text-gray-800 leading-relaxed space-y-6"
            style={{
              fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
              fontSize: "1.125rem",
              lineHeight: "1.8",
            }}
          >
            {renderContent(article.content)}
          </div>
        </article>

        {/* Article Footer */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="text-sm font-medium">Kembali ke Pustaka</span>
            </Link>

            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>Dipublikasikan pada {article.publishDate}</span>
            </div>
          </div>
        </div>

        {/* Related Articles Section (Optional) */}
        <div className="mt-16 sm:mt-20">
          <div className="bg-gray-50 rounded-lg p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-4">Artikel Terkait</h3>
            <p className="text-gray-600 mb-6">Jelajahi artikel lainnya yang mungkin menarik untuk Anda baca</p>
            <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
              <Link href="/learn">Lihat Semua Artikel</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
