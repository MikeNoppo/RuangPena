import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getUserById, updateUser } from '@/lib/database-prisma'
import { verifyPassword, hashPassword } from '@/lib/auth'
import { ApiResponse } from '@/lib/types'
import bcrypt from 'bcryptjs'

interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
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

    const body: ChangePasswordRequest = await request.json()
    const { currentPassword, newPassword } = body

    // Validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json({
        success: false,
        message: 'Kata sandi saat ini dan kata sandi baru wajib diisi'
      } as ApiResponse, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({
        success: false,
        message: 'Kata sandi baru harus minimal 8 karakter'
      } as ApiResponse, { status: 400 })
    }

    // Get user from database
    const user = await getUserById(decoded.userId)
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User tidak ditemukan'
      } as ApiResponse, { status: 404 })
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({
        success: false,
        message: 'Kata sandi saat ini tidak benar'
      } as ApiResponse, { status: 400 })
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword)

    // Update password in database
    await updateUser(decoded.userId, {
      password: hashedNewPassword
    })

    return NextResponse.json({
      success: true,
      message: 'Kata sandi berhasil diubah'
    } as ApiResponse, { status: 200 })

  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    } as ApiResponse, { status: 500 })
  }
}
