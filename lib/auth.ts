import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// JWT token operations
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

// Password validation
export function validatePassword(password: string): string | null {
  if (!password) return 'Kata sandi wajib diisi'
  if (password.length < 8) return 'Kata sandi harus minimal 8 karakter'
  if (!/(?=.*[a-z])/.test(password)) return 'Kata sandi harus mengandung minimal satu huruf kecil'
  if (!/(?=.*[A-Z])/.test(password)) return 'Kata sandi harus mengandung minimal satu huruf besar'
  if (!/(?=.*\d)/.test(password)) return 'Kata sandi harus mengandung minimal satu angka'
  return null
}

// Email validation
export function validateEmail(email: string): string | null {
  if (!email) return 'Email wajib diisi'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Mohon masukkan alamat email yang valid'
  return null
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
