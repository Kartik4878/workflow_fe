"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus } from "lucide-react"
import axios from "axios"

import { Button } from "../components/button"
import { CreateCaseModal } from "./components/CreateCaseModal"
import { cn } from "../utils/utils"

type UserRole = "Admin" | "User" | null

interface NavLink {
  href: string
  label: string
}

const adminLinks: NavLink[] = [
  { href: "/dashboard/case-types", label: "All Case types" },
  { href: "/dashboard/operators", label: "All Operators" },
]

export function DashboardNav() {
  const pathname = usePathname()
  const [role, setRole] = useState<UserRole>(null)
  const [hasSessions, setHasSessions] = useState(false)

  useEffect(() => {
    const userRole = localStorage.getItem("role") as UserRole
    const userId = localStorage.getItem("userId")
    setRole(userRole)

    // If user is not admin, check for sessions to conditionally show the tab
    if (userRole !== "Admin" && userId) {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000"
      axios.get(`${API_BASE}/sessions`, {
        headers: { "x-user-id": userId }
      })
      .then(res => {
        if (res.data && res.data.length > 0) {
          setHasSessions(true)
        }
      })
      .catch(err => console.error("Failed to check sessions", err))
    }
  }, [])

  // Construct user links dynamically based on sessions
  const userLinks: NavLink[] = [
    ...(hasSessions ? [{ href: "/dashboard/my-sessions", label: "My Sessions" }] : []),
    { href: "/dashboard/my-work", label: "My Work" },
    { href: "/dashboard/my-WorkQueues", label: "My WorkQueues" },
    { href: "/dashboard/all-cases", label: "All Cases" },
  ]

  const links = role === "Admin" ? adminLinks : userLinks
  const title = role === "Admin" ? "Admin Dashboard" : "Cases Dashboard"

  const ActionButton = () => {
    if (role === "Admin") {
      // TODO: This button should open a modal to create a new case type.
      return (
        <Button variant="yellow">
          <Plus className="h-5 w-5 mr-1" />
          Add Case Type
        </Button>
      )
    }
    // TODO: This button should open a modal to create a new case.
    return (
      <CreateCaseModal>
        <Button variant="yellow">
          <Plus className="h-5 w-5 mr-1" />
          Create Case
        </Button>
      </CreateCaseModal>
    )
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <div className="flex gap-4">
          <ActionButton />
        </div>
      </div>

      <div className="mt-8 mb-4 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href)
            return (
              <li key={link.href} className="mr-2">
                <Link
                  href={link.href}
                  className={cn(
                    "inline-block p-4 border-b-2 rounded-t-lg",
                    isActive
                      ? "border-yellow-400 text-gray-900 font-semibold"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}