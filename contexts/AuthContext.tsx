"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, AuthResponse } from '@/lib/types'

interface AuthContextType {
  user: Omit<User, 'hashedPassword'> | null
  token: string | null
  login: (email: string, password: string) => Promise<AuthResponse>
  register: (email: string, password: string, confirmPassword: string, name?: string) => Promise<AuthResponse>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<User, 'hashedPassword'> | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data: AuthResponse = await response.json()

      if (data.success && data.user && data.token) {
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      return data
    } catch (error) {
      return {
        success: false,
        message: 'Terjadi kesalahan jaringan'
      }
    }
  }

  const register = async (
    email: string, 
    password: string, 
    confirmPassword: string, 
    name?: string
  ): Promise<AuthResponse> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, confirmPassword, name }),
      })

      const data: AuthResponse = await response.json()

      if (data.success && data.user && data.token) {
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      return data
    } catch (error) {
      return {
        success: false,
        message: 'Terjadi kesalahan jaringan'
      }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
