"use client"

import { responsiveIconSize } from "@/lib/constants"
import { useNavStore } from "@/store/nav-store"
import { Menu } from "lucide-react"

export function MobileMenuButton() {
  const { toggleMobileMenu } = useNavStore()

  return (
    <button id="menu-toggle" className="md:hidden" aria-label="فتح القائمة" onClick={toggleMobileMenu}>
      <Menu className={responsiveIconSize} />
    </button>
  )
}
