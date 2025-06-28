"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { User, AuthResponse } from "@/lib/types"
import { getCookie, setCookie, deleteCookie } from "cookies-next"

interface AuthContextType {
  user: Omit<User, 'password'> | null
  token: string | null
  login: (email: string, password: string) => Promise<AuthResponse>
  register: (email: string, password: string, confirmPassword: string, name?: string) => Promise<AuthResponse>
  updateUser: (userData: Partial<Omit<User, 'password'>>) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user from cookies on mount
  useEffect(() => {
    console.log("AuthContext: Initializing and loading user from cookies...")
    const savedToken = getCookie("token") as string | undefined
    const savedUser = getCookie("user") as string | undefined
    console.log("AuthContext: Token from cookie:", savedToken)
    console.log("AuthContext: User data from cookie:", savedUser)

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setToken(savedToken)
        setUser(parsedUser)
        console.log("AuthContext: User state successfully restored from cookies.", parsedUser)
      } catch (error) {
        console.error("AuthContext: Error parsing user data from cookie. Clearing invalid data.", error)
        // Clear invalid data
        deleteCookie("token")
        deleteCookie("user")
      }
    } else {
      console.log("AuthContext: No valid token or user data found in cookies.")
    }

    setLoading(false)
    console.log("AuthContext: Initial loading finished.")
  }, [])

  const login = async (
    email: string,
    password: string,
  ): Promise<AuthResponse> => {
    console.log(`AuthContext: Attempting to login user: ${email}`)
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
        console.log("AuthContext: Login successful. Setting user state and cookies.", data.user)
        setUser(data.user)
        setToken(data.token)
        setCookie("token", data.token)
        setCookie("user", JSON.stringify(data.user))
      } else {
        console.warn("AuthContext: Login API call was not successful.", data.message)
      }

      return data
    } catch (error) {
      console.error("AuthContext: Network or unexpected error during login.", error)
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
    name?: string,
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
        setCookie("token", data.token)
        setCookie("user", JSON.stringify(data.user))
      }

      return data
    } catch (error) {
      return {
        success: false,
        message: 'Terjadi kesalahan jaringan'
      }
    }
  }

  const updateUser = (userData: Partial<Omit<User, "password">>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      setCookie("user", JSON.stringify(updatedUser))
    }
  }

  const logout = () => {
    console.log("AuthContext: Logging out user and clearing cookies.")
    setUser(null)
    setToken(null)
    deleteCookie("token")
    deleteCookie("user")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, updateUser, logout, loading }}>
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
