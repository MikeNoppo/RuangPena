"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface FormData {
  email: string
  password: string
  confirmPassword: string
  name: string
}

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
  name?: string
  general?: string
}

export default function AuthPage() {
  const { login, register, user } = useAuth()
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email wajib diisi"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Mohon masukkan alamat email yang valid"
    return undefined
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Kata sandi wajib diisi"
    if (!isLogin) {
      if (password.length < 8) return "Kata sandi harus minimal 8 karakter"
      if (!/(?=.*[a-z])/.test(password)) return "Kata sandi harus mengandung minimal satu huruf kecil"
      if (!/(?=.*[A-Z])/.test(password)) return "Kata sandi harus mengandung minimal satu huruf besar"
      if (!/(?=.*\d)/.test(password)) return "Kata sandi harus mengandung minimal satu angka"
    }
    return undefined
  }

  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!isLogin) {
      if (!confirmPassword) return "Mohon konfirmasi kata sandi Anda"
      if (password !== confirmPassword) return "Kata sandi tidak cocok"
    }
    return undefined
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    newErrors.email = validateEmail(formData.email)
    newErrors.password = validatePassword(formData.password)

    if (!isLogin) {
      newErrors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword)
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== undefined)
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      let result
      if (isLogin) {
        result = await login(formData.email, formData.password)
      } else {
        result = await register(formData.email, formData.password, formData.confirmPassword, formData.name)
      }

      if (result.success) {
        router.push('/dashboard')
      } else {
        setErrors({ general: result.message })
      }
    } catch (error) {
      setErrors({ general: 'Terjadi kesalahan. Silakan coba lagi.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setErrors({})
    setFormData({ email: "", password: "", confirmPassword: "", name: "" })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Responsive Container */}
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Link
            href="/"
            className="text-xl sm:text-2xl font-semibold text-gray-900 hover:text-teal-600 transition-colors"
          >
            RuangPena
          </Link>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Selamat datang kembali ke perjalanan penuh kesadaran Anda
          </p>
        </div>

        {/* Auth Card - Responsive */}
        <Card className="border-0 shadow-lg w-full">
          <CardHeader className="space-y-1 pb-4 sm:pb-6 px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl font-light text-center text-gray-900">
              {isLogin ? "Masuk" : "Buat Akun"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
            {/* Social Login */}
            <Button
              variant="outline"
              className="w-full h-11 sm:h-12 border-gray-200 hover:bg-gray-50 bg-transparent text-sm sm:text-base"
              type="button"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Lanjutkan dengan Google
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Atau lanjutkan dengan email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General Error */}
              {errors.general && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <span className="text-red-500">⚠</span>
                    {errors.general}
                  </p>
                </div>
              )}

              {/* Name Field (Register only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Nama (Opsional)
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Masukkan nama Anda"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="h-11 sm:h-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-sm sm:text-base"
                  />
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan email Anda"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`h-11 sm:h-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-sm sm:text-base ${
                    errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                  required
                />
                {errors.email && (
                  <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Kata Sandi
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan kata sandi Anda"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`h-11 sm:h-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-sm sm:text-base ${
                    errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                  required
                />
                {errors.password && (
                  <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.password}
                  </p>
                )}
                {!isLogin && !errors.password && formData.password && (
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Kata sandi harus mengandung:</p>
                    <ul className="ml-4 space-y-1">
                      <li className={formData.password.length >= 8 ? "text-teal-600" : "text-gray-400"}>
                        ✓ Minimal 8 karakter
                      </li>
                      <li className={/(?=.*[a-z])/.test(formData.password) ? "text-teal-600" : "text-gray-400"}>
                        ✓ Satu huruf kecil
                      </li>
                      <li className={/(?=.*[A-Z])/.test(formData.password) ? "text-teal-600" : "text-gray-400"}>
                        ✓ Satu huruf besar
                      </li>
                      <li className={/(?=.*\d)/.test(formData.password) ? "text-teal-600" : "text-gray-400"}>
                        ✓ Satu angka
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm Password for Register */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Konfirmasi Kata Sandi
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Konfirmasi kata sandi Anda"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`h-11 sm:h-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-sm sm:text-base ${
                      errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    required
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
                      <span className="text-red-500">⚠</span>
                      {errors.confirmPassword}
                    </p>
                  )}
                  {!errors.confirmPassword &&
                    formData.confirmPassword &&
                    formData.password === formData.confirmPassword && (
                      <p className="text-xs sm:text-sm text-teal-600 flex items-center gap-1">
                        <span className="text-teal-500">✓</span>
                        Kata sandi cocok
                      </p>
                    )}
                </div>
              )}

              {/* Forgot Password Link (Login only) */}
              {isLogin && (
                <div className="text-right">
                  <Link
                    href="/lupa-kata-sandi"
                    className="text-xs sm:text-sm text-teal-600 hover:text-teal-700 hover:underline"
                  >
                    Lupa kata sandi?
                  </Link>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 sm:h-12 bg-teal-600 hover:bg-teal-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isLogin ? "Sedang Masuk..." : "Sedang Membuat Akun..."}
                  </div>
                ) : isLogin ? (
                  "Masuk"
                ) : (
                  "Buat Akun"
                )}
              </Button>
            </form>

            {/* Toggle Link */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-xs sm:text-sm text-gray-600">
                {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-teal-600 hover:text-teal-700 hover:underline font-medium"
                >
                  {isLogin ? "Daftar" : "Masuk"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-xs text-gray-500 px-4">
            Dengan melanjutkan, Anda menyetujui{" "}
            <Link href="/syarat-ketentuan" className="hover:underline">
              Syarat & Ketentuan
            </Link>{" "}
            dan{" "}
            <Link href="/kebijakan-privasi" className="hover:underline">
              Kebijakan Privasi
            </Link>{" "}
            kami
          </p>
        </div>
      </div>
    </div>
  )
}
