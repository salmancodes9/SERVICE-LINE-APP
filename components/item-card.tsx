"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle } from "lucide-react"
import type { Item } from "@/lib/store"

interface ItemCardProps {
  item: Item
  isNew?: boolean
}

const categoryColors: Record<string, string> = {
  books: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  instruments: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
  notes: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  other: "bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400",
}

export function ItemCard({ item, isNew = false }: ItemCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl dark:bg-card/50 dark:backdrop-blur-sm">
      {/* Image Container */}
      <div className="relative h-36 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {isNew && (
            <Badge className="bg-primary text-primary-foreground text-xs">
              New
            </Badge>
          )}
          <Badge
            className={`text-xs ${categoryColors[item.category]}`}
            variant="secondary"
          >
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-foreground line-clamp-1">
          {item.name}
        </h3>
        
        <p className="mt-0.5 text-xs text-muted-foreground">
          by {item.seller}
        </p>
        
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            ₹{item.price.toLocaleString()}
          </span>
          
          <button className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-all hover:bg-primary hover:text-primary-foreground">
            <MessageCircle className="h-3 w-3" />
            Contact
          </button>
        </div>
      </div>
    </Card>
  )
}
