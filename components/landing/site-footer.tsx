"use client"

import Link from "next/link"

export function SiteFooter() {
  const handleNavClick = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }
  return (
    <footer className="site-footer bg-white border-t border-earth-200" role="contentinfo">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="footer-content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="footer-brand sm:col-span-2">
            <h3 className="brand-name text-lg font-semibold text-gray-900 hover:text-earth-600 transition-colors duration-300">
              RuangPena
            </h3>
            <p className="brand-description text-gray-600 max-w-md">
              Ruang yang lembut untuk jurnal penuh kesadaran dan kesehatan mental. Temukan kedamaian dalam catatan
              harian Anda dan pelihara pertumbuhan batin Anda.
            </p>
          </div>

          {/* Product Links */}
          <div className="footer-section">
            <h4 className="section-title text-sm font-medium text-gray-900 mb-4">Produk</h4>
            <nav className="footer-nav" role="navigation" aria-label="Product navigation">
              <ul className="nav-list space-y-2">
                <li>
                  <button
                    onClick={() => handleNavClick("#fitur")}
                    className="footer-link text-gray-600 hover:text-gray-900 text-sm transition-colors duration-300 cursor-pointer hover:translate-x-1 transform"
                  >
                    Fitur
                  </button>
                </li>
                <li>
                  <Link
                    href="#"
                    className="footer-link text-gray-600 hover:text-gray-900 text-sm transition-all duration-300 hover:translate-x-1 transform inline-block"
                  >
                    Privasi
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Support Links */}
          <div className="footer-section">
            <h4 className="section-title text-sm font-medium text-gray-900 mb-4">Dukungan</h4>
            <nav className="footer-nav" role="navigation" aria-label="Support navigation">
              <ul className="nav-list space-y-2">
                <li>
                  <Link
                    href="#"
                    className="footer-link text-gray-600 hover:text-gray-900 text-sm transition-all duration-300 hover:translate-x-1 transform inline-block"
                  >
                    Pusat Bantuan
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="footer-link text-gray-600 hover:text-gray-900 text-sm transition-all duration-300 hover:translate-x-1 transform inline-block"
                  >
                    Hubungi Saya
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("#tentang")}
                    className="footer-link text-gray-600 hover:text-gray-900 text-sm transition-all duration-300 cursor-pointer hover:translate-x-1 transform"
                  >
                    Tentang RuangPena
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom border-t border-earth-200 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="copyright text-gray-500 text-sm">
            © {new Date().getFullYear()} RuangPena. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  )
}