"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { BookOpen, Heart, Target, Moon, Plus } from "lucide-react"

// Mock user data
const user = {
  name: "Sarah",
  lastEntry: "2 hari yang lalu",
  totalEntries: 47,
}

// Dashboard shortcuts
const shortcuts = [
  {
    title: "Mulai Jurnal Harian Anda",
    description: "Refleksikan hari Anda dan tuangkan pikiran Anda",
    icon: BookOpen,
    color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
    iconColor: "text-blue-600",
    href: "/journal/daily",
  },
  {
    title: "Tulis Entri Syukur",
    description: "Fokus pada hal-hal yang Anda syukuri hari ini",
    icon: Heart,
    color: "bg-pink-50 hover:bg-pink-100 border-pink-200",
    iconColor: "text-pink-600",
    href: "/journal/gratitude",
  },
  {
    title: "Buat Jurnal Bullet",
    description: "Atur tugas dan tujuan Anda dengan penuh kesadaran",
    icon: Target,
    color: "bg-teal-50 hover:bg-teal-100 border-teal-200",
    iconColor: "text-teal-600",
    href: "/journal/bullet",
  },
  {
    title: "Catat Mimpi",
    description: "Rekam dan jelajahi perjalanan malam Anda",
    icon: Moon,
    color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
    iconColor: "text-purple-600",
    href: "/journal/dream",
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
  const [greeting, setGreeting] = useState("Selamat Pagi")

  useEffect(() => {
    setGreeting(getGreeting())
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-100 px-4 sm:px-6">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <div className="text-xs sm:text-sm text-gray-600">
              Entri terakhir: <span className="font-medium">{user.lastEntry}</span>
            </div>
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-xs sm:text-sm">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Entri Cepat</span>
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
                {greeting}, {user.name}!
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
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{user.totalEntries}</p>
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
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">5</p>
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
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">12 hari</p>
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
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium text-gray-900">Entri Jurnal Harian</p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          Merefleksikan tantangan dan pertumbuhan hari ini
                        </p>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">2 hari lalu</p>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 bg-pink-100 rounded-full flex items-center justify-center">
                        <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium text-gray-900">Entri Syukur</p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          Mencatat tiga hal yang saya syukuri hari ini
                        </p>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">3 hari lalu</p>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium text-gray-900">Jurnal Mimpi</p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          Merekam mimpi yang jelas tentang terbang
                        </p>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">5 hari lalu</p>
                    </div>
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
