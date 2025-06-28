"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { BookOpen, Heart, Target, Moon, Plus } from "lucide-react"
import { JournalEntry, ApiResponse } from "@/lib/types"
import { JournalType } from "@prisma/client"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { SkeletonLoader } from "@/components/skeleton-loader"

// Dashboard shortcuts
const shortcuts = [
  {
    title: "Mulai Jurnal Harian Anda",
    description: "Refleksikan hari Anda dan tuangkan pikiran Anda",
    icon: BookOpen,
    color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
    iconColor: "text-blue-600",
    type: JournalType.DAILY,
  },
  {
    title: "Tulis Jurnal Syukur",
    description: "Fokus pada hal-hal yang Anda syukuri hari ini",
    icon: Heart,
    color: "bg-pink-50 hover:bg-pink-100 border-pink-200",
    iconColor: "text-pink-600",
    type: JournalType.GRATITUDE,
  },
  {
    title: "Buat Jurnal Bullet",
    description: "Atur tugas dan tujuan Anda dengan penuh kesadaran",
    icon: Target,
    color: "bg-teal-50 hover:bg-teal-100 border-teal-200",
    iconColor: "text-teal-600",
    type: JournalType.BULLET,
  },
  {
    title: "Catat Mimpi",
    description: "Rekam dan jelajahi perjalanan malam Anda",
    icon: Moon,
    color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
    iconColor: "text-purple-600",
    type: JournalType.DREAM,
  },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Selamat Pagi"
  if (hour < 15) return "Selamat Siang"
  if (hour < 18) return "Selamat Sore"
  return "Selamat Malam"
}

export default function Dashboard() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState("Selamat Pagi")

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth');
      } else {
        fetchJournals();
      }
    }
  }, [user, authLoading, router, token]);

  useEffect(() => {
    setGreeting(getGreeting())
  }, [])

  const fetchJournals = async () => {
    if (!token) return
    
    try {
      const response = await fetch('/api/journal', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data: ApiResponse<JournalEntry[]> = await response.json()
      
      if (data.success && data.data) {
        setJournalEntries(data.data)
      }
    } catch (error) {
      console.error('Error fetching journals:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return <SkeletonLoader />;
  }

  const getLastEntryText = () => {
    if (journalEntries.length === 0) return "Belum ada entri"
    
    const lastEntry = journalEntries[0] // Already sorted by newest first from API
    const lastEntryDate = new Date(lastEntry.createdAt)
    
    return formatDistanceToNow(lastEntryDate, { 
      addSuffix: true, 
      locale: id 
    })
  }

  const getWeeklyCount = () => {
    if (journalEntries.length === 0) return 0
    
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    return journalEntries.filter(entry => {
      const entryDate = new Date(entry.createdAt)
      return entryDate >= oneWeekAgo
    }).length
  }

  const getStreakDays = () => {
    if (journalEntries.length === 0) return 0
    
    // Sort entries by date (newest first)
    const sortedEntries = [...journalEntries].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(23, 59, 59, 999) // End of today
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.createdAt)
      const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === streak) {
        streak++
      } else if (daysDiff === streak + 1) {
        // Allow for one day gap
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  const getJournalTypeInfo = (type: JournalType) => {
    switch (type) {
      case JournalType.DAILY:
        return {
          icon: BookOpen,
          color: "bg-blue-100",
          iconColor: "text-blue-600",
          name: "Jurnal Harian"
        }
      case JournalType.GRATITUDE:
        return {
          icon: Heart,
          color: "bg-pink-100", 
          iconColor: "text-pink-600",
          name: "Jurnal Syukur"
        }
      case JournalType.DREAM:
        return {
          icon: Moon,
          color: "bg-purple-100",
          iconColor: "text-purple-600", 
          name: "Jurnal Mimpi"
        }
      case JournalType.BULLET:
        return {
          icon: Target,
          color: "bg-teal-100",
          iconColor: "text-teal-600",
          name: "Jurnal Bullet"
        }
      default:
        return {
          icon: BookOpen,
          color: "bg-gray-100",
          iconColor: "text-gray-600",
          name: "Jurnal"
        }
    }
  }

  const createNewJournal = (type: JournalType) => {
    // Redirect to new journal page with the type as query parameter
    router.push(`/journal/new?type=${type}`)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-100 px-4 sm:px-6">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <div className="text-xs sm:text-sm text-gray-600">
              Jurnal terakhir: <span className="font-medium">{loading ? "..." : getLastEntryText()}</span>
            </div>
            <Button 
              size="sm" 
              className="bg-teal-600 hover:bg-teal-700 text-xs sm:text-sm"
              onClick={() => router.push('/journal/new')}
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Tulis Jurnal</span>
              <span className="sm:hidden">Entri</span>
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-light text-gray-900">
                {greeting}, {user?.name || 'Pengguna'}!
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                Selamat datang kembali ke ruang penuh kesadaran Anda. Bagaimana Anda ingin berefleksi hari ini?
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Total Entri</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{loading ? "..." : journalEntries.length}</p>
                    </div>
                    <div className="h-10 w-10 sm:h-12 sm:w-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Minggu Ini</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{loading ? "..." : getWeeklyCount()}</p>
                    </div>
                    <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Target className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm sm:col-span-2 lg:col-span-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Beruntun</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{loading ? "..." : `${getStreakDays()} hari`}</p>
                    </div>
                    <div className="h-10 w-10 sm:h-12 sm:w-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Journal Shortcuts */}
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-medium text-gray-900">Mulai Menulis Jurnal</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {shortcuts.map((shortcut) => (
                  <Card
                    key={shortcut.title}
                    className={`border-2 ${shortcut.color} cursor-pointer transition-all duration-200 hover:shadow-md group`}
                    onClick={() => createNewJournal(shortcut.type)}
                  >
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div
                          className={`h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                        >
                          <shortcut.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${shortcut.iconColor}`} />
                        </div>
                        <div className="flex-1 space-y-1 sm:space-y-2">
                          <h3 className="text-base sm:text-lg font-medium text-gray-900 group-hover:text-gray-700">
                            {shortcut.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{shortcut.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-medium text-gray-900">Aktivitas Terkini</h2>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {loading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg animate-pulse">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                          </div>
                        ))}
                      </div>
                    ) : journalEntries.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-sm">Belum ada aktivitas jurnal</p>
                        <p className="text-xs text-gray-400 mt-1">Mulai menulis jurnal pertama Anda!</p>
                      </div>
                    ) : (
                      journalEntries.slice(0, 3).map((entry) => {
                        const typeInfo = getJournalTypeInfo(entry.type)
                        const Icon = typeInfo.icon
                        return (
                          <div 
                            key={entry.id} 
                            className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                            onClick={() => router.push(`/journal/${entry.id}`)}
                          >
                            <div className={`h-8 w-8 sm:h-10 sm:w-10 ${typeInfo.color} rounded-full flex items-center justify-center`}>
                              <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${typeInfo.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm sm:text-base font-medium text-gray-900">
                                {entry.title || typeInfo.name}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600 truncate">
                                {entry.content.substring(0, 60)}
                                {entry.content.length > 60 ? '...' : ''}
                              </p>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                              {formatDistanceToNow(new Date(entry.createdAt), { 
                                addSuffix: true, 
                                locale: id 
                              })}
                            </p>
                          </div>
                        )
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
