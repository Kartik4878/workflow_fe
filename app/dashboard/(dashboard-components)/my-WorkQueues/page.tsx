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

const MyWorkQueuesPage = () => {
  const [workQueues, setWorkQueues] = useState<string[]>([]);
  const [selectedWorkQueue, setSelectedWorkQueue] = useState<string>("");
  const [assignments, setAssignments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkQueues = async () => {
      try {
        const response = await fetch(`${API_BASE}/operators/operator`, {
          headers: {
            "x-user-id": localStorage.getItem("userId") || "",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch work queues");
        }
        const data = await response.json();
        if (data && data.workQueues && data.workQueues.length > 0) {
          setWorkQueues(data.workQueues);
          setSelectedWorkQueue(data.workQueues[0]);
        }
      } catch (err) {
        setError("Failed to load work queues.");
      }
    };
    fetchWorkQueues();
  }, []);

  useEffect(() => {
    if (selectedWorkQueue) {
      const fetchAssignments = async () => {
        try {
          const response = await fetch(
            `${API_BASE}/assignments/workqueue/${selectedWorkQueue}`,
            {
              headers: {
                "x-user-id": localStorage.getItem("userId") || "",
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch assignments");
          }
          const data = await response.json();
          setAssignments(data);
        } catch (err) {
          setError("Failed to load assignments.");
        }
      };
      fetchAssignments();
    }
  }, [selectedWorkQueue]);

  const handleWorkQueueChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedWorkQueue(e.target.value);
  };

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
      <div className="mb-6">
        <label
          htmlFor="workqueue-select"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Work Queue
        </label>
        <select
          id="workqueue-select"
          value={selectedWorkQueue}
          onChange={handleWorkQueueChange}
          className="border border-gray-300 rounded-md px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
        >
          {workQueues.map((queue) => (
            <option key={queue} value={queue}>
              {queue}
            </option>
          ))}
        </select>
      </div>
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
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <TableRow key={assignment.caseId}>
                  <TableCell className="font-medium">
                    {assignment.caseId}
                  </TableCell>
                  <TableCell>
                    {new Date(assignment.createdAt || "").toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getBadgeClass(assignment.status)}>
                      {assignment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No assignments found in this work queue.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MyWorkQueuesPage;