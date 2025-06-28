import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getUserById, updateUser } from '@/lib/database-prisma'
import { ApiResponse } from '@/lib/types'

interface UpdateProfileRequest {
  name?: string
}

export async function PUT(request: NextRequest) {
  try {
    // Get user from token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized'
      } as ApiResponse, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded?.userId) {
      return NextResponse.json({
        success: false,
        message: 'Invalid token'
      } as ApiResponse, { status: 401 })
    }

    const body: UpdateProfileRequest = await request.json()
    const { name } = body

    // Validation
    if (name !== undefined) {
      if (!name.trim()) {
        return NextResponse.json({
          success: false,
          message: 'Nama pengguna wajib diisi'
        } as ApiResponse, { status: 400 })
      }

      if (name.trim().length < 2) {
        return NextResponse.json({
          success: false,
          message: 'Nama pengguna harus minimal 2 karakter'
        } as ApiResponse, { status: 400 })
      }
    }

    // Get user from database to verify existence
    const user = await getUserById(decoded.userId)
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User tidak ditemukan'
      } as ApiResponse, { status: 404 })
    }

    // Update user in database
    const updatedUser = await updateUser(decoded.userId, {
      name: name?.trim()
    })

    // Return updated user data without password
    const { password: _, ...userWithoutPassword } = updatedUser

    return NextResponse.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: userWithoutPassword
    } as ApiResponse, { status: 200 })

  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    } as ApiResponse, { status: 500 })
  }
}
