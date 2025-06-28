// Type definitions for the RuangPena application
import { User as PrismaUser, Journal as PrismaJournal, JournalType } from '@prisma/client'

export interface User extends PrismaUser {}

export interface JournalEntry extends PrismaJournal {
  typeName: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  confirmPassword: string
  name?: string
}

export interface CreateJournalRequest {
  title?: string | null
  content: string
  type: JournalType
  tags?: string[]
}

export interface UpdateJournalRequest {
  title?: string | null
  content?: string
  type?: JournalType
  tags?: string[]
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: Omit<User, 'password'>
  token?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
}

export const JOURNAL_TYPES: Record<JournalType, string> = {
  DAILY: 'Jurnal Harian',
  GRATITUDE: 'Jurnal Syukur',
  DREAM: 'Jurnal Mimpi',
  BULLET: 'Jurnal Bullet'
} as const

// Map Prisma enum to display names
export function getJournalTypeName(type: JournalType): string {
  return JOURNAL_TYPES[type] || 'Unknown'
}
