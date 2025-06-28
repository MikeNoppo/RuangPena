"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Heart, Moon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock journal entry data (in a real app, this would come from an API or database)
const journalEntries = [
  {
    id: 1,
    title: "Refleksi Hari yang Menantang",
    date: "27 Juni 2025",
    dateObj: new Date(2025, 5, 27),
    type: "daily",
    typeName: "Jurnal Harian",
    content: `Hari ini adalah salah satu hari yang paling menantang yang pernah saya alami dalam beberapa bulan terakhir. Presentasi besar di kantor tidak berjalan sesuai rencana, dan saya merasa sangat kecewa dengan performa saya.

Namun, ketika saya duduk di sini dan merefleksikan apa yang terjadi, saya menyadari bahwa setiap tantangan adalah kesempatan untuk belajar dan tumbuh. Meskipun presentasi tidak sempurna, saya melihat beberapa area di mana saya bisa berkembang:

Pertama, persiapan saya masih kurang mendalam. Saya terlalu percaya diri dan tidak meluangkan waktu yang cukup untuk berlatih. Ke depannya, saya akan membuat jadwal persiapan yang lebih terstruktur.

Kedua, saya perlu belajar mengelola kecemasan dengan lebih baik. Ketika saya gugup, saya cenderung berbicara terlalu cepat dan melupakan poin-poin penting. Mungkin teknik pernapasan atau meditasi singkat sebelum presentasi bisa membantu.

Yang paling penting, saya belajar bahwa kegagalan bukanlah akhir dari segalanya. Tim saya tetap mendukung, dan atasan saya memberikan feedback yang konstruktif. Mereka melihat potensi dalam diri saya, dan itu memberikan motivasi untuk terus berusaha.

Saya merasa bersyukur memiliki ruang ini untuk menuangkan pikiran dan perasaan saya. Menulis membantu saya memproses emosi dan melihat situasi dari perspektif yang lebih jernih. Besok adalah hari yang baru, dan saya siap menghadapinya dengan pelajaran yang telah saya dapatkan hari ini.`,
    icon: BookOpen,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    iconColor: "text-blue-600",
  },
  {
    id: 2,
    title: "Syukur untuk Keluarga",
    date: "26 Juni 2025",
    dateObj: new Date(2025, 5, 26),
    type: "gratitude",
    typeName: "Jurnal Syukur",
    content: `Hari ini saya ingin meluangkan waktu untuk benar-benar menghargai keluarga saya. Terkadang dalam kesibukan sehari-hari, saya lupa betapa beruntungnya saya memiliki orang-orang yang selalu ada untuk saya.

Makan malam bersama keluarga tadi malam sangat istimewa. Kami semua berkumpul di meja makan, mematikan ponsel, dan benar-benar hadir satu sama lain. Tawa adik saya yang polos, cerita ayah tentang masa mudanya, dan perhatian ibu yang selalu memastikan semua orang kenyang - momen-momen sederhana ini adalah harta yang sesungguhnya.

Saya bersyukur untuk:

Ibu yang selalu memasak dengan penuh cinta, bahkan setelah hari yang melelahkan di kantor. Setiap suapan makanan buatannya terasa seperti pelukan hangat.

Ayah yang menjadi teladan kekuatan dan kebijaksanaan. Nasihat-nasihatnya mungkin terdengar klise, tapi selalu tepat sasaran dan datang di saat yang tepat.

Adik saya yang selalu berhasil membuat saya tertawa, bahkan di hari-hari terburuk. Energi dan optimismenya menular dan mengingatkan saya untuk tidak terlalu serius menghadapi hidup.

Rumah yang menjadi tempat berlindung, di mana saya bisa menjadi diri sendiri tanpa topeng atau pretense.

Tradisi keluarga kecil kami, seperti menonton film bersama di akhir pekan atau bermain board game saat hujan.

Saya menyadari bahwa kebahagiaan sejati tidak selalu datang dari pencapaian besar atau hal-hal materi. Seringkali, kebahagiaan itu ada dalam momen-momen sederhana bersama orang-orang yang kita cintai.

Besok saya akan berusaha lebih hadir untuk keluarga saya, mendengarkan dengan lebih baik, dan menunjukkan apresiasi saya lebih sering.`,
    icon: Heart,
    color: "bg-pink-100 text-pink-700 border-pink-200",
    iconColor: "text-pink-600",
  },
  {
    id: 3,
    title: "Mimpi Tentang Masa Depan",
    date: "25 Juni 2025",
    dateObj: new Date(2025, 5, 25),
    type: "dream",
    typeName: "Jurnal Mimpi",
    content: `Tadi malam saya bermimpi yang sangat jelas dan indah. Saya berada di sebuah rumah kayu sederhana di tepi pantai, dengan jendela-jendela besar yang menghadap ke laut. Suara ombak yang berirama menjadi soundtrack alami yang menenangkan jiwa.

Dalam mimpi itu, saya bangun pagi-pagi dan berjalan ke teras. Udara laut yang segar memenuhi paru-paru saya, dan saya merasakan kedamaian yang luar biasa. Tidak ada deadline yang mengejar, tidak ada notifikasi ponsel yang mengganggu - hanya saya, alam, dan ketenangan.

Yang menarik dari mimpi ini adalah perasaan yang menyertainya. Saya merasa sangat puas dan bahagia, seolah-olah saya telah menemukan tempat di mana jiwa saya benar-benar bisa beristirahat. Ada meja tulis kayu di sudut ruangan, dengan buku-buku dan jurnal yang tersusun rapi. Saya melihat diri saya menulis dengan tenang, kata-kata mengalir dengan mudah.

Di mimpi itu, saya juga melihat taman kecil di belakang rumah, dengan tanaman herbal dan bunga-bunga liar. Ada ayunan kayu yang menghadap ke laut, tempat saya sering duduk untuk merenung atau membaca.

Ketika saya bangun, perasaan damai itu masih tertinggal. Mimpi ini membuat saya berpikir tentang apa yang benar-benar saya inginkan dalam hidup. Mungkin ini adalah cara alam bawah sadar saya memberitahu bahwa saya perlu lebih banyak ketenangan dan koneksi dengan alam.

Saya tidak tahu apakah mimpi ini adalah visi masa depan atau hanya refleksi dari kerinduan saya akan kehidupan yang lebih sederhana. Yang pasti, mimpi ini menginspirasi saya untuk mencari lebih banyak momen ketenangan dalam kehidupan sehari-hari.

Mungkin saya bisa mulai dengan hal-hal kecil: bangun lebih pagi untuk menikmati keheningan, menghabiskan lebih banyak waktu di alam, atau menciptakan sudut tenang di rumah untuk menulis dan merenung.`,
    icon: Moon,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    iconColor: "text-purple-600",
  },
]

interface JournalEntryDetailProps {
  params: {
    id: string
  }
}

export default function JournalEntryDetail({ params }: JournalEntryDetailProps) {
  const [entry, setEntry] = useState<(typeof journalEntries)[0] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simulate API call to fetch entry by ID
    const fetchEntry = async () => {
      setIsLoading(true)

      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const foundEntry = journalEntries.find((e) => e.id === Number.parseInt(params.id))
      setEntry(foundEntry || null)
      setIsLoading(false)
    }

    fetchEntry()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Memuat catatan...</p>
        </div>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-medium text-gray-900">Catatan tidak ditemukan</h1>
            <p className="text-gray-600">Catatan yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
          </div>
          <Button onClick={() => router.push("/history")} className="bg-teal-600 hover:bg-teal-700 text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Riwayat
          </Button>
        </div>
      </div>
    )
  }

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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 leading-tight">{entry.title}</h1>

          {/* Entry Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            {/* Date */}
            <time className="text-gray-600 text-base sm:text-lg">{entry.date}</time>

            {/* Journal Type Tag */}
            <div className="flex items-center">
              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${entry.color}`}
              >
                <entry.icon className="h-4 w-4" />
                {entry.typeName}
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
              <span>Dibuat pada {entry.date}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
