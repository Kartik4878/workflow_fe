"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Pencil } from "lucide-react"
import {
  Popup,
  PopupContent,
  PopupHeader,
  PopupTitle,
  PopupFooter,
} from "../../../components/popup";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/table"
import { Button } from "../../../components/button"

import { Input } from "../../../components/input"
import { Label } from "../../../components/label"

interface Operator {
  userName: string
  operatorId: string
  workGroups?: string[]
  workQueues?: string[]
  role?: "Admin" | "User"
}

export default function OperatorsPage() {
  const [operators, setOperators] = useState<Operator[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null)
  
  // Form states
  const [formData, setFormData] = useState<Operator | null>(null)

  const fetchOperators = async () => {
    const userId = localStorage.getItem("userId")
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000"

    try {
      const { data } = await axios.get<Operator[]>(`${API_BASE}/operators`, {
        headers: { "x-user-id": userId },
      })
      setOperators(data)
    } catch (error) {
      console.error("Error fetching operators", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOperators()
  }, [])

  const handleEdit = (operator: Operator) => {
    setSelectedOperator(operator)
    setFormData({ ...operator })
    setIsEditOpen(true)
  }

  const handleSave = async () => {
    if (!formData || !selectedOperator) return

    const userId = localStorage.getItem("userId")
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000"

    try {
      // Prepare data for API (ensure arrays are arrays)
      const updatedOperator = {
        UserName: formData.userName,
        role: formData.role,
        WorkGroups: Array.isArray(formData.workGroups) 
          ? formData.workGroups 
          : (formData.workGroups as unknown as string).split(',').map((s: string) => s.trim()).filter(Boolean),
        workQueues: Array.isArray(formData.workQueues)
          ? formData.workQueues
          : (formData.workQueues as unknown as string).split(',').map((s: string) => s.trim()).filter(Boolean),
        OperatorId: selectedOperator.operatorId
      }

      await axios.put(`${API_BASE}/operators/${selectedOperator.operatorId}`, updatedOperator, {
        headers: { 
          "Content-Type": "application/json",
          "x-user-id": userId 
        },
      })

      // Refresh list and close modal
      await fetchOperators()
      setIsEditOpen(false)
      alert("Operator updated successfully")
    } catch (error) {
      console.error("Failed to update operator", error)
      alert("Failed to update operator")
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading operators...</div>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Name</TableHead>
            <TableHead>Operator ID</TableHead>
            <TableHead>Work Groups</TableHead>
            <TableHead>Work Queues</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {operators.length > 0 ? (
            operators.map((operator) => (
              <TableRow key={operator.operatorId}>
                <TableCell className="font-medium text-gray-900">{operator.userName}</TableCell>
                <TableCell className="text-gray-500">{operator.operatorId}</TableCell>
                <TableCell className="text-gray-500">{operator.workGroups?.join(", ") || ""}</TableCell>
                <TableCell className="text-gray-500">{operator.workQueues?.join(", ") || ""}</TableCell>
                <TableCell className="text-gray-500">{operator.role || ""}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(operator)} className="text-blue-600 hover:text-blue-900">
                    <Pencil className="h-5 w-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500">
                No operators found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Popup open={isEditOpen} onOpenChange={setIsEditOpen}>
        <PopupContent className="sm:max-w-[425px]">
          <PopupHeader>
            <PopupTitle>Edit Operator: {selectedOperator?.operatorId}</PopupTitle>
          </PopupHeader>
          {formData && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="userName">User Name</Label>
                <Input
                  id="userName"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as "Admin" | "User" })}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="workGroups">Work Groups (comma-separated)</Label>
                <Input
                  id="workGroups"
                  value={Array.isArray(formData.workGroups) ? formData.workGroups.join(", ") : formData.workGroups}
                  onChange={(e) => setFormData({ ...formData, workGroups: e.target.value.split(',').map(s => s.trim()) })}
                />
                <p className="text-xs text-gray-500">Enter multiple values separated by commas</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="workQueues">Work Queues (comma-separated)</Label>
                <Input
                  id="workQueues"
                  value={Array.isArray(formData.workQueues) ? formData.workQueues.join(", ") : formData.workQueues}
                  onChange={(e) => setFormData({ ...formData, workQueues: e.target.value.split(',').map(s => s.trim()) })}
                />
                <p className="text-xs text-gray-500">Enter multiple values separated by commas</p>
              </div>
            </div>
          )}
          <PopupFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button variant="yellow" onClick={handleSave}>
              Save Changes
            </Button>
          </PopupFooter>
        </PopupContent>
      </Popup>
    </>
  )
}