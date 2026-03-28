"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ShoppingBag, Users, ArrowRight, Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { getUser, setUser } from "@/lib/store"

export default function LandingPage() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [showForm, setShowForm] = useState(false)
  const [fullName, setFullName] = useState("")
  const [collegeName, setCollegeName] = useState("")
  const [errors, setErrors] = useState({ fullName: "", collegeName: "" })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const user = getUser()
    if (user) {
      router.push("/marketplace")
    }
  }, [router])

  const handleGetStarted = () => {
    setShowForm(true)
  }

  const validateForm = () => {
    const newErrors = { fullName: "", collegeName: "" }
    let isValid = true

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required"
      isValid = false
    }

    if (!collegeName.trim()) {
      newErrors.collegeName = "College name is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setUser({ fullName: fullName.trim(), collegeName: collegeName.trim() })
      router.push("/marketplace")
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Theme Toggle */}
      <div className="absolute right-4 top-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        {!showForm ? (
          <div className="text-center">
            {/* Logo */}
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-lg">
              <BookOpen className="h-10 w-10 text-primary-foreground" />
            </div>

            {/* Hero Text */}
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              CampusCart
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
              Buy Smart. Save More. Reuse Senior Essentials.
            </p>

            {/* CTA Button */}
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="mt-8 gap-2 px-8 py-6 text-lg"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Button>

            {/* Features */}
            <div className="mt-16 grid gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Buy & Sell</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Trade academic essentials with fellow students
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Trusted Network</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Connect with verified students from your campus
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Academic Focus</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  From textbooks to lab coats, find everything you need
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
                <BookOpen className="h-7 w-7 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Welcome to CampusCart</CardTitle>
              <CardDescription>
                Tell us a bit about yourself to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={errors.fullName ? "border-destructive" : ""}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive">{errors.fullName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collegeName">College Name</Label>
                  <Input
                    id="collegeName"
                    placeholder="Enter your college name"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className={errors.collegeName ? "border-destructive" : ""}
                  />
                  {errors.collegeName && (
                    <p className="text-sm text-destructive">{errors.collegeName}</p>
                  )}
                </div>
                <Button type="submit" className="w-full gap-2">
                  Continue to Marketplace
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
