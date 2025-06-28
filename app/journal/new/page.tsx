"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import { CreateJournalRequest, ApiResponse, JournalEntry } from "@/lib/types"
import { JournalType } from "@prisma/client"

export default function NewJournalEntry() {
  const { user, token } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [journalType, setJournalType] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  // Set initial journal type from query parameter
  useEffect(() => {
    const typeFromQuery = searchParams.get('type')
    if (typeFromQuery && Object.values(JournalType).includes(typeFromQuery as JournalType)) {
      setJournalType(typeFromQuery)
    }
  }, [searchParams])

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/auth')
    }
  }, [user, router])

  const handleSave = async () => {
    if (!content.trim()) {
      setError("Konten jurnal wajib diisi")
      return
    }

    if (!journalType) {
      setError("Mohon pilih jenis jurnal")
      return
    }

    if (!token) {
      setError("Sesi telah berakhir, silakan login kembali")
      return
    }

    setIsSaving(true)
    setError("")

    try {
      const requestData: CreateJournalRequest = {
        title: title.trim() || null,
        content: content.trim(),
        type: journalType as JournalType,
        tags: [] // We can add tag extraction later
      }

      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData),
      })

      const data: ApiResponse<JournalEntry> = await response.json()

      if (data.success) {
        // Redirect to journal history or dashboard
        router.push('/history')
      } else {
        setError(data.message || 'Gagal menyimpan jurnal')
      }
    } catch (error) {
      setError('Terjadi kesalahan jaringan')
    } finally {
      setIsSaving(false)
    }
  }

  const getPlaceholderText = () => {
    switch (journalType) {
      case JournalType.DAILY:
        return "Bagaimana hari Anda? Pikiran, perasaan, atau pengalaman apa yang ingin Anda tuangkan?"
      case JournalType.GRATITUDE:
        return "Apa yang Anda syukuri hari ini? Luangkan waktu untuk menghargai hal-hal baik dalam hidup Anda..."
      case JournalType.DREAM:
        return "Ceritakan mimpi Anda dengan detail sebanyak yang Anda ingat. Apa yang Anda lihat, rasakan, atau alami?"
      case JournalType.BULLET:
        return "Buat daftar bullet points untuk hari ini. Gunakan • untuk tugas, ★ untuk prioritas, dan → untuk catatan..."
      default:
        return "Mulai tulis pikiran Anda di sini..."
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <svg
              className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Kembali</span>
          </button>
        </div>

        {/* Header Area */}
        <div className="space-y-6 mb-12">
          {/* Error Display */}
          {error && (
            <div className="p-4 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <span className="text-red-500">⚠</span>
                {error}
              </p>
            </div>
          )}

          {/* Journal Type Selector */}
          <div className="w-48">
            <Select value={journalType} onValueChange={setJournalType}>
              <SelectTrigger className="border-0 border-b border-gray-200 rounded-none px-0 focus:ring-0 focus:border-gray-400 bg-transparent">
                <SelectValue placeholder="Pilih jenis jurnal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={JournalType.DAILY}>Jurnal Harian</SelectItem>
                <SelectItem value={JournalType.GRATITUDE}>Jurnal Syukur</SelectItem>
                <SelectItem value={JournalType.DREAM}>Jurnal Mimpi</SelectItem>
                <SelectItem value={JournalType.BULLET}>Jurnal Bullet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title Input */}
          <div>
            <Input
              type="text"
              placeholder="Judul entri (opsional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-0 border-b border-gray-200 rounded-none px-0 text-xl font-light placeholder:text-gray-400 focus:ring-0 focus:border-gray-400 bg-transparent whitespace-normal break-words overflow-wrap-anywhere min-h-[2.5rem]"
              style={{
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                lineHeight: "1.4",
              }}
            />
          </div>
        </div>

        {/* Writing Area */}
        <div className="relative">
          <Textarea
            placeholder={getPlaceholderText()}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[60vh] border-0 resize-none text-lg leading-relaxed placeholder:text-gray-400 focus:ring-0 focus:outline-none bg-transparent p-0"
            style={{
              fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
              lineHeight: "1.8",
            }}
          />
        </div>

        {/* Save Button */}
        <div className="fixed bottom-8 right-8">
          <Button
            onClick={handleSave}
            disabled={!content.trim() || isSaving}
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-base font-medium shadow-lg disabled:opacity-50"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Menyimpan...
              </div>
            ) : (
              "Simpan Entri"
            )}
          </Button>
        </div>

        {/* Word Count (subtle) */}
        {content && (
          <div className="fixed bottom-8 left-8 text-sm text-gray-400">
            {
              content
                .trim()
                .split(/\s+/)
                .filter((word) => word.length > 0).length
            }{" "}
            kata
          </div>
        )}
      </div>
    </div>
  )
}
