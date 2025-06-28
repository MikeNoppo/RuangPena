import { NextRequest, NextResponse } from 'next/server'
import { getJournalById, updateJournal, deleteJournal } from '@/lib/database'
import { verifyToken } from '@/lib/auth'
import { UpdateJournalRequest, ApiResponse, JournalEntry, JOURNAL_TYPES } from '@/lib/types'

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

// GET /api/journal/[id] - Get specific journal entry
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserFromToken(request)
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized'
      } as ApiResponse, { status: 401 })
    }

    const journal = await getJournalById(params.id)
    if (!journal) {
      return NextResponse.json({
        success: false,
        message: 'Jurnal tidak ditemukan'
      } as ApiResponse, { status: 404 })
    }

    // Check if journal belongs to user
    if (journal.userId !== userId) {
      return NextResponse.json({
        success: false,
        message: 'Forbidden'
      } as ApiResponse, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      message: 'Journal retrieved successfully',
      data: journal
    } as ApiResponse<JournalEntry>, { status: 200 })

  } catch (error) {
    console.error('Get journal error:', error)
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    } as ApiResponse, { status: 500 })
  }
}

// PUT /api/journal/[id] - Update journal entry
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserFromToken(request)
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized'
      } as ApiResponse, { status: 401 })
    }

    const journal = await getJournalById(params.id)
    if (!journal) {
      return NextResponse.json({
        success: false,
        message: 'Jurnal tidak ditemukan'
      } as ApiResponse, { status: 404 })
    }

    // Check if journal belongs to user
    if (journal.userId !== userId) {
      return NextResponse.json({
        success: false,
        message: 'Forbidden'
      } as ApiResponse, { status: 403 })
    }

    const body: UpdateJournalRequest = await request.json()
    const { title, content, type, tags } = body

    // Validation
    if (content !== undefined && !content.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Konten jurnal tidak boleh kosong'
      } as ApiResponse, { status: 400 })
    }

    if (type !== undefined && !Object.keys(JOURNAL_TYPES).includes(type)) {
      return NextResponse.json({
        success: false,
        message: 'Tipe jurnal tidak valid'
      } as ApiResponse, { status: 400 })
    }

    // Prepare updates
    const updates: Partial<JournalEntry> = {}
    if (title !== undefined) updates.title = title.trim()
    if (content !== undefined) updates.content = content.trim()
    if (type !== undefined) {
      updates.type = type
      updates.typeName = JOURNAL_TYPES[type]
    }
    if (tags !== undefined) updates.tags = tags.filter(tag => tag.trim()).map(tag => tag.trim())

    await updateJournal(params.id, updates)

    // Get updated journal
    const updatedJournal = await getJournalById(params.id)

    return NextResponse.json({
      success: true,
      message: 'Jurnal berhasil diperbarui',
      data: updatedJournal
    } as ApiResponse<JournalEntry>, { status: 200 })

  } catch (error) {
    console.error('Update journal error:', error)
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    } as ApiResponse, { status: 500 })
  }
}

// DELETE /api/journal/[id] - Delete journal entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserFromToken(request)
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized'
      } as ApiResponse, { status: 401 })
    }

    const journal = await getJournalById(params.id)
    if (!journal) {
      return NextResponse.json({
        success: false,
        message: 'Jurnal tidak ditemukan'
      } as ApiResponse, { status: 404 })
    }

    // Check if journal belongs to user
    if (journal.userId !== userId) {
      return NextResponse.json({
        success: false,
        message: 'Forbidden'
      } as ApiResponse, { status: 403 })
    }

    await deleteJournal(params.id)

    return NextResponse.json({
      success: true,
      message: 'Jurnal berhasil dihapus'
    } as ApiResponse, { status: 200 })

  } catch (error) {
    console.error('Delete journal error:', error)
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    } as ApiResponse, { status: 500 })
  }
}
