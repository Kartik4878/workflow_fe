"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/table";
import { Badge } from "@/app/components/badge";

const API_BASE = "http://localhost:3000";

const AllCasesPage = () => {
  const [cases, setCases] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch(`${API_BASE}/cases`, {
          headers: {
            "x-user-id": localStorage.getItem("userId") || "",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch cases");
        }
        const data = await response.json();
        setCases(data);
      } catch (err) {
        setError("Failed to load cases.");
      }
    };
    fetchCases();
  }, []);

  const getBadgeClass = (status: string) => {
    switch (status) {
      case "Review":
        return "bg-blue-100 text-blue-800";
      case "InProgress":
        return "cba-yellow text-gray-900";
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case ID</TableHead>
              <TableHead>Case Type ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Updated By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.length > 0 ? (
              cases.map((caseItem) => (
                <TableRow key={caseItem.caseId}>
                  <TableCell className="font-medium">
                    {caseItem.caseId}
                  </TableCell>
                  <TableCell>{caseItem.caseTypeId}</TableCell>
                  <TableCell>
                    <Badge className={getBadgeClass(caseItem.status)}>
                      {caseItem.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{caseItem.createdBy}</TableCell>
                  <TableCell>
                    {new Date(caseItem.updatedAt || "").toLocaleString()}
                  </TableCell>
                  <TableCell>{caseItem.updatedBy}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No cases found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AllCasesPage;