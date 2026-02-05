"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getInitials } from "../utils/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/dropdown-menu"
import { Button } from "../components/button"

export function UserMenu() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string | null; initials: string }>({ id: null, initials: "?" })

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (userId) {
      setUser({ id: userId, initials: getInitials(userId) })
    }
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("userId")
    localStorage.removeItem("role")
    router.push("/login")
    // Use reload to ensure all state is cleared, mimicking original app behavior
    setTimeout(() => window.location.reload(), 100)
  }

  if (!user.id) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="w-10 h-10 rounded-full bg-yellow-500 text-gray-900 font-medium hover:bg-yellow-400 focus:ring-yellow-400">
          {user.initials}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Signed in as <span className="font-medium">{user.id}</span></DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer">
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}