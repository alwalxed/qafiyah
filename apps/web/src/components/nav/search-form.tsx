"use client"

import type React from "react"

import { responsiveIconSize } from "@/lib/constants"
import { useNavStore } from "@/store/nav-store"
import { Search, X } from "lucide-react"
import { useRef } from "react"

type SearchFormProps = {
  className?: string
  isMobile?: boolean
}

export function SearchForm({ className = "", isMobile = false }: SearchFormProps) {
  const { searchQuery, setSearchQuery } = useNavStore()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSearchClearClick = () => {
    setSearchQuery("")
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (searchQuery.trim()) {
      const googleSearchUrl = `https://www.google.com/search?q=site:qafiyah.com ${encodeURIComponent(searchQuery)}`
      window.open(googleSearchUrl, "_blank")
    }
  }

  return (
    <form
      ref={formRef}
      id={isMobile ? "mobile-search-form" : "search-form"}
      className={className}
      dir="rtl"
      onSubmit={handleSubmit}
      action="https://www.google.com/search"
      method="get"
      target="_blank"
    >
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-500">
        <Search className={responsiveIconSize} />
      </div>

      {/* Hidden input for the site: operator */}
      <input type="hidden" name="q" value={`site:qafiyah.com ${searchQuery}`} />

      <input
        ref={searchInputRef}
        type="search"
        name="q-visible" // This won't be sent to Google, just for display
        placeholder="ابحث"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`w-full pr-10 pl-10 ${
          isMobile
            ? "py-1 xxs:py-2 text-sm border border-zinc-300"
            : "md:py-1 lg:py-2 text-sm bg-zinc-200/50 lg:text-lg md:text-base"
        } rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-500 placeholder:${
          isMobile ? "text-zinc-400" : "text-zinc-600"
        } [&::-webkit-search-cancel-button]:appearance-none`}
        dir="rtl"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            formRef.current?.requestSubmit()
          }
        }}
      />

      {searchQuery && (
        <button
          type="button"
          onClick={handleSearchClearClick}
          className="absolute inset-y-0 left-0 items-center pl-3 text-zinc-500 hover:text-zinc-700"
          aria-label="مسح البحث"
        >
          <X className={responsiveIconSize} />
        </button>
      )}
    </form>
  )
}
