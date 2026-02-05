"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type PreviousActionProps = {
  caseId: string;
};

export default function PreviousAction({ caseId }: PreviousActionProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_BASE = "http://localhost:3000";
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const handlePrevious = async () => {
    setIsLoading(true);
    setError(null);

    if (!userId) {
      setError("User not logged in.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/cases/${caseId}/previous`, {
        method: "POST",
        headers: {
          "x-user-id": userId,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error navigating to previous assignment");
      }

      const data = await res.json();

      if (data.currentAssignmentId) {
        router.push(`/cases/${caseId}/assignment/${data.currentAssignmentId}`);
      } else {
        setError("No previous assignment found.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handlePrevious}
        disabled={isLoading}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-md font-medium transition duration-200 disabled:opacity-50"
      >
        {isLoading ? "Loading..." : "Previous"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
