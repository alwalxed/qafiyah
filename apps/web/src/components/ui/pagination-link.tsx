"use client"

import Link from "next/link"
import type { ReactNode } from "react"

type PaginationLinkProps = {
  href: string
  isDisabled: boolean
  prefetch?: boolean
  children: ReactNode
}

export function PaginationLink({ href, isDisabled, prefetch, children }: PaginationLinkProps) {
  return (
    <Link
      href={isDisabled ? "#" : href}
      className={isDisabled ? "cursor-not-allowed text-zinc-500" : "text-zinc-800"}
      aria-disabled={isDisabled}
      onClick={(e) => isDisabled && e.preventDefault()}
      prefetch={prefetch}
    >
      {children}
    </Link>
  )
}
