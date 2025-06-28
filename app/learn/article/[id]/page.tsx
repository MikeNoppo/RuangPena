import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, User, Calendar, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

// Mock article data (in a real app, this would come from an API or database)
const articles = [
  {
    id: 1,
    title: "Pentingnya Menjaga Kesehatan Mental",
    author: "Tim RuangPena",
    publishDate: "28 Juni 2025",
    readTime: "Bacaan 10 menit",
    category: "Kesehatan Mental",
    headerImage: "/article_thumnails.png",
    content: `Kesehatan mental adalah aspek yang sering kali diabaikan dalam kehidupan sehari-hari, padahal sangat penting untuk kesejahteraan secara keseluruhan. Menjaga kesehatan mental sama pentingnya dengan menjaga kesehatan fisik. Nah ini adalah beberapa alasan mengapa kesehatan mental harus menjadi prioritas.

## 1. Meningkatkan Kualitas Hidup

Kesehatan mental yang baik berkontribusi pada kualitas hidup yang lebih tinggi. Ketika seseorang merasa seimbang secara emosional dan mental, mereka cenderung lebih bahagia, produktif, dan mampu menikmati hidup. Sebaliknya, masalah kesehatan mental dapat mengurangi kemampuan seseorang untuk menjalani aktivitas sehari-hari.

## 2. Mencegah Penyakit

Stres dan masalah kesehatan mental dapat memicu berbagai penyakit fisik, seperti penyakit jantung, diabetes, dan gangguan sistem kekebalan tubuh. Dengan menjaga kesehatan mental, kita dapat mengurangi risiko terkena penyakit fisik yang serius.

## 3. Hubungan yang Lebih Baik

Kesehatan mental yang baik memungkinkan seseorang untuk berinteraksi dengan orang lain secara positif. Ini meningkatkan kemampuan untuk membangun dan memelihara hubungan sosial yang sehat. Sebaliknya, masalah kesehatan mental dapat menyebabkan isolasi dan konflik dalam hubungan.

## 4. Produktivitas yang Tinggi

Individu dengan kesehatan mental yang baik cenderung lebih produktif di tempat kerja atau dalam studi. Mereka mampu berkonsentrasi, menyelesaikan tugas dengan efisien, dan berinovasi. Sebaliknya, masalah seperti kecemasan atau depresi dapat menghambat kinerja.

## 5. Keseimbangan Emosional

Menjaga kesehatan mental membantu individu untuk lebih mampu mengatasi stres dan tantangan. Dengan strategi yang tepat, seperti meditasi, olahraga, atau terapi, seseorang dapat mengelola emosi mereka dengan lebih baik dan menghadapi masalah hidup dengan lebih tenang.

## Cara Menjaga Kesehatan Mental

### 1. Berolahraga secara teratur
Aktivitas fisik dapat meningkatkan mood dan mengurangi stres. Olahraga melepaskan endorfin yang dikenal sebagai "hormon bahagia" dan membantu mengurangi kadar kortisol (hormon stres) dalam tubuh.

### 2. Tidur yang cukup
Kualitas tidur yang baik sangat penting untuk kesehatan mental. Tidur yang cukup membantu otak memproses emosi dan informasi dengan lebih baik, serta memulihkan energi mental.

### 3. Makan dengan baik
Nutrisi yang seimbang berkontribusi pada kesehatan mental yang optimal. Makanan yang kaya akan omega-3, vitamin B, dan antioksidan dapat mendukung fungsi otak yang sehat.

### 4. Berbicara dengan seseorang
Jangan ragu untuk mencari dukungan dari teman, keluarga, atau profesional jika merasa tertekan. Berbagi perasaan dan pikiran dapat membantu mengurangi beban mental.

### 5. Luangkan waktu untuk diri sendiri
Aktivitas yang menyenangkan dan relaksasi sangat penting untuk menjaga keseimbangan mental. Ini bisa berupa hobi, meditasi, atau sekadar waktu untuk merefleksikan diri.

## Kesimpulan

Menjaga kesehatan mental adalah investasi yang sangat penting untuk kehidupan yang lebih baik. Dengan memahami dan menerapkan cara-cara untuk merawat kesehatan mental, kita tidak hanya meningkatkan kualitas hidup kita sendiri, tetapi juga dapat memberikan dampak positif bagi orang-orang di sekitar kita. Prioritaskan kesehatan mental Anda, karena itu adalah kunci untuk mencapai kebahagiaan dan kesejahteraan yang sejati.

## Kata Penutup

Ingatlah, kesehatan mental bukanlah tujuan akhir, tetapi perjalanan yang harus kita jalani setiap hari. Saat kita merawat pikiran dan emosi, kita membuka pintu menuju kehidupan yang lebih cerah dan penuh makna. Jadi, yuk, bersama-sama kita jaga kesehatan mental kita! Jadikan setiap hari sebagai kesempatan untuk tumbuh, bersyukur, dan merayakan diri sendiri. Karena setiap langkah kecil menuju kesehatan mental yang baik adalah langkah besar menuju kebahagiaan! 🌟

---

*Artikel ini merupakan panduan umum tentang kesehatan mental. Jika Anda mengalami masalah kesehatan mental yang serius, disarankan untuk berkonsultasi dengan profesional kesehatan mental yang qualified.*`,
  },
  // Add more articles as needed
]

