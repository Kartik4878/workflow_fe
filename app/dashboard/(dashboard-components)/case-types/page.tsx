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
import { useRouter } from "next/navigation";

const API_BASE = "http://localhost:3000";

const CaseTypesPage = () => {
  const [caseTypes, setCaseTypes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCaseTypes = async () => {
      try {
        const response = await fetch(`${API_BASE}/cases/types`, {
          headers: {
            "x-user-id": localStorage.getItem("userId") || "",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch case types");
        }
        const data = await response.json();
        setCaseTypes(data);
      } catch (err) {
        setError("Failed to load case types.");
      }
    };
    fetchCaseTypes();
  }, []);

  const handleCaseTypeClick = (caseType: string) => {
    router.push(`/dashboard/case-types/${caseType}`);
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
              <TableHead>Case Types</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {caseTypes.length > 0 ? (
              caseTypes.map((caseType) => (
                <TableRow
                  key={caseType}
                  className="cursor-pointer hover:bg-gray-50 transition duration-150"
                  onClick={() => handleCaseTypeClick(caseType)}
                >
                  <TableCell className="font-medium">{caseType}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="text-center">
                  No case types found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CaseTypesPage;