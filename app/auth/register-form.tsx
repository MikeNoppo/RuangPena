"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

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

export default function RegisterForm() {
  const { register } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email wajib diisi"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Mohon masukkan alamat email yang valid"
    return undefined
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Kata sandi wajib diisi"
    if (password.length < 8) return "Kata sandi harus minimal 8 karakter"
    if (!/(?=.*[a-z])/.test(password)) return "Kata sandi harus mengandung minimal satu huruf kecil"
    if (!/(?=.*[A-Z])/.test(password)) return "Kata sandi harus mengandung minimal satu huruf besar"
    if (!/(?=.*\d)/.test(password)) return "Kata sandi harus mengandung minimal satu angka"
    return undefined
  }

  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) return "Mohon konfirmasi kata sandi Anda"
    if (password !== confirmPassword) return "Kata sandi tidak cocok"
    return undefined
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    newErrors.email = validateEmail(formData.email)
    newErrors.password = validatePassword(formData.password)
    newErrors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword)
    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== undefined)
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
      const result = await register(formData.email, formData.password, formData.confirmPassword, formData.name)
      if (result.success) {
        router.push("/dashboard")
      } else {
        setErrors({ general: result.message })
      }
    } catch (error) {
      setErrors({ general: "Terjadi kesalahan. Silakan coba lagi." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <span className="text-red-500">⚠</span>
            {errors.general}
          </p>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="name-register" className="text-sm font-medium text-gray-700">
          Nama (Opsional)
        </Label>
        <Input
          id="name-register"
          type="text"
          placeholder="Masukkan nama Anda"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="h-11 sm:h-12 border-earth-200 focus:border-earth-500 focus:ring-earth-500 text-sm sm:text-base"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-register" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <Input
          id="email-register"
          type="email"
          placeholder="Masukkan email Anda"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className={`h-11 sm:h-12 border-earth-200 focus:border-earth-500 focus:ring-earth-500 text-sm sm:text-base ${
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
      <div className="space-y-2">
        <Label htmlFor="password-register" className="text-sm font-medium text-gray-700">
          Kata Sandi
        </Label>
        <Input
          id="password-register"
          type="password"
          placeholder="Masukkan kata sandi Anda"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          className={`h-11 sm:h-12 border-earth-200 focus:border-earth-500 focus:ring-earth-500 text-sm sm:text-base ${
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
        {!errors.password && formData.password && (
          <div className="text-xs text-gray-500 space-y-1">
            <p>Kata sandi harus mengandung:</p>
            <ul className="ml-4 space-y-1">
              <li className={formData.password.length >= 8 ? "text-earth-600" : "text-gray-400"}>
                ✓ Minimal 8 karakter
              </li>
              <li className={/(?=.*[a-z])/.test(formData.password) ? "text-earth-600" : "text-gray-400"}>
                ✓ Satu huruf kecil
              </li>
              <li className={/(?=.*[A-Z])/.test(formData.password) ? "text-earth-600" : "text-gray-400"}>
                ✓ Satu huruf besar
              </li>
              <li className={/(?=.*\d)/.test(formData.password) ? "text-earth-600" : "text-gray-400"}>
                ✓ Satu angka
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword-register" className="text-sm font-medium text-gray-700">
          Konfirmasi Kata Sandi
        </Label>
        <Input
          id="confirmPassword-register"
          type="password"
          placeholder="Konfirmasi kata sandi Anda"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          className={`h-11 sm:h-12 border-earth-200 focus:border-earth-500 focus:ring-earth-500 text-sm sm:text-base ${
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
            <p className="text-xs sm:text-sm text-earth-600 flex items-center gap-1">
              <span className="text-earth-500">✓</span>
              Kata sandi cocok
            </p>
          )}
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 sm:h-12 bg-earth-400 hover:bg-earth-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base border-0"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Sedang Membuat Akun...
          </div>
        ) : (
          "Buat Akun"
        )}
      </Button>
    </form>
  )
}