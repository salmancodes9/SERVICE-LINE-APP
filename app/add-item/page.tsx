"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, Check } from "lucide-react"
import { addItem, getUser } from "@/lib/store"

export default function AddItemPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)
  const [itemName, setItemName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState<"books" | "instruments" | "notes" | "other">("books")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [errors, setErrors] = useState({ itemName: "", price: "" })
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
    const user = getUser()
    if (!user) {
      router.push("/")
    }
  }, [router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validateForm = () => {
    const newErrors = { itemName: "", price: "" }
    let isValid = true

    if (!itemName.trim()) {
      newErrors.itemName = "Item name is required"
      isValid = false
    }

    if (!price.trim()) {
      newErrors.price = "Price is required"
      isValid = false
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "Please enter a valid price"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      const user = getUser()
      addItem({
        name: itemName.trim(),
        price: Number(price),
        image: imagePreview || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop",
        seller: user?.fullName || "Anonymous",
        category,
      })
      setSuccess(true)
      setTimeout(() => {
        router.push("/marketplace")
      }, 1500)
    }
  }

  if (!mounted) {
    return null
  }

  const categories = [
    { id: "books", label: "Books" },
    { id: "instruments", label: "Instruments" },
    { id: "notes", label: "Notes" },
    { id: "other", label: "Other" },
  ] as const

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Add New Item</CardTitle>
            <CardDescription>
              List an item for sale to other students
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Item Added Successfully!
                </h3>
                <p className="mt-1 text-muted-foreground">
                  Redirecting to marketplace...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Item Image</Label>
                  {imagePreview ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors hover:bg-muted"
                    >
                      <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload an image
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                {/* Item Name */}
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input
                    id="itemName"
                    placeholder="e.g., Engineering Drafter Set"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className={errors.itemName ? "border-destructive" : ""}
                  />
                  {errors.itemName && (
                    <p className="text-sm text-destructive">{errors.itemName}</p>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={errors.price ? "border-destructive" : ""}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">{errors.price}</p>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {categories.map((cat) => (
                      <Button
                        key={cat.id}
                        type="button"
                        variant={category === cat.id ? "default" : "outline"}
                        onClick={() => setCategory(cat.id)}
                        className="w-full"
                      >
                        {cat.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Add Item to Marketplace
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
