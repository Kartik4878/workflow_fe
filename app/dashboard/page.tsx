"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function CaseTypesPage() {
  const router = useRouter()
  const [caseTypes, setCaseTypes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCaseTypes = async () => {
      const userId = localStorage.getItem("userId")
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000"

      try {
        const { data } = await axios.get(`${API_BASE}/cases/types`, {
          headers: { "x-user-id": userId }
        })
        setCaseTypes(data)
      } catch (error) {
        console.error("Error fetching case types", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCaseTypes()
  }, [])

  if (isLoading) {
    return <div className="text-center py-10">Loading case types...</div>
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <th className="py-3 px-6">Case Types</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {caseTypes.length > 0 ? (
            caseTypes.map((caseType) => (
              <tr 
                key={caseType} 
                className="cursor-pointer hover:bg-gray-50 transition duration-150"
                // In app.js this calls loadCaseTypeSchema. We'll route to a detail page.
                onClick={() => router.push(`/dashboard/case-types/${caseType}`)}
              >
                <td className="py-4 px-6 font-medium text-gray-900">{caseType}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="py-4 px-6 text-center text-gray-500">No case types found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}