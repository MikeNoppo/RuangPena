"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"

import { BookOpen, Home, History, GraduationCap, LogOut, PenTool, Settings } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  // Handle logout
  const handleLogout = () => {
    logout()
    router.push('/auth')
  }

  // Navigation items with dynamic active state
  const navigationItems = [
    {
      title: "Dasbor",
      url: "/dashboard",
      icon: Home,
      isActive: pathname === "/dashboard",
    },
    {
      title: "Entri Baru",
      url: "/journal/new",
      icon: PenTool,
      isActive: pathname === "/journal/new",
    },
    {
      title: "Riwayat",
      url: "/history",
      icon: History,
      isActive: pathname === "/history",
    },
    {
      title: "Belajar",
      url: "/learn",
      icon: GraduationCap,
      isActive: pathname === "/learn" || pathname.startsWith("/learn/"),
    },
    {
      title: "Pengaturan",
      url: "/settings",
      icon: Settings,
      isActive: pathname === "/settings",
    },
  ]

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-gray-900">RuangPena</span>
            <span className="truncate text-xs text-gray-500">Ruang penuh kesadaran Anda</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout at bottom */}
        <div className="mt-auto border-t border-gray-100 pt-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Keluar</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
