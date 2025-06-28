"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {
  Search,
  BookOpen,
  User,
  Settings,
  HelpCircle,
  MessageCircle,
  Mail,
  Clock,
  CheckCircle,
  ArrowRight,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

// Help articles data structure
const helpArticles = [
  {
    id: 1,
    title: "Cara Memulai Jurnal Pertama Anda",
    category: "getting-started",
    categoryName: "Memulai",
    content: "Pelajari langkah-langkah mudah untuk membuat entri jurnal pertama Anda di RuangPena.",
    tags: ["jurnal", "pemula", "tutorial"],
    popular: true,
  },
  {
    id: 2,
    title: "Memahami Berbagai Jenis Jurnal",
    category: "getting-started",
    categoryName: "Memulai",
    content: "Kenali perbedaan antara Jurnal Harian, Jurnal Syukur, Jurnal Mimpi, dan Jurnal Bullet.",
    tags: ["jenis jurnal", "panduan"],
    popular: true,
  },
  {
    id: 3,
    title: "Mengubah Nama Pengguna",
    category: "account",
    categoryName: "Akun",
    content: "Panduan langkah demi langkah untuk mengubah nama pengguna Anda.",
    tags: ["profil", "pengaturan"],
    popular: false,
  },
  {
    id: 4,
    title: "Mengatur Ulang Kata Sandi",
    category: "account",
    categoryName: "Akun",
    content: "Cara mengatur ulang kata sandi jika Anda lupa atau ingin mengubahnya.",
    tags: ["kata sandi", "keamanan"],
    popular: true,
  },
  {
    id: 5,
    title: "Mengatasi Masalah Login",
    category: "troubleshooting",
    categoryName: "Pemecahan Masalah",
    content: "Solusi untuk masalah umum saat login ke akun RuangPena Anda.",
    tags: ["login", "masalah"],
    popular: true,
  },
  {
    id: 6,
    title: "Jurnal Tidak Tersimpan",
    category: "troubleshooting",
    categoryName: "Pemecahan Masalah",
    content: "Apa yang harus dilakukan jika entri jurnal Anda tidak tersimpan dengan benar.",
    tags: ["simpan", "error"],
    popular: false,
  },
]

// FAQ data
const faqData = [
  {
    id: 1,
    question: "Apakah RuangPena gratis untuk digunakan?",
    answer:
      "Ya, RuangPena menyediakan fitur dasar secara gratis untuk semua pengguna. Anda dapat membuat jurnal harian, jurnal syukur, dan jurnal mimpi tanpa biaya. Kami juga menyediakan paket premium dengan fitur tambahan untuk pengguna yang membutuhkan lebih banyak fungsionalitas.",
    category: "general",
  },
  {
    id: 2,
    question: "Bagaimana cara menghapus entri jurnal?",
    answer:
      "Untuk menghapus entri jurnal, buka halaman riwayat, pilih entri yang ingin dihapus, lalu klik tombol 'Hapus' di bagian bawah halaman detail entri. Perhatikan bahwa tindakan ini tidak dapat dibatalkan.",
    category: "usage",
  },
  {
    id: 3,
    question: "Apakah data jurnal saya aman dan privat?",
    answer:
      "Keamanan dan privasi data Anda adalah prioritas utama kami. Semua entri jurnal dienkripsi dan hanya dapat diakses oleh Anda. Kami tidak membaca, membagikan, atau menggunakan konten jurnal Anda untuk tujuan apapun.",
    category: "privacy",
  },
  {
    id: 4,
    question: "Bisakah saya mengekspor data jurnal saya?",
    answer:
      "Ya, Anda dapat mengekspor semua data jurnal Anda dalam format PDF atau JSON melalui halaman pengaturan. Fitur ini berguna untuk backup atau jika Anda ingin memindahkan data ke platform lain.",
    category: "data",
  },
  {
    id: 5,
    question: "Bagaimana cara mengubah tema atau tampilan aplikasi?",
    answer:
      "Saat ini RuangPena menggunakan tema yang dirancang khusus untuk menciptakan suasana tenang dan fokus. Kami sedang mengembangkan opsi kustomisasi tema yang akan tersedia dalam update mendatang.",
    category: "customization",
  },
  {
    id: 6,
    question: "Apakah ada aplikasi mobile untuk RuangPena?",
    answer:
      "Saat ini RuangPena tersedia sebagai aplikasi web yang responsif dan dapat diakses melalui browser mobile Anda. Aplikasi mobile native sedang dalam tahap pengembangan dan akan segera tersedia.",
    category: "mobile",
  },
]

