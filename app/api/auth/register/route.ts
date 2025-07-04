import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, createUser } from '@/lib/database-prisma'
import { hashPassword, validateEmail, validatePassword, generateToken } from '@/lib/auth'
import { RegisterRequest, AuthResponse } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json()
    const { email, password, confirmPassword, name } = body

    // Validation
    const emailError = validateEmail(email)
    if (emailError) {
      return NextResponse.json({
        success: false,
        message: emailError
      } as AuthResponse, { status: 400 })
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      return NextResponse.json({
        success: false,
        message: passwordError
      } as AuthResponse, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({
        success: false,
        message: 'Konfirmasi kata sandi tidak cocok'
      } as AuthResponse, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'Email sudah terdaftar'
      } as AuthResponse, { status: 409 })
    }

    // Create new user
    const hashedPassword = await hashPassword(password)
    const newUser = await createUser({
      email,
      password: hashedPassword,
      name: name || undefined
    })

    // Generate token
    const token = generateToken(newUser.id)

    // Return success response without password
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      success: true,
      message: 'Akun berhasil dibuat',
      user: userWithoutPassword,
      token
    } as AuthResponse, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    } as AuthResponse, { status: 500 })
  }
}
