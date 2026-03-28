"use client"

import { Input } from "@/components/ui/input"
import { Search, Book, Wrench, FileText, LayoutGrid } from "lucide-react"

interface SearchFilterProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const categories = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "books", label: "Books", icon: Book },
  { id: "instruments", label: "Instruments", icon: Wrench },
  { id: "notes", label: "Notes", icon: FileText },
]

export function SearchFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: SearchFilterProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 lg:max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for items..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-12 rounded-xl border-border bg-background pl-12 text-base transition-all focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = selectedCategory === category.id
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
