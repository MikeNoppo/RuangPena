import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail } from '@/lib/database'
import { verifyPassword, generateToken, validateEmail } from '@/lib/auth'
import { LoginRequest, AuthResponse } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    const { email, password } = body

    // Basic validation
    const emailError = validateEmail(email)
    if (emailError) {
      return NextResponse.json({
        success: false,
        message: emailError
      } as AuthResponse, { status: 400 })
    }

    if (!password) {
      return NextResponse.json({
        success: false,
        message: 'Kata sandi wajib diisi'
      } as AuthResponse, { status: 400 })
    }

    // Find user
    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Email atau kata sandi salah'
      } as AuthResponse, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.hashedPassword)
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: 'Email atau kata sandi salah'
      } as AuthResponse, { status: 401 })
    }

    // Generate token
    const token = generateToken(user.id)

    // Return success response without password
    const { hashedPassword: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: 'Login berhasil',
      user: userWithoutPassword,
      token
    } as AuthResponse, { status: 200 })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    } as AuthResponse, { status: 500 })
  }
}
