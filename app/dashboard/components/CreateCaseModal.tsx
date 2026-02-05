"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import {
  Popup,
  PopupContent,
  PopupHeader,
  PopupTitle,
  PopupTrigger,
} from "../../components/popup"
import { Button } from "../../components/button"
import { Label } from "../../components/label"

export function CreateCaseModal({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [caseTypes, setCaseTypes] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (open) {
      fetchCaseTypes()
    }
  }, [open])

  const fetchCaseTypes = async () => {
    setIsLoading(true)
    try {
      const userId = localStorage.getItem("userId")
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000"
      const { data } = await axios.get(`${API_BASE}/cases/types`, {
        headers: { "x-user-id": userId }
      })
      setCaseTypes(data)
      if (data.length > 0) setSelectedType(data[0])
    } catch (error) {
      console.error("Failed to fetch case types", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!selectedType) return

    setIsCreating(true)
    try {
      const userId = localStorage.getItem("userId")
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000"
      
      const { data } = await axios.post(
        `${API_BASE}/cases`,
        { caseTypeId: selectedType, userId },
        { headers: { "x-user-id": userId } }
      )

      setOpen(false)
      if (data && data.caseId) {
        router.push(`/cases/${data.caseId}`)
      } else {
        // Fallback if no ID returned, though API should return it
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to create case", error)
      alert("Failed to create case")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Popup open={open} onOpenChange={setOpen}>
      <PopupTrigger asChild>
        {children}
      </PopupTrigger>
      <PopupContent className="sm:max-w-[425px]">
        <PopupHeader>
          <PopupTitle>Create Case</PopupTitle>
        </PopupHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="case-type">Select Case Type</Label>
            {isLoading ? (
              <div className="text-sm text-gray-500">Loading types...</div>
            ) : (
              <select
                id="case-type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {caseTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            )}
          </div>
          <Button 
            variant="yellow" 
            onClick={handleCreate} 
            disabled={isLoading || isCreating || caseTypes.length === 0}
            className="w-full"
          >
            {isCreating ? "Creating..." : "Create Case"}
          </Button>
        </div>
      </PopupContent>
    </Popup>
  )
}