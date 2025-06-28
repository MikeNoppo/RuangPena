"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { EmptyState } from "@/components/empty-state"
import { SkeletonLoader } from "@/components/skeleton-loader"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { JournalEntry, ApiResponse } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useCalendarData } from "@/hooks/use-calendar"
import { BookOpen, Heart, Moon, Target, Search, CalendarIcon, Filter, X, SortAsc, SortDesc } from "lucide-react"
import { format, isSameDay } from "date-fns"
import { id } from "date-fns/locale"

export default function HistoryPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [showCalendar, setShowCalendar] = useState(false)
  const [hoveredDate, setHoveredDate] = useState<Date | undefined>(undefined)

  // Use calendar data hook
  const { hasJournalEntry, getJournalCountForDate, formatCalendarDate } = useCalendarData(journalEntries)

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
    switch (type) {
      case 'daily':
        return {
          icon: BookOpen,
          color: "bg-blue-100 text-blue-700 border-blue-200",
          iconColor: "text-blue-600"
        }
      case 'gratitude':
        return {
          icon: Heart,
          color: "bg-pink-100 text-pink-700 border-pink-200",
          iconColor: "text-pink-600"
        }
      case 'dream':
        return {
          icon: Moon,
          color: "bg-purple-100 text-purple-700 border-purple-200",
          iconColor: "text-purple-600"
        }
      case 'bullet':
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
      filtered = filtered.filter(entry => entry.type === filterType)
    }

    // Filter by date
    if (selectedDate) {
      const selectedDateStr = format(selectedDate, 'yyyy-MM-dd')
      filtered = filtered.filter(entry => {
        const entryDate = format(new Date(entry.createdAt), 'yyyy-MM-dd')
        return entryDate === selectedDateStr
      })
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB
    })

    return filtered
  }, [journalEntries, searchQuery, filterType, selectedDate, sortOrder])

  // Prepare date indicators for calendar
  const dateIndicators = useMemo(() => {
    const indicators: Record<string, number> = {}
    journalEntries.forEach(entry => {
      const dateKey = formatCalendarDate(new Date(entry.createdAt))
      indicators[dateKey] = (indicators[dateKey] || 0) + 1
    })
    return indicators
  }, [journalEntries, formatCalendarDate])

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("")
    setFilterType("all")
    setSelectedDate(undefined)
    setSortOrder("desc")
    setShowCalendar(false)
  }

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (searchQuery.trim()) count++
    if (filterType !== "all") count++
    if (selectedDate) count++
    return count
  }, [searchQuery, filterType, selectedDate])

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-full flex-col">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 px-4">
              <BookOpen className="h-6 w-6 text-teal-600" />
              <h1 className="text-xl font-semibold">Riwayat Jurnal</h1>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Search and Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Cari berdasarkan judul, konten, atau tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>

                {/* Filter Controls */}
                <div className="flex gap-2">
                  {/* Type Filter */}
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Jenis</SelectItem>
                      <SelectItem value="daily">Jurnal Harian</SelectItem>
                      <SelectItem value="gratitude">Jurnal Syukur</SelectItem>
                      <SelectItem value="dream">Jurnal Mimpi</SelectItem>
                      <SelectItem value="bullet">Jurnal Bullet</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Date Filter */}
                  <div className="flex items-center gap-1">
                    <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-40 justify-start text-left font-normal transition-all duration-200",
                            selectedDate 
                              ? "bg-teal-50 border-teal-300 text-teal-700 hover:bg-teal-100" 
                              : "hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, 'dd MMM yyyy', { locale: id }) : 'Pilih tanggal'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-0 shadow-lg bg-transparent" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date)
                            setShowCalendar(false)
                          }}
                          onDateHover={setHoveredDate}
                          dateIndicators={dateIndicators}
                          initialFocus
                        />
                        {hoveredDate && dateIndicators[formatCalendarDate(hoveredDate)] > 0 && (
                          <div className="p-3 bg-white border-t border-gray-100 text-sm text-gray-600 rounded-b-lg">
                            <div className="font-medium text-gray-900">
                              {format(hoveredDate, 'dd MMMM yyyy', { locale: id })}
                            </div>
                            <div className="text-xs text-teal-600 flex items-center gap-1 mt-1">
                              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                              {dateIndicators[formatCalendarDate(hoveredDate)]} entri jurnal
                            </div>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                    {selectedDate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDate(undefined)}
                        className="px-2 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        title="Hapus filter tanggal"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {/* Sort Order */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                    className="px-3"
                  >
                    {sortOrder === "desc" ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                  </Button>

                  {/* Clear Filters */}
                  {activeFilterCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="px-3"
                    >
                      <X className="h-4 w-4" />
                      Bersihkan ({activeFilterCount})
                    </Button>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonLoader key={i} />
                  ))}
                </div>
              )}

              {/* Error State */}
              {error && (
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
              )}

              {/* Results Count */}
              {!loading && !error && (
                <div className="text-sm text-gray-600">
                  Menampilkan {filteredAndSortedJournals.length} dari {journalEntries.length} entri jurnal
                </div>
              )}

              {/* Journal Entries */}
              {!loading && !error && (
                <div className="space-y-4">
                  {filteredAndSortedJournals.length === 0 ? (
                    <EmptyState
                      title={journalEntries.length === 0 ? "Belum ada jurnal" : "Tidak ada hasil"}
                      description={
                        journalEntries.length === 0
                          ? "Mulai perjalanan refleksi Anda dengan menulis jurnal pertama."
                          : "Coba ubah filter atau kata kunci pencarian Anda."
                      }
                      buttonText={journalEntries.length === 0 ? "Tulis Jurnal Pertama" : undefined}
                      buttonHref={journalEntries.length === 0 ? "/journal/new" : undefined}
                    />
                  ) : (
                    filteredAndSortedJournals.map((entry) => {
                      const typeInfo = getJournalTypeInfo(entry.type)
                      const Icon = typeInfo.icon

                      return (
                        <Card
                          key={entry.id}
                          className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-teal-500 cursor-pointer"
                          onClick={() => router.push(`/journal/${entry.id}`)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className={`p-2 rounded-lg ${typeInfo.color}`}>
                                    <Icon className={`h-4 w-4 ${typeInfo.iconColor}`} />
                                  </div>
                                  <div className="flex-1">
                                    <Badge variant="secondary" className={`${typeInfo.color} border text-xs`}>
                                      {entry.typeName}
                                    </Badge>
                                    <p className="text-sm text-gray-500 mt-1">
                                      {format(new Date(entry.createdAt), 'dd MMMM yyyy • HH:mm', { locale: id })}
                                    </p>
                                  </div>
                                </div>

                                <h3 className="font-medium text-gray-900 mb-2 line-clamp-1">
                                  {entry.title || 'Tanpa Judul'}
                                </h3>

                                <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed mb-3">
                                  {entry.content}
                                </p>

                                {entry.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {entry.tags.slice(0, 3).map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="outline"
                                        className="text-xs text-gray-600 bg-gray-50"
                                      >
                                        #{tag}
                                      </Badge>
                                    ))}
                                    {entry.tags.length > 3 && (
                                      <Badge variant="outline" className="text-xs text-gray-600 bg-gray-50">
                                        +{entry.tags.length - 3} lagi
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
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