// Contact form interface
interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
  category: string
}

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Categories for navigation
  const categories = [
    { id: "all", name: "Semua", icon: BookOpen, count: helpArticles.length },
    { id: "getting-started", name: "Memulai", icon: BookOpen, count: 2 },
    { id: "account", name: "Akun", icon: User, count: 2 },
    { id: "troubleshooting", name: "Pemecahan Masalah", icon: Settings, count: 2 },
    { id: "faq", name: "FAQ", icon: HelpCircle, count: faqData.length },
  ]

  // Filter articles based on search and category
  const filteredArticles = useMemo(() => {
    let filtered = helpArticles

    if (selectedCategory !== "all" && selectedCategory !== "faq") {
      filtered = filtered.filter((article) => article.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    return filtered
  }, [searchQuery, selectedCategory])

  // Filter FAQs based on search
  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return faqData

    const query = searchQuery.toLowerCase()
    return faqData.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.category.toLowerCase().includes(query),
    )
  }, [searchQuery])

  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Contact form submitted:", contactForm)
      setSubmitSuccess(true)
      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: "",
        category: "general",
      })
    } catch (error) {
      console.error("Error submitting contact form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContactInputChange = (field: keyof ContactForm, value: string) => {
    setContactForm((prev) => ({ ...prev, [field]: value }))
  }

  // Popular articles
  const popularArticles = helpArticles.filter((article) => article.popular)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-100 px-4 sm:px-6">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-teal-600" />
            <h1 className="text-lg sm:text-xl font-medium text-gray-900">Pusat Bantuan</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
            {/* Page Header */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
                <HelpCircle className="h-8 w-8 text-teal-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-light text-gray-900 mb-2">Pusat Bantuan RuangPena</h1>
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                  Temukan jawaban untuk pertanyaan Anda atau hubungi tim dukungan kami untuk bantuan lebih lanjut
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari artikel bantuan, FAQ, atau panduan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 sm:h-14 text-base border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
                {searchQuery && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Menampilkan hasil untuk: <span className="font-medium">"{searchQuery}"</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Links - Popular Articles */}
            {!searchQuery && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-teal-600" />
                  Artikel Populer
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popularArticles.map((article) => (
                    <Card
                      key={article.id}
                      className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-teal-200 transition-colors">
                            <BookOpen className="h-4 w-4 text-teal-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{article.content}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                {article.categoryName}
                              </Badge>
                              {article.popular && (
                                <Badge className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                                  Populer
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Main Content Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
              {/* Category Navigation */}
              <div className="border-b border-gray-200">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-transparent h-auto p-0">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:text-teal-600 data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:bg-transparent rounded-none"
                    >
                      <category.icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{category.name}</span>
                      <span className="sm:hidden">{category.name.split(" ")[0]}</span>
                      <Badge variant="secondary" className="ml-1 text-xs bg-gray-100 text-gray-600">
                        {category.count}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Articles Content */}
              {categories
                .filter((cat) => cat.id !== "faq")
                .map((category) => (
                  <TabsContent key={category.id} value={category.id} className="space-y-4">
                    {filteredArticles.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {filteredArticles.map((article) => (
                          <Card
                            key={article.id}
                            className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-teal-200 transition-colors">
                                  <BookOpen className="h-5 w-5 text-teal-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-teal-700 transition-colors mb-2">
                                    {article.title}
                                  </h3>
                                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{article.content}</p>
                                  <div className="flex items-center justify-between">
                                    <div className="flex flex-wrap gap-1">
                                      {article.tags.slice(0, 2).map((tag, index) => (
                                        <Badge
                                          key={index}
                                          variant="secondary"
                                          className="text-xs bg-gray-100 text-gray-600"
                                        >
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="border-0 shadow-sm">
                        <CardContent className="p-8 text-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="h-8 w-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada artikel ditemukan</h3>
                          <p className="text-gray-600 mb-4">
                            Coba ubah kata kunci pencarian atau jelajahi kategori lainnya.
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => setSearchQuery("")}
                            className="border-gray-200 hover:bg-gray-50"
                          >
                            Hapus Pencarian
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                ))}

              {/* FAQ Content */}
              <TabsContent value="faq" className="space-y-4">
                <div className="space-y-4">
                  <h2 className="text-xl font-medium text-gray-900">Pertanyaan yang Sering Diajukan</h2>
                  {filteredFAQs.length > 0 ? (
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-6">
                        <Accordion type="single" collapsible className="space-y-2">
                          {filteredFAQs.map((faq) => (
                            <AccordionItem key={faq.id} value={`faq-${faq.id}`} className="border-b border-gray-100">
                              <AccordionTrigger className="text-left hover:no-underline py-4">
                                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                              </AccordionTrigger>
                              <AccordionContent className="pb-4">
                                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <HelpCircle className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada FAQ ditemukan</h3>
                        <p className="text-gray-600 mb-4">
                          Coba ubah kata kunci pencarian atau hubungi tim dukungan kami.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setSearchQuery("")}
                          className="border-gray-200 hover:bg-gray-50"
                        >
                          Hapus Pencarian
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Contact Support Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Contact Information */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900">
                    <MessageCircle className="h-5 w-5 text-teal-600" />
                    Hubungi Tim Dukungan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-gray-600">
                    Tidak menemukan jawaban yang Anda cari? Tim dukungan kami siap membantu Anda 24/7.
                  </p>

                  {/* Contact Methods */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                        <Mail className="h-4 w-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">support@ruangpena.com</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Live Chat</p>
                        <p className="text-sm text-gray-600">Tersedia 24/7</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                        <Clock className="h-4 w-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Waktu Respons</p>
                        <p className="text-sm text-gray-600">Biasanya dalam 2-4 jam</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Mulai Live Chat
                    </Button>
                    <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50 bg-transparent">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Kunjungi Forum Komunitas
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Form */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900">
                    <Mail className="h-5 w-5 text-teal-600" />
                    Kirim Pesan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {submitSuccess ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Pesan Terkirim!</h3>
                      <p className="text-gray-600 mb-4">
                        Terima kasih telah menghubungi kami. Tim dukungan akan merespons dalam 2-4 jam.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setSubmitSuccess(false)}
                        className="border-gray-200 hover:bg-gray-50"
                      >
                        Kirim Pesan Lain
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Nama
                          </Label>
                          <Input
                            id="name"
                            type="text"
                            placeholder="Nama lengkap Anda"
                            value={contactForm.name}
                            onChange={(e) => handleContactInputChange("name", e.target.value)}
                            className="h-10 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="email@example.com"
                            value={contactForm.email}
                            onChange={(e) => handleContactInputChange("email", e.target.value)}
                            className="h-10 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                          Subjek
                        </Label>
                        <Input
                          id="subject"
                          type="text"
                          placeholder="Ringkasan singkat masalah Anda"
                          value={contactForm.subject}
                          onChange={(e) => handleContactInputChange("subject", e.target.value)}
                          className="h-10 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                          Pesan
                        </Label>
                        <Textarea
                          id="message"
                          placeholder="Jelaskan masalah atau pertanyaan Anda dengan detail..."
                          value={contactForm.message}
                          onChange={(e) => handleContactInputChange("message", e.target.value)}
                          className="min-h-[120px] border-gray-200 focus:border-teal-500 focus:ring-teal-500 resize-none"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Mengirim...
                          </div>
                        ) : (
                          <>
                            <Mail className="h-4 w-4 mr-2" />
                            Kirim Pesan
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Additional Resources */}
            <Card className="border-0 shadow-sm bg-teal-50">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sumber Daya Tambahan</h3>
                <p className="text-gray-600 mb-4">
                  Jelajahi sumber daya lainnya untuk memaksimalkan pengalaman Anda dengan RuangPena
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    asChild
                    variant="outline"
                    className="border-teal-200 hover:bg-teal-100 bg-transparent text-teal-700"
                  >
                    <Link href="/learn">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Pustaka Pengetahuan
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-teal-200 hover:bg-teal-100 bg-transparent text-teal-700"
                  >
                    <Link href="/dashboard">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Kembali ke Dasbor
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
