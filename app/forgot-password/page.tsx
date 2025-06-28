"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Shield } from "lucide-react"
import Link from "next/link"

interface FormData {
  email: string
  verificationCode: string
  newPassword: string
  confirmNewPassword: string
}

interface FormErrors {
  email?: string
  verificationCode?: string
  newPassword?: string
  confirmNewPassword?: string
}

type Step = "request" | "verify"

export default function ForgotPasswordPage() {
  const [currentStep, setCurrentStep] = useState<Step>("request")
  const [formData, setFormData] = useState<FormData>({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmNewPassword: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes in seconds
  const [isCodeExpired, setIsCodeExpired] = useState(false)

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (currentStep === "verify" && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsCodeExpired(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [currentStep, timeRemaining])

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email wajib diisi"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Mohon masukkan alamat email yang valid"
    return undefined
  }

  const validateVerificationCode = (code: string): string | undefined => {
    if (!code) return "Kode verifikasi wajib diisi"
    if (code.length !== 6) return "Kode verifikasi harus 6 digit"
    if (!/^\d{6}$/.test(code)) return "Kode verifikasi hanya boleh berisi angka"
    return undefined
  }

  const validateNewPassword = (password: string): string | undefined => {
    if (!password) return "Kata sandi baru wajib diisi"
    if (password.length < 8) return "Kata sandi harus minimal 8 karakter"
    if (!/(?=.*[a-z])/.test(password)) return "Kata sandi harus mengandung minimal satu huruf kecil"
    if (!/(?=.*[A-Z])/.test(password)) return "Kata sandi harus mengandung minimal satu huruf besar"
    if (!/(?=.*\d)/.test(password)) return "Kata sandi harus mengandung minimal satu angka"
    return undefined
  }

  const validateConfirmNewPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) return "Mohon konfirmasi kata sandi baru Anda"
    if (password !== confirmPassword) return "Kata sandi tidak cocok"
    return undefined
  }

  const validateRequestForm = (): boolean => {
    const newErrors: FormErrors = {}
    newErrors.email = validateEmail(formData.email)
    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== undefined)
  }

  const validateVerifyForm = (): boolean => {
    const newErrors: FormErrors = {}
    newErrors.verificationCode = validateVerificationCode(formData.verificationCode)
    newErrors.newPassword = validateNewPassword(formData.newPassword)
    newErrors.confirmNewPassword = validateConfirmNewPassword(formData.newPassword, formData.confirmNewPassword)
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

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateRequestForm()) return

    setIsSubmitting(true)

    try {
      // Simulate API call to send verification code
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Verification code sent to:", formData.email)

      // Reset timer and move to verification step
      setTimeRemaining(300) // Reset to 5 minutes
      setIsCodeExpired(false)
      setCurrentStep("verify")
    } catch (error) {
      console.error("Error sending verification code:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateVerifyForm()) return

    setIsSubmitting(true)

    try {
      // Simulate API call to verify code and reset password
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Password reset successful for:", formData.email)

      // In a real app, redirect to login with success message
      window.location.href = "/auth?message=password-reset-success"
    } catch (error) {
      console.error("Error resetting password:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendCode = async () => {
    setIsSubmitting(true)
    try {
      // Simulate API call to resend verification code
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Verification code resent to:", formData.email)

      // Reset timer when code is resent
      setTimeRemaining(300) // Reset to 5 minutes
      setIsCodeExpired(false)
    } catch (error) {
      console.error("Error resending verification code:", error)
    } finally {
      setIsSubmitting(false)
    }
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
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Atur ulang kata sandi Anda dengan mudah</p>
        </div>

        {/* Main Card - Responsive */}
        <Card className="border-0 shadow-lg w-full">
          <CardHeader className="space-y-1 pb-4 sm:pb-6 px-4 sm:px-6">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center">
                {currentStep === "request" ? (
                  <Mail className="h-6 w-6 text-teal-600" />
                ) : (
                  <Shield className="h-6 w-6 text-teal-600" />
                )}
              </div>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-light text-center text-gray-900">Lupa Kata Sandi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
            {currentStep === "request" ? (
              /* Step 1: Request Code */
              <>
                {/* Instructions */}
                <div className="text-center space-y-2">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Masukkan alamat email Anda yang terdaftar. Kami akan mengirimkan kode verifikasi untuk mengatur
                    ulang kata sandi Anda.
                  </p>
                </div>

                {/* Request Form */}
                <form onSubmit={handleRequestSubmit} className="space-y-4">
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

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 sm:h-12 bg-teal-600 hover:bg-teal-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Mengirim Kode...
                      </div>
                    ) : (
                      "Kirim Kode Verifikasi"
                    )}
                  </Button>
                </form>

                {/* Back to Login */}
                <div className="text-center pt-4 border-t border-gray-100">
                  <Link
                    href="/auth"
                    className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 hover:underline font-medium"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Masuk
                  </Link>
                </div>
              </>
            ) : (
              /* Step 2: Verify Code and Reset Password */
              <>
                {/* Instructions */}
                <div className="text-center space-y-2">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Silakan periksa email Anda. Masukkan kode 6-digit yang kami kirimkan beserta kata sandi baru Anda.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Kode dikirim ke: <span className="font-medium">{formData.email}</span>
                  </p>
                </div>

                {/* Timer Display */}
                <div className="text-center">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                      isCodeExpired
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : timeRemaining <= 60
                          ? "bg-orange-50 text-orange-700 border border-orange-200"
                          : "bg-teal-50 text-teal-700 border border-teal-200"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isCodeExpired
                          ? "bg-red-500"
                          : timeRemaining <= 60
                            ? "bg-orange-500 animate-pulse"
                            : "bg-teal-500"
                      }`}
                    ></div>
                    {isCodeExpired ? (
                      <span>Kode telah kedaluwarsa</span>
                    ) : (
                      <span>Kode berlaku selama {formatTime(timeRemaining)}</span>
                    )}
                  </div>
                </div>

                {/* Verify Form */}
                <form onSubmit={handleVerifySubmit} className="space-y-4">
                  {/* Verification Code Field */}
                  <div className="space-y-2">
                    <Label htmlFor="verificationCode" className="text-sm font-medium text-gray-700">
                      Kode Verifikasi
                    </Label>
                    <Input
                      id="verificationCode"
                      type="text"
                      placeholder="Masukkan kode 6-digit"
                      value={formData.verificationCode}
                      onChange={(e) =>
                        handleInputChange("verificationCode", e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      className={`h-11 sm:h-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-sm sm:text-base text-center tracking-widest ${
                        errors.verificationCode ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                      }`}
                      maxLength={6}
                      required
                    />
                    {errors.verificationCode && (
                      <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {errors.verificationCode}
                      </p>
                    )}
                  </div>

                  {/* New Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                      Kata Sandi Baru
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Masukkan kata sandi baru"
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange("newPassword", e.target.value)}
                      className={`h-11 sm:h-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-sm sm:text-base ${
                        errors.newPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                      }`}
                      required
                    />
                    {errors.newPassword && (
                      <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {errors.newPassword}
                      </p>
                    )}
                    {!errors.newPassword && formData.newPassword && (
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Kata sandi harus mengandung:</p>
                        <ul className="ml-4 space-y-1">
                          <li className={formData.newPassword.length >= 8 ? "text-teal-600" : "text-gray-400"}>
                            ✓ Minimal 8 karakter
                          </li>
                          <li className={/(?=.*[a-z])/.test(formData.newPassword) ? "text-teal-600" : "text-gray-400"}>
                            ✓ Satu huruf kecil
                          </li>
                          <li className={/(?=.*[A-Z])/.test(formData.newPassword) ? "text-teal-600" : "text-gray-400"}>
                            ✓ Satu huruf besar
                          </li>
                          <li className={/(?=.*\d)/.test(formData.newPassword) ? "text-teal-600" : "text-gray-400"}>
                            ✓ Satu angka
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Confirm New Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword" className="text-sm font-medium text-gray-700">
                      Konfirmasi Kata Sandi Baru
                    </Label>
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      placeholder="Konfirmasi kata sandi baru"
                      value={formData.confirmNewPassword}
                      onChange={(e) => handleInputChange("confirmNewPassword", e.target.value)}
                      className={`h-11 sm:h-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-sm sm:text-base ${
                        errors.confirmNewPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                      }`}
                      required
                    />
                    {errors.confirmNewPassword && (
                      <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {errors.confirmNewPassword}
                      </p>
                    )}
                    {!errors.confirmNewPassword &&
                      formData.confirmNewPassword &&
                      formData.newPassword === formData.confirmNewPassword && (
                        <p className="text-xs sm:text-sm text-teal-600 flex items-center gap-1">
                          <span className="text-teal-500">✓</span>
                          Kata sandi cocok
                        </p>
                      )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || isCodeExpired}
                    className="w-full h-11 sm:h-12 bg-teal-600 hover:bg-teal-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Menyimpan...
                      </div>
                    ) : isCodeExpired ? (
                      "Kode Kedaluwarsa"
                    ) : (
                      "Simpan Kata Sandi Baru"
                    )}
                  </Button>
                </form>

                {/* Resend Code and Back Options */}
                <div className="text-center pt-4 border-t border-gray-100 space-y-3">
                  {isCodeExpired ? (
                    <div className="space-y-3">
                      <p className="text-sm text-red-600 font-medium">
                        Kode verifikasi telah kedaluwarsa. Silakan minta kode baru.
                      </p>
                      <Button
                        onClick={handleResendCode}
                        disabled={isSubmitting}
                        className="bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Mengirim...
                          </div>
                        ) : (
                          "Kirim Kode Baru"
                        )}
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-600">
                      Tidak menerima kode?{" "}
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={isSubmitting}
                        className="text-teal-600 hover:text-teal-700 hover:underline font-medium disabled:opacity-50"
                      >
                        Kirim Ulang
                      </button>
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep("request")
                      setErrors({})
                      setTimeRemaining(300)
                      setIsCodeExpired(false)
                      setFormData((prev) => ({
                        ...prev,
                        verificationCode: "",
                        newPassword: "",
                        confirmNewPassword: "",
                      }))
                    }}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 hover:underline"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Ubah Email
                  </button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-xs text-gray-500 px-4">
            Ingat kata sandi Anda?{" "}
            <Link href="/auth" className="text-teal-600 hover:text-teal-700 hover:underline font-medium">
              Kembali ke Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
