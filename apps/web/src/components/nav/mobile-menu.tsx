"use client"

import { NAV_LINKS, responsiveIconSize } from "@/lib/constants"
import { useNavStore } from "@/store/nav-store"
import { X } from "lucide-react"
import { useEffect } from "react"
import { NavLinks } from "./nav-links"
import { SearchForm } from "./search-form"

export function MobileMenu() {
  const { mobileMenuOpen, toggleMobileMenu } = useNavStore()

  // Handle body overflow when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : ""

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  return (
    <div
      id="mobile-menu"
      className={`fixed overflow-auto inset-0 bg-white z-20 pt-20 px-4 transition-transform duration-300 ease-in-out transform ${
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* SEARCH (Mobile) */}
      <SearchForm className="relative w-full mb-6" isMobile={true} />

      {/* MOBILE LINKS */}
      <NavLinks links={NAV_LINKS} isMobile={true} onLinkClick={toggleMobileMenu} />

      {/* CLOSE BUTTON */}
      <button
        id="close-menu"
        className="absolute top-4 left-4 p-2 text-zinc-500 hover:text-zinc-700"
        aria-label="إغلاق القائمة"
        onClick={toggleMobileMenu}
      >
        <X className={responsiveIconSize} />
      </button>
    </div>
  )
}
