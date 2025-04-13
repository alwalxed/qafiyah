import { create } from "zustand"

interface NavState {
  mobileMenuOpen: boolean
  searchQuery: string
  toggleMobileMenu: () => void
  setSearchQuery: (query: string) => void
}

export const useNavStore = create<NavState>((set) => ({
  mobileMenuOpen: false,
  searchQuery: "",
  toggleMobileMenu: () =>
    set((state) => ({
      mobileMenuOpen: !state.mobileMenuOpen,
    })),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
}))
