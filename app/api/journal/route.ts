import { NextRequest, NextResponse } from 'next/server'
import { getJournalsByUserId, createJournal, getJournalById, updateJournal, deleteJournal } from '@/lib/database-prisma'
import { verifyToken } from '@/lib/auth'
import { CreateJournalRequest, UpdateJournalRequest, ApiResponse, JournalEntry, JOURNAL_TYPES } from '@/lib/types'

// Helper function to get user from token
async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const decoded = verifyToken(token)
  return decoded?.userId || null
}

// GET /api/journal - Get all journals for authenticated user
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized'
      } as ApiResponse, { status: 401 })
    }

    const journals = await getJournalsByUserId(userId)
    
    // Sort by creation date (newest first)
    journals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({
      success: true,
      message: 'Journals retrieved successfully',
      data: journals
    } as ApiResponse<JournalEntry[]>, { status: 200 })

  } catch (error) {
    console.error('Get journals error:', error)
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    } as ApiResponse, { status: 500 })
  }
}

// POST /api/journal - Create new journal entry
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized'
      } as ApiResponse, { status: 401 })
    }

    const body: CreateJournalRequest = await request.json()
    const { title, content, type, tags = [] } = body

    // Validation
    if (!content.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Konten jurnal wajib diisi'
      } as ApiResponse, { status: 400 })
    }

    if (!type || !Object.keys(JOURNAL_TYPES).includes(type)) {
      return NextResponse.json({
        success: false,
        message: 'Tipe jurnal tidak valid'
      } as ApiResponse, { status: 400 })
    }

    // Create new journal entry
    const newJournal = await createJournal({
      userId,
      title: title?.trim() || null,
      content: content.trim(),
      type,
      tags: tags.filter(tag => tag.trim()).map(tag => tag.trim())
    })

    return NextResponse.json({
      success: true,
      message: 'Jurnal berhasil disimpan',
      data: newJournal
    } as ApiResponse<JournalEntry>, { status: 201 })

  } catch (error) {
    console.error('Create journal error:', error)
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    } as ApiResponse, { status: 500 })
  }
}
