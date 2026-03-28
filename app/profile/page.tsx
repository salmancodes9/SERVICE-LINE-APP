"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, GraduationCap, LogOut, Package } from "lucide-react"
import { getUser, clearUser, getItems, type UserInfo } from "@/lib/store"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUserState] = useState<UserInfo | null>(null)
  const [itemCount, setItemCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const userData = getUser()
    if (!userData) {
      router.push("/")
      return
    }
    setUserState(userData)
    
    // Count items listed by this user
    const items = getItems()
    const userItems = items.filter((item) => item.seller === userData.fullName)
    setItemCount(userItems.length)
  }, [router])

  const handleSignOut = () => {
    clearUser()
    router.push("/")
  }

  if (!mounted || !user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <User className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">{user.fullName}</CardTitle>
            <CardDescription>Student Profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">College</p>
                  <p className="font-medium text-foreground">{user.collegeName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Items Listed</p>
                  <p className="font-medium text-foreground">{itemCount}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <h3 className="mb-2 font-semibold text-foreground">About CampusCart</h3>
              <p className="text-sm text-muted-foreground">
                CampusCart is a student marketplace where juniors can buy and seniors can sell used academic items. Buy Smart. Save More. Reuse Senior Essentials.
              </p>
            </div>

            <Button
              variant="destructive"
              className="w-full gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
