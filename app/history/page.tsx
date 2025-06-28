"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { EmptyState } from "@/components/empty-state"
import { SkeletonLoader } from "@/components/skeleton-loader"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { JournalEntry, ApiResponse } from "@/lib/types"
import { cn } from "@/lib/utils"
import { BookOpen, Heart, Moon, Target, Search, Filter, X, SortAsc, SortDesc } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

type SortOption = "date-desc" | "date-asc" | "title-asc" | "title-desc"

export default function HistoryPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [sortBy, setSortBy] = useState<SortOption>("date-desc")

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/auth')
      return
    }
    
    fetchJournals()
  }, [user, router, token])

  const fetchJournals = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/journal', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data: ApiResponse<JournalEntry[]> = await response.json()
      
      if (data.success && data.data) {
        setJournalEntries(data.data)
      } else {
        setError(data.message || 'Gagal memuat jurnal')
      }
    } catch (error) {
      setError('Terjadi kesalahan jaringan')
    } finally {
      setLoading(false)
    }
  }

  // Get icon and colors for journal types
  const getJournalTypeInfo = (type: string) => {
    switch (type.toUpperCase()) {
      case 'DAILY':
        return {
          icon: BookOpen,
          color: "bg-blue-100 text-blue-700 border-blue-200",
          iconColor: "text-blue-600"
        }
      case 'GRATITUDE':
        return {
          icon: Heart,
          color: "bg-pink-100 text-pink-700 border-pink-200",
          iconColor: "text-pink-600"
        }
      case 'DREAM':
        return {
          icon: Moon,
          color: "bg-purple-100 text-purple-700 border-purple-200",
          iconColor: "text-purple-600"
        }
      case 'BULLET':
        return {
          icon: Target,
          color: "bg-teal-100 text-teal-700 border-teal-200",
          iconColor: "text-teal-600"
        }
      default:
        return {
          icon: BookOpen,
          color: "bg-gray-100 text-gray-700 border-gray-200",
          iconColor: "text-gray-600"
        }
    }
  }

  // Filter and sort journals
  const filteredAndSortedJournals = useMemo(() => {
    let filtered = journalEntries

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        entry =>
          (entry.title?.toLowerCase() || '').includes(query) ||
          entry.content.toLowerCase().includes(query) ||
          entry.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(entry => entry.type === filterType.toUpperCase())
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "date-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "title-asc":
          return (a.title || '').localeCompare(b.title || '')
        case "title-desc":
          return (b.title || '').localeCompare(a.title || '')
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return filtered
  }, [journalEntries, searchQuery, filterType, sortBy])

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("")
    setFilterType("all")
    setSortBy("date-desc")
  }

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (searchQuery.trim()) count++
    if (filterType !== "all") count++
    return count
  }, [searchQuery, filterType])

  const hasActiveFilters = searchQuery || filterType !== "all"

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

  // Check if this is truly empty (no entries at all) vs filtered empty
  const isCompletelyEmpty = journalEntries.length === 0 && !loading
  const isFilteredEmpty = filteredAndSortedJournals.length === 0 && journalEntries.length > 0 && !loading

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-full flex-col">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-100 px-4 sm:px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-medium text-gray-900">Riwayat Catatan Anda</h1>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4 sm:p-6">
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
              {/* Only show page title and filters if not loading and not completely empty */}
              {!loading && !isCompletelyEmpty && (
                <>

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
                                filterType !== "all" && "Tipe",
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
                              placeholder="Cari di dalam catatan..."
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

                          {/* Journal Type Filter */}
                          <div>
                            <Select value={filterType} onValueChange={setFilterType}>
                              <SelectTrigger className="h-10 sm:h-11 border-gray-200 focus:border-teal-500 focus:ring-teal-500">
                                <SelectValue placeholder="Semua Tipe" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Semua Tipe</SelectItem>
                                <SelectItem value="DAILY">Jurnal Harian</SelectItem>
                                <SelectItem value="GRATITUDE">Jurnal Syukur</SelectItem>
                                <SelectItem value="DREAM">Jurnal Mimpi</SelectItem>
                                <SelectItem value="BULLET">Jurnal Bullet</SelectItem>
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
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Results Summary */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        Menampilkan <span className="font-medium">{filteredAndSortedJournals.length}</span> dari{" "}
                        <span className="font-medium">{journalEntries.length}</span> catatan
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
                </>
              )}

              {/* Content Area */}
              {loading ? (
                /* Loading State */
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="h-8 sm:h-9 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    <div className="h-5 sm:h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 sm:p-6">
                      <div className="space-y-4">
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                          <div className="lg:col-span-2 h-10 sm:h-11 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-10 sm:h-11 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-10 sm:h-11 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <SkeletonLoader key={i} />
                    ))}
                  </div>
                </div>
              ) : error ? (
                /* Error State */
                <div className="p-4 rounded-md bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <span className="text-red-500">⚠</span>
                    {error}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchJournals}
                    className="mt-2"
                  >
                    Coba Lagi
                  </Button>
                </div>
              ) : isCompletelyEmpty ? (
                /* Complete Empty State */
                <EmptyState
                  title="Belum ada jurnal"
                  description="Mulai perjalanan refleksi Anda dengan menulis jurnal pertama."
                  buttonText="Tulis Jurnal Pertama"
                  buttonHref="/journal/new"
                />
              ) : isFilteredEmpty ? (
                /* Filtered Empty State */
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-8 sm:p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada catatan ditemukan</h3>
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
                        Tampilkan Semua Catatan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* Enhanced Journal Entries List */
                <div className="space-y-4">
                  {filteredAndSortedJournals.map((entry) => {
                    const typeInfo = getJournalTypeInfo(entry.type)
                    const Icon = typeInfo.icon

                    return (
                      <Card
                        key={entry.id}
                        className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                        onClick={() => router.push(`/journal/${entry.id}`)}
                      >
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-start gap-3 sm:gap-4">
                            {/* Journal Type Icon */}
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white rounded-lg shadow-sm border flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${typeInfo.iconColor}`} />
                              </div>
                            </div>

                            {/* Entry Content */}
                            <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                              {/* Title and Date */}
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                                <h3 className="text-base sm:text-lg font-medium text-gray-900 group-hover:text-teal-700 transition-colors">
                                  {highlightSearchTerm(entry.title || 'Tanpa Judul', searchQuery)}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                                  {format(new Date(entry.createdAt), 'dd MMMM yyyy • HH:mm', { locale: id })}
                                </p>
                              </div>

                              {/* Journal Type Badge */}
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${typeInfo.color}`}
                                >
                                  <Icon className="h-3 w-3" />
                                  {entry.typeName}
                                </span>
                              </div>

                              {/* Content Preview with Search Highlighting */}
                              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                {highlightSearchTerm(entry.content, searchQuery)}
                              </p>

                              {/* Tags */}
                              {entry.tags && entry.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {entry.tags.slice(0, 3).map((tag, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    >
                                      {highlightSearchTerm(tag, searchQuery)}
                                    </Badge>
                                  ))}
                                  {entry.tags.length > 3 && (
                                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                      +{entry.tags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}

                  {/* Load More Button (if needed) */}
                  {filteredAndSortedJournals.length >= 10 && (
                    <div className="text-center pt-4">
                      <Button variant="outline" className="border-gray-200 hover:bg-gray-50 bg-transparent">
                        Muat Lebih Banyak
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}