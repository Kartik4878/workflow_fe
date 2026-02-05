"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Clock, 
  FileText, 
  History, 
  Play, 
  CheckCircle
} from "lucide-react"

import { Button } from "../../components/button"
import {
  Popup,
  PopupContent,
  PopupHeader,
  PopupTitle,
  PopupFooter,
} from "../../components/popup"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/table"

// Helper for badge class
function getBadgeClass(status: string | undefined | null): string {
  switch (status) {
    case 'Review': return 'bg-blue-100 text-blue-800';
    case 'InProgress': return 'bg-yellow-400 text-gray-900';
    case 'Resolved': return 'bg-green-100 text-green-800';
    case 'Failed': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

interface CaseDetails {
  caseId: string
  label?: string
  status: string
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  currentAssignmentId?: string
  metadata?: Record<string, unknown>
}

interface HistoryItem {
  createdAt: string
  description: string
  createdBy: string
}

export default function CaseDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [caseData, setCaseData] = useState<CaseDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal states
  const [isMetadataOpen, setIsMetadataOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [historyData, setHistoryData] = useState<HistoryItem[]>([])
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchCaseDetails = async () => {
      const userId = localStorage.getItem("userId")
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000"

      try {
        const { data } = await axios.get(`${API_BASE}/cases/${id}`, {
          headers: { "x-user-id": userId }
        })
        setCaseData(data)
      } catch (err) {
        console.error("Error fetching case details", err)
        setError("Failed to load case details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCaseDetails()
  }, [id])

  const fetchHistory = async () => {
    setIsHistoryOpen(true)
    setIsHistoryLoading(true)
    const userId = localStorage.getItem("userId")
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000"

    try {
      const { data } = await axios.get(`${API_BASE}/history/${id}`, {
        headers: { "x-user-id": userId }
      })
      setHistoryData(data)
    } catch (err) {
      console.error("Error fetching history", err)
    } finally {
      setIsHistoryLoading(false)
    }
  }

  const handlePerformAssignment = () => {
    if (caseData?.currentAssignmentId) {
      router.push(`/cases/${id}/assignment/${caseData.currentAssignmentId}`);
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading case details...</div>
  if (error || !caseData) return <div className="text-center py-10 text-red-500">{error || "Case not found"}</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6 pl-0 hover:bg-transparent hover:text-gray-600" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Case Details</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeClass(caseData.status)}`}>
            {caseData.status}
          </span>
        </div>

        {/* Modern Card Layout */}
        <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6 mb-6">
          {/* Case ID and Label Section */}
          <div className="mb-6 border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{caseData.label || 'Case'}</h3>
            <div className="flex items-center text-gray-500">
              <FileText className="h-5 w-5 mr-2" />
              <span className="font-mono text-sm">{caseData.caseId}</span>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="mb-6">
            <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Timeline</h4>
            
            <div className="flex items-start mb-3">
              <div className="bg-green-100 rounded-full p-1 mr-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Created by {caseData.createdBy}</p>
                <p className="text-xs text-gray-500">{new Date(caseData.createdAt).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1 mr-3">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Updated by {caseData.updatedBy}</p>
                <p className="text-xs text-gray-500">{new Date(caseData.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex flex-wrap gap-3">
            {caseData.currentAssignmentId && (
              <Button variant="yellow" onClick={handlePerformAssignment}>
                <Play className="h-5 w-5 mr-2" />
                Perform Assignment
              </Button>
            )}
            
            <Button variant="secondary" onClick={() => setIsMetadataOpen(true)}>
              <FileText className="h-5 w-5 mr-2" />
              Case Data
            </Button>
            
            <Button variant="secondary" onClick={fetchHistory}>
              <History className="h-5 w-5 mr-2" />
              Case History
            </Button>
          </div>
        </div>
      </div>

      {/* Metadata Popup */}
      <Popup open={isMetadataOpen} onOpenChange={setIsMetadataOpen}>
        <PopupContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <PopupHeader>
            <PopupTitle>Case Data</PopupTitle>
          </PopupHeader>
          <div className="mt-4">
            <Table>
              <TableBody>
                {caseData.metadata && Object.keys(caseData.metadata).length > 0 ? (
                  Object.entries(caseData.metadata).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-semibold bg-gray-50 w-1/3">{key}</TableCell>
                      <TableCell>
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-gray-500">No metadata available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <PopupFooter>
            <Button variant="outline" onClick={() => setIsMetadataOpen(false)}>Close</Button>
          </PopupFooter>
        </PopupContent>
      </Popup>

      {/* History Popup */}
      <Popup open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <PopupContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <PopupHeader>
            <PopupTitle>Case History</PopupTitle>
          </PopupHeader>
          <div className="mt-4">
            {isHistoryLoading ? (
              <div className="text-center py-4">Loading history...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Created At</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyData.length > 0 ? (
                    historyData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.createdBy}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-gray-500">No history available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
          <PopupFooter>
            <Button variant="outline" onClick={() => setIsHistoryOpen(false)}>Close</Button>
          </PopupFooter>
        </PopupContent>
      </Popup>
    </div>
  )
}