"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { BookOpen, Clock, Search, Filter, Tag, X, SortAsc, SortDesc, User, Calendar } from "lucide-react"

// Enhanced mock articles data with more metadata for filtering
const articles = [
  {
    id: 1,
    title: "5 Cara Efektif Mengelola Stres di Tempat Kerja",
    category: "Manajemen Stres",
    categoryColor: "bg-blue-100 text-blue-700 border-blue-200",
    readTime: "Bacaan 5 menit",
    readTimeMinutes: 5,
    snippet:
      "Stres di lingkungan kerja adalah hal yang umum, namun ada langkah-langkah praktis yang bisa Anda ambil untuk menjaga keseimbangan dan produktivitas. Pelajari teknik manajemen stres yang terbukti efektif.",
    publishDate: "15 Juni 2025",
    dateObj: new Date(2025, 5, 15),
    author: "Dr. Sarah Wijaya",
    tags: ["stres", "kerja", "produktivitas", "keseimbangan", "manajemen"],
    difficulty: "pemula",
    featured: true,
  },
  {
    id: 2,
    title: "Membangun Rutinitas Mindfulness untuk Pemula",
    category: "Mindfulness",
    categoryColor: "bg-green-100 text-green-700 border-green-200",
    readTime: "Bacaan 7 menit",
    readTimeMinutes: 7,
    snippet:
      "Mindfulness bukan hanya tentang meditasi. Pelajari cara sederhana untuk mengintegrasikan kesadaran penuh dalam aktivitas sehari-hari Anda dan merasakan manfaatnya secara langsung.",
    publishDate: "12 Juni 2025",
    dateObj: new Date(2025, 5, 12),
    author: "Prof. Ahmad Santoso",
    tags: ["mindfulness", "meditasi", "kesadaran", "rutinitas", "pemula"],
    difficulty: "pemula",
    featured: false,
  },
  {
    id: 3,
    title: "Mengatasi Kecemasan dengan Teknik Pernapasan",
    category: "Kesehatan Mental",
    categoryColor: "bg-purple-100 text-purple-700 border-purple-200",
    readTime: "Bacaan 4 menit",
    readTimeMinutes: 4,
    snippet:
      "Teknik pernapasan yang tepat dapat menjadi alat yang powerful untuk menenangkan pikiran dan mengurangi gejala kecemasan secara alami. Praktik sederhana dengan hasil yang luar biasa.",
    publishDate: "10 Juni 2025",
    dateObj: new Date(2025, 5, 10),
    author: "Dr. Maya Indira",
    tags: ["kecemasan", "pernapasan", "relaksasi", "teknik", "alami"],
    difficulty: "pemula",
    featured: true,
  },
  {
    id: 4,
    title: "Pentingnya Tidur Berkualitas untuk Kesehatan Mental",
    category: "Gaya Hidup Sehat",
    categoryColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
    readTime: "Bacaan 6 menit",
    readTimeMinutes: 6,
    snippet:
      "Tidur yang berkualitas memiliki dampak langsung pada mood, konsentrasi, dan kemampuan mengelola emosi. Temukan tips untuk tidur yang lebih baik dan hidup yang lebih sehat.",
    publishDate: "8 Juni 2025",
    dateObj: new Date(2025, 5, 8),
    author: "Dr. Budi Hartono",
    tags: ["tidur", "kesehatan", "mood", "konsentrasi", "kualitas"],
    difficulty: "menengah",
    featured: false,
  },
  {
    id: 5,
    title: "Journaling sebagai Terapi: Panduan Lengkap",
    category: "Terapi Menulis",
    categoryColor: "bg-pink-100 text-pink-700 border-pink-200",
    readTime: "Bacaan 8 menit",
    readTimeMinutes: 8,
    snippet:
      "Menulis jurnal bukan hanya aktivitas biasa, tetapi dapat menjadi bentuk terapi yang efektif untuk memproses emosi dan meningkatkan self-awareness. Panduan komprehensif untuk memulai.",
    publishDate: "5 Juni 2025",
    dateObj: new Date(2025, 5, 5),
    author: "Dr. Lisa Permata",
    tags: ["journaling", "terapi", "emosi", "self-awareness", "menulis"],
    difficulty: "menengah",
    featured: true,
  },
  {
    id: 6,
    title: "Membangun Resiliensi Mental di Era Digital",
    category: "Resiliensi",
    categoryColor: "bg-orange-100 text-orange-700 border-orange-200",
    readTime: "Bacaan 6 menit",
    readTimeMinutes: 6,
    snippet:
      "Di era digital yang penuh distraksi, membangun ketahanan mental menjadi semakin penting. Pelajari strategi untuk tetap fokus dan seimbang di tengah hiruk pikuk teknologi.",
    publishDate: "3 Juni 2025",
    dateObj: new Date(2025, 5, 3),
    author: "Dr. Andi Pratama",
    tags: ["resiliensi", "digital", "fokus", "teknologi", "keseimbangan"],
    difficulty: "lanjutan",
    featured: false,
  },
  {
    id: 7,
    title: "Teknik Grounding untuk Mengatasi Panic Attack",
    category: "Kesehatan Mental",
    categoryColor: "bg-purple-100 text-purple-700 border-purple-200",
    readTime: "Bacaan 5 menit",
    readTimeMinutes: 5,
    snippet:
      "Panic attack bisa sangat menakutkan, tetapi teknik grounding dapat membantu Anda kembali ke momen sekarang. Pelajari metode 5-4-3-2-1 dan teknik lainnya yang terbukti efektif.",
    publishDate: "1 Juni 2025",
    dateObj: new Date(2025, 5, 1),
    author: "Dr. Maya Indira",
    tags: ["panic attack", "grounding", "teknik", "kecemasan", "darurat"],
    difficulty: "menengah",
    featured: false,
  },
  {
    id: 8,
    title: "Memahami dan Mengelola Burnout",
    category: "Manajemen Stres",
    categoryColor: "bg-blue-100 text-blue-700 border-blue-200",
    readTime: "Bacaan 9 menit",
    readTimeMinutes: 9,
    snippet:
      "Burnout adalah kondisi serius yang mempengaruhi banyak pekerja modern. Kenali tanda-tandanya dan pelajari strategi pemulihan yang efektif untuk kembali menemukan passion Anda.",
    publishDate: "28 Mei 2025",
    dateObj: new Date(2025, 4, 28),
    author: "Dr. Sarah Wijaya",
    tags: ["burnout", "kelelahan", "pemulihan", "passion", "kerja"],
    difficulty: "lanjutan",
    featured: true,
  },
]

