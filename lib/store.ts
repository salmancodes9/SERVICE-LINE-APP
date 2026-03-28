export interface Item {
  id: string
  name: string
  price: number
  image: string
  seller: string
  category: "books" | "instruments" | "notes" | "other"
}

export interface UserInfo {
  fullName: string
  collegeName: string
}

const ITEMS_KEY = "marketplace_items"
const USER_KEY = "marketplace_user"

export const defaultItems: Item[] = [
  {
    id: "1",
    name: "Engineering Drafter",
    price: 500,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
    seller: "Senior",
    category: "instruments",
  },
  {
    id: "2",
    name: "Class 12 Physics Book",
    price: 250,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
    seller: "Senior",
    category: "books",
  },
  {
    id: "3",
    name: "Mathematics NCERT",
    price: 200,
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop",
    seller: "Senior",
    category: "books",
  },
  {
    id: "4",
    name: "Lab Coat",
    price: 300,
    image: "https://images.unsplash.com/photo-1581093458791-9d42e3c601db?w=400&h=300&fit=crop",
    seller: "Senior",
    category: "other",
  },
  {
    id: "5",
    name: "Engineering Graphics Kit",
    price: 600,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
    seller: "Senior",
    category: "instruments",
  },
  {
    id: "6",
    name: "Chemistry Notes",
    price: 150,
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop",
    seller: "Senior",
    category: "notes",
  },
]

export function getItems(): Item[] {
  if (typeof window === "undefined") return defaultItems
  const stored = localStorage.getItem(ITEMS_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  localStorage.setItem(ITEMS_KEY, JSON.stringify(defaultItems))
  return defaultItems
}

export function addItem(item: Omit<Item, "id">): Item {
  const items = getItems()
  const newItem: Item = {
    ...item,
    id: Date.now().toString(),
  }
  items.unshift(newItem)
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items))
  return newItem
}

export function getUser(): UserInfo | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(USER_KEY)
  return stored ? JSON.parse(stored) : null
}

export function setUser(user: UserInfo): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearUser(): void {
  localStorage.removeItem(USER_KEY)
}
