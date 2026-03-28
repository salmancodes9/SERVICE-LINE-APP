"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ItemCard } from "@/components/item-card"
import { SearchFilter } from "@/components/search-filter"
import { getItems, getUser, type Item } from "@/lib/store"
import { ShoppingBag, Sparkles } from "lucide-react"

export default function MarketplacePage() {
  const router = useRouter()
  const [items, setItems] = useState<Item[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const user = getUser()
    if (!user) {
      router.push("/")
      return
    }
    setItems(getItems())
  }, [router])

  useEffect(() => {
    const handleStorageChange = () => {
      setItems(getItems())
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [items, searchQuery, selectedCategory])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Header Section */}
        <div className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Marketplace
                </h1>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Browse and buy used academic items from seniors
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="border-b border-border bg-background/50 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <SearchFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>

        {/* Products Grid Section */}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {filteredItems.length > 0 ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{filteredItems.length}</span> items
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Sparkles className="h-3 w-3" />
                  <span>Updated just now</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {filteredItems.map((item, index) => (
                  <ItemCard key={item.id} item={item} isNew={index < 2} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                No items found
              </h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Try adjusting your search or filter to find what you&apos;re looking for
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
