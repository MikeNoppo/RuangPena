// Type definitions for the RuangPena application

export interface User {
  id: string
  email: string
  hashedPassword: string
  name?: string
  createdAt: string
  updatedAt: string
}

export interface JournalEntry {
  id: string
  userId: string
  title: string
  content: string
  type: 'daily' | 'gratitude' | 'dream' | 'bullet'
  typeName: string
  tags: string[]
  createdAt: string
  updatedAt: string
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
  title: string
  content: string
  type: 'daily' | 'gratitude' | 'dream' | 'bullet'
  tags?: string[]
}

export interface UpdateJournalRequest {
  title?: string
  content?: string
  type?: 'daily' | 'gratitude' | 'dream' | 'bullet'
  tags?: string[]
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: Omit<User, 'hashedPassword'>
  token?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
}

export const JOURNAL_TYPES = {
  daily: 'Jurnal Harian',
  gratitude: 'Jurnal Syukur',
  dream: 'Jurnal Mimpi',
  bullet: 'Jurnal Bullet'
} as const
