"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"

const navigationLinks = [
	{ href: "#fitur", label: "Fitur" },
	{ href: "#tentang", label: "Tentang RuangPena" },
]

export function SiteHeader() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const handleNavClick = (href: string) => {
		setIsMenuOpen(false)
		const element = document.querySelector(href)
		if (element) {
			element.scrollIntoView({ behavior: "smooth" })
		}
	}

	return (
		<header className="site-header">
			<nav
				className="bg-white/95 border-b border-earth-200 sticky top-0 z-50 backdrop-blur-sm"
				role="navigation"
				aria-label="Main navigation"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						{/* Brand Logo with subtle animation */}
						<div className="brand-logo flex items-center">
							<h1 className="text-xl font-semibold text-gray-900 hover:text-earth-600 transition-colors duration-300">
								RuangPena
							</h1>
						</div>

						{/* Desktop Navigation & Auth Actions */}
						<div className="hidden md:flex items-center space-x-8">
							<div className="flex items-baseline space-x-8">
								{navigationLinks.map((link) => (
									<button
										key={link.href}
										onClick={() => handleNavClick(link.href)}
										className="nav-link text-gray-600 hover:text-gray-900 text-sm font-medium transition-all duration-300 cursor-pointer px-0 py-0 text-left border-0 mx-0 relative group"
										aria-label={`Navigate to ${link.label} section`}
									>
										{link.label}
										<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-earth-600 transition-all duration-300 group-hover:w-full"></span>
									</button>
								))}
							</div>
							<Button
								asChild
								className="cta-button bg-earth-400 hover:bg-earth-500 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg border-0"
							>
								<Link href="/auth">Masuk</Link>
							</Button>
						</div>

						{/* Mobile Menu Toggle */}
						<div className="mobile-menu-toggle md:hidden">
							<Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
								<SheetTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="text-gray-600 hover:text-gray-900 hover:bg-earth-100 transition-all duration-300"
										aria-label="Open mobile menu"
									>
										<Menu className="h-6 w-6" />
										<span className="sr-only">Buka menu</span>
									</Button>
								</SheetTrigger>
								<SheetContent side="right" className="mobile-menu w-[300px] sm:w-[400px]">
									<div className="flex flex-col h-full">
										{/* Mobile Menu Header */}
										<div className="mobile-menu-header flex items-center justify-between pb-6 border-b border-earth-200">
											<h2 className="text-lg font-semibold text-gray-900">
												RuangPena
											</h2>
										</div>

										{/* Mobile Navigation Links */}
										<nav
											className="mobile-nav flex-1 py-6"
											role="navigation"
											aria-label="Mobile navigation"
										>
											<div className="space-y-4">
												{navigationLinks.map((link) => (
													<button
														key={link.href}
														onClick={() => handleNavClick(link.href)}
														className="mobile-nav-link block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-earth-50 rounded-md transition-all duration-300"
														aria-label={`Navigate to ${link.label} section`}
													>
														{link.label}
													</button>
												))}
											</div>
										</nav>

										{/* Mobile Auth Actions */}
										<div className="mobile-auth border-t border-earth-200 pt-6 space-y-3">
											<Button
												asChild
												variant="ghost"
												className="w-full justify-center text-gray-600 hover:text-gray-900 hover:bg-earth-100 transition-all duration-300"
											>
												<Link href="/auth">Masuk</Link>
											</Button>
											<Button
												asChild
												className="w-full bg-earth-400 hover:bg-earth-500 text-white transition-all duration-300 hover:scale-105 border-0"
											>
												<Link href="/auth">Mulai</Link>
											</Button>
										</div>
									</div>
								</SheetContent>
							</Sheet>
						</div>
					</div>
				</div>
			</nav>
		</header>
	)
}