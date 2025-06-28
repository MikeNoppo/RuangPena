import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getUserById, deleteUser } from '@/lib/database-prisma'
import { verifyPassword } from '@/lib/auth'
import { ApiResponse } from '@/lib/types'

interface DeleteAccountRequest {
  password: string
}

export async function DELETE(request: NextRequest) {
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

    const body: DeleteAccountRequest = await request.json()
    const { password } = body

    // Validation
    if (!password) {
      return NextResponse.json({
        success: false,
        message: 'Kata sandi wajib diisi untuk konfirmasi'
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

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: 'Kata sandi salah'
      } as ApiResponse, { status: 400 })
    }

    // Delete user (this will also delete all journals due to CASCADE)
    await deleteUser(decoded.userId)

    return NextResponse.json({
      success: true,
      message: 'Akun berhasil dihapus'
    } as ApiResponse, { status: 200 })

  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    } as ApiResponse, { status: 500 })
  }
}
