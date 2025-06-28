"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { User, Lock, AlertTriangle, Eye, EyeOff } from "lucide-react"

interface ProfileData {
  username: string
}

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

interface ProfileErrors {
  username?: string
}

interface PasswordErrors {
  currentPassword?: string
  newPassword?: string
  confirmNewPassword?: string
}

export default function AccountSettings() {
  // Profile state
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "Sarah Wijaya", // Mock current username
  })
  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({})
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false)

  // Password state
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({})
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  // Delete account state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState("")
  const [deleteError, setDeleteError] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  // Add these state variables after the existing state declarations
  const [originalProfileData, setOriginalProfileData] = useState<ProfileData>({
    username: "Sarah Wijaya", // This should match the initial profileData
  })
  const [originalPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })

  // Add computed states for detecting changes
  const hasProfileChanges = profileData.username.trim() !== originalProfileData.username.trim()
  const hasPasswordChanges = passwordData.currentPassword || passwordData.newPassword || passwordData.confirmNewPassword
  const isPasswordFormComplete =
    passwordData.currentPassword &&
    passwordData.newPassword &&
    passwordData.confirmNewPassword &&
    !Object.values(passwordErrors).some((error) => error !== undefined)

  // Profile validation
  const validateProfile = (): boolean => {
    const errors: ProfileErrors = {}

    if (!profileData.username.trim()) {
      errors.username = "Nama pengguna wajib diisi"
    } else if (profileData.username.trim().length < 2) {
      errors.username = "Nama pengguna harus minimal 2 karakter"
    }

    setProfileErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Password validation
  const validatePassword = (): boolean => {
    const errors: PasswordErrors = {}

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Kata sandi saat ini wajib diisi"
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "Kata sandi baru wajib diisi"
    } else {
      if (passwordData.newPassword.length < 8) {
        errors.newPassword = "Kata sandi harus minimal 8 karakter"
      } else if (!/(?=.*[a-z])/.test(passwordData.newPassword)) {
        errors.newPassword = "Kata sandi harus mengandung minimal satu huruf kecil"
      } else if (!/(?=.*[A-Z])/.test(passwordData.newPassword)) {
        errors.newPassword = "Kata sandi harus mengandung minimal satu huruf besar"
      } else if (!/(?=.*\d)/.test(passwordData.newPassword)) {
        errors.newPassword = "Kata sandi harus mengandung minimal satu angka"
      }
    }

    if (!passwordData.confirmNewPassword) {
      errors.confirmNewPassword = "Konfirmasi kata sandi wajib diisi"
    } else if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      errors.confirmNewPassword = "Kata sandi tidak cocok"
    }

    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle profile form submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateProfile()) return

    setIsProfileSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Profile updated:", profileData)
      // Show success message in real app
      setOriginalProfileData({ ...profileData }) // Update original data to current data
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsProfileSubmitting(false)
    }
  }

  // Handle password form submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePassword()) return

    setIsPasswordSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Password updated")
      // Clear form and show success message
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      })
    } catch (error) {
      console.error("Error updating password:", error)
    } finally {
      setIsPasswordSubmitting(false)
    }
  }

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!deleteConfirmPassword) {
      setDeleteError("Mohon masukkan kata sandi untuk konfirmasi")
      return
    }

    setIsDeleting(true)
    setDeleteError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Account deleted")
      // In real app, redirect to goodbye page or login
      window.location.href = "/auth?message=account-deleted"
    } catch (error) {
      setDeleteError("Kata sandi salah atau terjadi kesalahan")
      console.error("Error deleting account:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleProfileInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
    if (profileErrors[field]) {
      setProfileErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handlePasswordInputChange = (field: keyof PasswordData, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }))
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-100 px-4 sm:px-6">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-medium text-gray-900">Pengaturan Akun</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            {/* Page Title */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-light text-gray-900">Pengaturan Akun</h1>
              <p className="text-base sm:text-lg text-gray-600">Kelola profil dan preferensi akun Anda di RuangPena</p>
            </div>

            {/* Section 1: Profile Settings */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900">
                  <User className="h-5 w-5 text-teal-600" />
                  Profil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  {/* Username Field */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                      Nama Pengguna
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Masukkan nama pengguna Anda"
                      value={profileData.username}
                      onChange={(e) => handleProfileInputChange("username", e.target.value)}
                      className={`h-11 border-gray-200 focus:border-teal-500 focus:ring-teal-500 ${
                        profileErrors.username ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                      }`}
                      required
                    />
                    {profileErrors.username && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {profileErrors.username}
                      </p>
                    )}
                    {hasProfileChanges && (
                      <p className="text-xs text-teal-600 flex items-center gap-1">
                        <span className="text-teal-500">•</span>
                        Perubahan terdeteksi - klik "Simpan Perubahan" untuk menyimpan
                      </p>
                    )}
                  </div>

                  {/* Submit Button - Only show when changes detected */}
                  {hasProfileChanges && (
                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={isProfileSubmitting}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-medium disabled:opacity-50"
                      >
                        {isProfileSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Menyimpan...
                          </div>
                        ) : (
                          "Simpan Perubahan"
                        )}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Section 2: Password Settings */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900">
                  <Lock className="h-5 w-5 text-teal-600" />
                  Ubah Kata Sandi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {/* Current Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                      Kata Sandi Saat Ini
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        placeholder="Masukkan kata sandi saat ini"
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordInputChange("currentPassword", e.target.value)}
                        className={`h-11 border-gray-200 focus:border-teal-500 focus:ring-teal-500 pr-10 ${
                          passwordErrors.currentPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {passwordErrors.currentPassword}
                      </p>
                    )}
                  </div>

                  {/* New Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                      Kata Sandi Baru
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        placeholder="Masukkan kata sandi baru"
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordInputChange("newPassword", e.target.value)}
                        className={`h-11 border-gray-200 focus:border-teal-500 focus:ring-teal-500 pr-10 ${
                          passwordErrors.newPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {passwordErrors.newPassword}
                      </p>
                    )}
                    {!passwordErrors.newPassword && passwordData.newPassword && (
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Kata sandi harus mengandung:</p>
                        <ul className="ml-4 space-y-1">
                          <li className={passwordData.newPassword.length >= 8 ? "text-teal-600" : "text-gray-400"}>
                            ✓ Minimal 8 karakter
                          </li>
                          <li
                            className={/(?=.*[a-z])/.test(passwordData.newPassword) ? "text-teal-600" : "text-gray-400"}
                          >
                            ✓ Satu huruf kecil
                          </li>
                          <li
                            className={/(?=.*[A-Z])/.test(passwordData.newPassword) ? "text-teal-600" : "text-gray-400"}
                          >
                            ✓ Satu huruf besar
                          </li>
                          <li className={/(?=.*\d)/.test(passwordData.newPassword) ? "text-teal-600" : "text-gray-400"}>
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
                    <div className="relative">
                      <Input
                        id="confirmNewPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        placeholder="Konfirmasi kata sandi baru"
                        value={passwordData.confirmNewPassword}
                        onChange={(e) => handlePasswordInputChange("confirmNewPassword", e.target.value)}
                        className={`h-11 border-gray-200 focus:border-teal-500 focus:ring-teal-500 pr-10 ${
                          passwordErrors.confirmNewPassword
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {passwordErrors.confirmNewPassword && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {passwordErrors.confirmNewPassword}
                      </p>
                    )}
                    {!passwordErrors.confirmNewPassword &&
                      passwordData.confirmNewPassword &&
                      passwordData.newPassword === passwordData.confirmNewPassword && (
                        <p className="text-sm text-teal-600 flex items-center gap-1">
                          <span className="text-teal-500">✓</span>
                          Kata sandi cocok
                        </p>
                      )}
                  </div>
                  {hasPasswordChanges && !isPasswordFormComplete && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span className="text-gray-400">•</span>
                      Lengkapi semua field untuk menyimpan perubahan kata sandi
                    </p>
                  )}
                  {hasPasswordChanges && isPasswordFormComplete && (
                    <p className="text-xs text-teal-600 flex items-center gap-1">
                      <span className="text-teal-500">•</span>
                      Siap untuk menyimpan - klik "Ubah Kata Sandi"
                    </p>
                  )}

                  {/* Submit Button - Only show when password form has changes and is valid */}
                  {hasPasswordChanges && (
                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={isPasswordSubmitting || !isPasswordFormComplete}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-medium disabled:opacity-50"
                      >
                        {isPasswordSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Mengubah...
                          </div>
                        ) : (
                          "Ubah Kata Sandi"
                        )}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Section 3: Delete Account (Danger Zone) */}
            <Card className="border-2 border-red-200 shadow-sm">
              <CardHeader className="pb-4 bg-red-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg font-medium text-red-800">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Hapus Akun
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {/* Warning Text */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900">
                    Tindakan ini tidak bisa dibatalkan. Setelah akun Anda dihapus, semua data, termasuk seluruh entri
                    jurnal Anda, akan hilang secara permanen.
                  </p>
                  <p className="text-sm text-gray-600">
                    Pastikan Anda telah mengunduh atau mencadangkan semua data penting sebelum melanjutkan.
                  </p>
                </div>

                {/* Delete Button with Modal */}
                <div className="pt-2">
                  <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white font-medium border-red-600 hover:border-red-700"
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Hapus Akun Saya
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-800">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          Konfirmasi Penghapusan Akun
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        {/* Warning in Modal */}
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm font-medium text-red-800 mb-2">Peringatan!</p>
                          <p className="text-sm text-red-700">
                            Tindakan ini akan menghapus akun Anda secara permanen beserta semua data jurnal yang telah
                            Anda tulis. Data yang sudah dihapus tidak dapat dikembalikan.
                          </p>
                        </div>

                        {/* Password Confirmation */}
                        <div className="space-y-2">
                          <Label htmlFor="deletePassword" className="text-sm font-medium text-gray-700">
                            Masukkan kata sandi Anda untuk konfirmasi
                          </Label>
                          <Input
                            id="deletePassword"
                            type="password"
                            placeholder="Kata sandi Anda"
                            value={deleteConfirmPassword}
                            onChange={(e) => {
                              setDeleteConfirmPassword(e.target.value)
                              setDeleteError("")
                            }}
                            className="h-11 border-gray-200 focus:border-red-500 focus:ring-red-500"
                            required
                          />
                          {deleteError && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <span className="text-red-500">⚠</span>
                              {deleteError}
                            </p>
                          )}
                        </div>

                        {/* Modal Actions */}
                        <div className="flex gap-3 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsDeleteModalOpen(false)
                              setDeleteConfirmPassword("")
                              setDeleteError("")
                            }}
                            className="flex-1 border-gray-200 hover:bg-gray-50"
                            disabled={isDeleting}
                          >
                            Batal
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                          >
                            {isDeleting ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Menghapus...
                              </div>
                            ) : (
                              "Ya, Hapus Akun Saya"
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