type SortOption = "date-desc" | "date-asc" | "title-asc" | "title-desc" | "readtime-asc" | "readtime-desc"

export default function EducationalArticles() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>("date-desc")
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  // Get unique categories and difficulties for filters
  const categories = Array.from(new Set(articles.map((article) => article.category)))
  const difficulties = Array.from(new Set(articles.map((article) => article.difficulty)))

  // Advanced filtering and search logic using useMemo for performance
  const filteredAndSortedArticles = useMemo(() => {
    let filtered = articles

    // Search functionality - searches across multiple fields
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((article) => {
        return (
          article.title.toLowerCase().includes(query) ||
          article.snippet.toLowerCase().includes(query) ||
          article.category.toLowerCase().includes(query) ||
          article.author.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query))
        )
      })
    }

    // Category filtering
    if (selectedCategory !== "all") {
      filtered = filtered.filter((article) => article.category === selectedCategory)
    }

    // Difficulty filtering
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((article) => article.difficulty === selectedDifficulty)
    }

    // Featured articles filtering
    if (showFeaturedOnly) {
      filtered = filtered.filter((article) => article.featured)
    }

    // Sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return b.dateObj.getTime() - a.dateObj.getTime()
        case "date-asc":
          return a.dateObj.getTime() - b.dateObj.getTime()
        case "title-asc":
          return a.title.localeCompare(b.title)
        case "title-desc":
          return b.title.localeCompare(a.title)
        case "readtime-asc":
          return a.readTimeMinutes - b.readTimeMinutes
        case "readtime-desc":
          return b.readTimeMinutes - a.readTimeMinutes
        default:
          return 0
      }
    })

    return sorted
  }, [searchQuery, selectedCategory, selectedDifficulty, showFeaturedOnly, sortBy])

  const handleArticleClick = (articleId: number) => {
    window.location.href = `/learn/article/${articleId}`
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedDifficulty("all")
    setShowFeaturedOnly(false)
    setSortBy("date-desc")
  }

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedDifficulty !== "all" || showFeaturedOnly

  // Highlight search terms in text
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  const isFilteredEmpty = filteredAndSortedArticles.length === 0 && articles.length > 0 && !isLoading

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-100 px-4 sm:px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-medium text-gray-900">Pustaka Pengetahuan</h1>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      <div className="lg:col-span-2 h-11 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-11 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-11 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Card key={index} className="border-0 shadow-sm">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-100 px-4 sm:px-6">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-medium text-gray-900">Pustaka Pengetahuan</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            {/* Page Title */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-light text-gray-900">Pustaka Pengetahuan</h1>
              <p className="text-base sm:text-lg text-gray-600">
                Jelajahi artikel dan wawasan untuk mendukung perjalanan kesehatan mental Anda
              </p>
            </div>

            {/* Enhanced Filter Section */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-medium text-gray-700">Filter & Pencarian</h3>
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-2 bg-teal-100 text-teal-700">
                        {[
                          searchQuery && "Pencarian",
                          selectedCategory !== "all" && "Kategori",
                          selectedDifficulty !== "all" && "Tingkat",
                          showFeaturedOnly && "Unggulan",
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </Badge>
                    )}
                  </div>

                  {/* Main Filter Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Enhanced Search Bar */}
                    <div className="relative lg:col-span-2">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Cari artikel, topik, atau kategori..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-10 sm:h-11 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                      />
                      {searchQuery && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSearchQuery("")}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Category Filter */}
                    <div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="h-10 sm:h-11 border-gray-200 focus:border-teal-500 focus:ring-teal-500">
                          <SelectValue placeholder="Semua Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Kategori</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort Options */}
                    <div>
                      <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                        <SelectTrigger className="h-10 sm:h-11 border-gray-200 focus:border-teal-500 focus:ring-teal-500">
                          <SelectValue placeholder="Urutkan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date-desc">
                            <div className="flex items-center gap-2">
                              <SortDesc className="h-4 w-4" />
                              Terbaru
                            </div>
                          </SelectItem>
                          <SelectItem value="date-asc">
                            <div className="flex items-center gap-2">
                              <SortAsc className="h-4 w-4" />
                              Terlama
                            </div>
                          </SelectItem>
                          <SelectItem value="title-asc">
                            <div className="flex items-center gap-2">
                              <SortAsc className="h-4 w-4" />
                              Judul A-Z
                            </div>
                          </SelectItem>
                          <SelectItem value="title-desc">
                            <div className="flex items-center gap-2">
                              <SortDesc className="h-4 w-4" />
                              Judul Z-A
                            </div>
                          </SelectItem>
                          <SelectItem value="readtime-asc">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Bacaan Singkat
                            </div>
                          </SelectItem>
                          <SelectItem value="readtime-desc">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Bacaan Panjang
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Additional Filters Row */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    {/* Difficulty Filter */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Tingkat:</span>
                      <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                        <SelectTrigger className="h-8 w-32 border-gray-200 focus:border-teal-500 focus:ring-teal-500">
                          <SelectValue placeholder="Semua" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua</SelectItem>
                          {difficulties.map((difficulty) => (
                            <SelectItem key={difficulty} value={difficulty}>
                              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Featured Filter */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={showFeaturedOnly}
                        onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <label htmlFor="featured" className="text-sm text-gray-600 cursor-pointer">
                        Hanya Artikel Unggulan
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Results Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  Menampilkan <span className="font-medium">{filteredAndSortedArticles.length}</span> dari{" "}
                  <span className="font-medium">{articles.length}</span> artikel
                </p>
                {searchQuery && (
                  <p className="text-xs text-gray-500">
                    Hasil pencarian untuk: <span className="font-medium">"{searchQuery}"</span>
                  </p>
                )}
              </div>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Hapus Semua Filter
                </Button>
              )}
            </div>

            {/* Content Area */}
            {isFilteredEmpty ? (
              /* Filtered Empty State */
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8 sm:p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada artikel ditemukan</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery
                      ? `Tidak ada hasil untuk "${searchQuery}". Coba kata kunci lain atau ubah filter.`
                      : "Coba ubah filter yang Anda gunakan untuk melihat hasil lainnya."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    {searchQuery && (
                      <Button
                        variant="outline"
                        onClick={() => setSearchQuery("")}
                        className="border-gray-200 hover:bg-gray-50"
                      >
                        Hapus Pencarian
                      </Button>
                    )}
                    <Button onClick={clearAllFilters} className="bg-teal-600 hover:bg-teal-700 text-white">
                      Tampilkan Semua Artikel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Enhanced Articles List */
              <div className="space-y-4">
                {filteredAndSortedArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                    onClick={() => handleArticleClick(article.id)}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Article Icon */}
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white rounded-lg shadow-sm border flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600" />
                          </div>
                        </div>

                        {/* Article Content */}
                        <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                          {/* Title and Featured Badge */}
                          <div className="flex items-start gap-2">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 group-hover:text-teal-700 transition-colors leading-tight flex-1">
                              {highlightSearchTerm(article.title, searchQuery)}
                            </h3>
                            {article.featured && (
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                                Unggulan
                              </Badge>
                            )}
                          </div>

                          {/* Meta Information */}
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {article.readTime}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {article.publishDate}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {highlightSearchTerm(article.author, searchQuery)}
                            </span>
                          </div>

                          {/* Category and Difficulty Badges */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${article.categoryColor}`}
                            >
                              <Tag className="h-3 w-3" />
                              {highlightSearchTerm(article.category, searchQuery)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {article.difficulty.charAt(0).toUpperCase() + article.difficulty.slice(1)}
                            </Badge>
                          </div>

                          {/* Article Snippet with Search Highlighting */}
                          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                            {highlightSearchTerm(article.snippet, searchQuery)}
                          </p>

                          {/* Tags */}
                          {article.tags && article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {article.tags.slice(0, 4).map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200"
                                >
                                  {highlightSearchTerm(tag, searchQuery)}
                                </Badge>
                              ))}
                              {article.tags.length > 4 && (
                                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                  +{article.tags.length - 4}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Load More Button */}
                {filteredAndSortedArticles.length >= 8 && (
                  <div className="text-center pt-4">
                    <Button variant="outline" className="border-gray-200 hover:bg-gray-50 bg-transparent">
                      Muat Lebih Banyak Artikel
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