// Function to render article content with proper formatting
// This function runs on the server and generates HTML
const renderContent = (content: string) => {
  const paragraphs = content.split("\n\n")

  return paragraphs.map((paragraph, index) => {
    // Handle horizontal rule (---)
    if (paragraph.trim() === "---") {
      return <hr key={index} className="my-8 border-gray-200" />
    }

    // Handle h3 headings (###)
    if (paragraph.startsWith("### ")) {
      return (
        <h3 key={index} className="text-lg sm:text-xl font-medium text-gray-900 mt-6 mb-3 first:mt-0">
          {paragraph.replace("### ", "")}
        </h3>
      )
    }

    // Handle h2 headings (##)
    if (paragraph.startsWith("## ")) {
      return (
        <h2 key={index} className="text-xl sm:text-2xl font-medium text-gray-900 mt-8 mb-4 first:mt-0">
          {paragraph.replace("## ", "")}
        </h2>
      )
    }

    // Handle h1 headings (#)
    if (paragraph.startsWith("# ")) {
      return (
        <h1 key={index} className="text-2xl sm:text-3xl font-medium text-gray-900 mt-8 mb-4 first:mt-0">
          {paragraph.replace("# ", "")}
        </h1>
      )
    }

    // Handle italic text (*text*)
    const formatText = (text: string) => {
      return text.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')
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
                <p key={lineIndex} className="text-gray-800 leading-relaxed"
                   dangerouslySetInnerHTML={{ __html: formatText(line) }} />
              ),
          )}
          {listItems.length > 0 && (
            <ul className="space-y-2 ml-6">
              {listItems.map((item, itemIndex) => (
                <li key={itemIndex} className="text-gray-800 leading-relaxed list-disc"
                    dangerouslySetInnerHTML={{ __html: formatText(item.replace("- ", "")) }} />
              ))}
            </ul>
          )}
        </div>
      )
    }

    // Handle numbered lists
    if (/^\d+\./.test(paragraph)) {
      const lines = paragraph.split("\n")
      const listItems = lines.filter((line) => /^\d+\./.test(line))
      const beforeList = lines.filter((line) => !/^\d+\./.test(line))

      return (
        <div key={index} className="space-y-4">
          {beforeList.map(
            (line, lineIndex) =>
              line.trim() && (
                <p key={lineIndex} className="text-gray-800 leading-relaxed"
                   dangerouslySetInnerHTML={{ __html: formatText(line) }} />
              ),
          )}
          {listItems.length > 0 && (
            <ol className="space-y-2 ml-6 list-decimal">
              {listItems.map((item, itemIndex) => (
                <li key={itemIndex} className="text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatText(item.replace(/^\d+\.\s*/, "")) }} />
              ))}
            </ol>
          )}
        </div>
      )
    }

    // Regular paragraphs
    if (paragraph.trim()) {
      return (
        <p key={index} className="text-gray-800 leading-relaxed mb-6 last:mb-0"
           dangerouslySetInnerHTML={{ __html: formatText(paragraph) }} />
      )
    }

    return null
  })
}

interface ArticleDetailProps {
  params: {
    id: string
  }
}

// This is now a Server Component
export default function ArticleDetail({ params }: ArticleDetailProps) {
  const { id } = params

  // Fetch article data on the server
  const article = articles.find((a) => a.id === Number.parseInt(id))

  // If article is not found, render the not-found page
  if (!article) {
    notFound()
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
          <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] lg:aspect-[2.4/1] rounded-lg overflow-hidden">
            <Image
              src={article.headerImage || "/placeholder.svg"}
              alt={article.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
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
