"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Home, Search, History, PenTool, Heart, Moon, Target, ArrowRight } from "lucide-react"
import Link from "next/link"

const popularPages = [
  {
    title: "Dasbor",
    description: "Kembali ke halaman utama Anda",
    href: "/dashboard",
    icon: Home,
    color: "bg-teal-50 text-teal-600 border-teal-200",
  },
  {
    title: "Buat Entri Baru",
    description: "Mulai menulis jurnal baru",
    href: "/journal/new",
    icon: PenTool,
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    title: "Riwayat Catatan",
    description: "Lihat semua catatan Anda",
    href: "/history",
    icon: History,
    color: "bg-purple-50 text-purple-600 border-purple-200",
  },
]

const journalTypes = [
  {
    title: "Jurnal Harian",
    description: "Refleksikan hari Anda",
    href: "/journal/daily",
    icon: BookOpen,
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    title: "Jurnal Syukur",
    description: "Fokus pada hal-hal positif",
    href: "/journal/gratitude",
    icon: Heart,
    color: "bg-pink-50 text-pink-600 border-pink-200",
  },
  {
    title: "Jurnal Mimpi",
    description: "Catat perjalanan malam Anda",
    href: "/journal/dream",
    icon: Moon,
    color: "bg-purple-50 text-purple-600 border-purple-200",
  },
  {
    title: "Jurnal Bullet",
    description: "Atur tugas dan tujuan",
    href: "/journal/bullet",
    icon: Target,
    color: "bg-teal-50 text-teal-600 border-teal-200",
  },
]

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // In a real app, this would redirect to search results
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-teal-600 transition-colors">
              RuangPena
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Kembali ke Dasbor
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1" role="main">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {/* 404 Section */}
          <div className="text-center mb-12 sm:mb-16">
            {/* 404 Icon */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-teal-600" aria-hidden="true" />
            </div>

            {/* 404 Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-4 sm:mb-6">
              404 - Halaman Tidak Ditemukan
            </h1>

            {/* Explanation */}
            <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
              Halaman yang Anda cari mungkin telah dipindahkan, namanya diubah, atau sementara tidak tersedia. Mari kita
              bantu Anda menemukan apa yang Anda butuhkan.
            </p>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 sm:mb-16">
              <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-base">
                <Link href="/dashboard">
                  <Home className="w-4 h-4 mr-2" />
                  Kembali ke Dasbor
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-gray-200 hover:bg-gray-50 bg-transparent px-8 py-3 text-base"
              >
                <Link href="/">
                  Ke Halaman Utama
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Search Section */}
          <div className="mb-12 sm:mb-16">
            <Card className="border-0 shadow-sm max-w-2xl mx-auto">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2">Cari Apa yang Anda Butuhkan</h2>
                  <p className="text-gray-600">Gunakan pencarian untuk menemukan catatan atau halaman yang Anda cari</p>
                </div>

                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Cari catatan, halaman, atau konten..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-base"
                      aria-label="Kolom pencarian"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 text-base"
                    disabled={!searchQuery.trim()}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Cari Sekarang
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Popular Pages Section */}
          <div className="mb-12 sm:mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mb-4">Halaman Populer</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Berikut adalah beberapa halaman yang sering dikunjungi yang mungkin Anda cari
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {popularPages.map((page, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer"
                >
                  <Link href={page.href} className="block">
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 border ${page.color} group-hover:scale-110 transition-transform duration-200`}
                      >
                        <page.icon className="w-6 h-6" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">
                        {page.title}
                      </h3>
                      <p className="text-sm text-gray-600">{page.description}</p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>

          {/* Journal Types Section */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mb-4">Mulai Menulis Jurnal</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Atau mungkin Anda ingin memulai perjalanan refleksi dengan salah satu jenis jurnal ini
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {journalTypes.map((type, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer"
                >
                  <Link href={type.href} className="block">
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 border ${type.color} group-hover:scale-110 transition-transform duration-200`}
                      >
                        <type.icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <h3 className="text-base font-medium text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">
                        {type.title}
                      </h3>
                      <p className="text-xs text-gray-600">{type.description}</p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-16 sm:mt-20 text-center">
            <Card className="border-0 shadow-sm bg-teal-50 max-w-2xl mx-auto">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-3">Masih Butuh Bantuan?</h3>
                <p className="text-gray-600 mb-6">
                  Jika Anda masih tidak dapat menemukan apa yang Anda cari, jangan ragu untuk menghubungi tim dukungan
                  kami.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    asChild
                    variant="outline"
                    className="border-teal-200 hover:bg-teal-100 bg-transparent text-teal-700"
                  >
                    <Link href="/help">Pusat Bantuan</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-teal-200 hover:bg-teal-100 bg-transparent text-teal-700"
                  >
                    <Link href="/contact">Hubungi Kami</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-16 sm:mt-20" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Link href="/" className="text-lg font-semibold text-gray-900 hover:text-teal-600 transition-colors">
              RuangPena
            </Link>
            <p className="text-gray-500 mt-2 text-sm">© {new Date().getFullYear()} RuangPena. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
