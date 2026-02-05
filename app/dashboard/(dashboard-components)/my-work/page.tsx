"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/table"

interface Session {
  caseId: string
  createdAt: string
}

export default function MySessionsPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      const userId = localStorage.getItem("userId")
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000"

      try {
        const { data } = await axios.get(`${API_BASE}/sessions?t=${new Date().getTime()}`, {
          headers: { "x-user-id": userId }
        })
        setSessions(data)
      } catch (error) {
        console.error("Error fetching sessions", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSessions()
  }, [])

  if (isLoading) {
    return <div className="text-center py-10">Loading sessions...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Case ID</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <TableRow
              key={session.caseId}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => router.push(`/cases/${session.caseId}`)}
            >
              <TableCell className="font-medium text-gray-900">{session.caseId}</TableCell>
              <TableCell className="text-gray-500">
                {new Date(session.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={2} className="text-center text-gray-500">
              No active sessions found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}