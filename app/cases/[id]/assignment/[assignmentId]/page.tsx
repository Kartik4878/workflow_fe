"use client";

import React, { useEffect, useState } from "react";

import PreviousAction from "../PreviousAction";



type AssignmentParams = {

  id: string;

  assignmentId: string;

};



type AssignmentData = {

  label: string;

  status: string;

  assignedTo: string;

  assignedToType: string;

  metadata: {

    [key: string]: {

      label: string;

      value: string;

      type: string;

      required: boolean;

    };

  };

  caseType: string;

  processId: string;

  assignmentKey: string;

};



type CaseData = {

    metadata: {

        [key: string]: any;

    }

};



export default function PerformAssignmentPage({

  params,

}: {

  params: Promise<AssignmentParams>;

}) {

  const { id: caseId, assignmentId } = React.use(params);

  const [assignmentData, setAssignmentData] = useState<AssignmentData | null>(null);

  const [caseData, setCaseData] = useState<CaseData | null>(null);

  const [error, setError] = useState<string | null>(null);

  const API_BASE = "http://localhost:3000";

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;



  useEffect(() => {

    if (!userId) {

        // Handle case where user is not logged in

        return;

    }

    const fetchAssignmentData = async () => {

      try {

        const caseRes = await fetch(`${API_BASE}/cases/${caseId}`, {

            headers: { 'x-user-id': userId }

        });

        const caseData = await caseRes.json();

        setCaseData(caseData);



        const assignmentRes = await fetch(`${API_BASE}/assignments/${assignmentId}`, {

            headers: { 'x-user-id': userId }

        });

        

        if (!assignmentRes.ok) {

            const errorData = await assignmentRes.json();

            throw new Error(errorData.error || "Error loading assignment");

        }



        const assignmentData = await assignmentRes.json();

        setAssignmentData(assignmentData);



      } catch (err: any) {

        setError(err.message);

      }

    };



    fetchAssignmentData();

  }, [caseId, assignmentId, userId]);



  if (error) {

    return <div className="text-red-500">Error: {error}</div>;

  }



  if (!assignmentData || !caseData) {

    return <div>Loading...</div>;

  }



  const { label, status, assignedTo, assignedToType, metadata } = assignmentData;

  const caseMetadata = caseData.metadata || {};



  return (

    <div>

      <div className="flex justify-between items-center mb-6">

        <h3 className="text-xl font-bold text-gray-800">{label}</h3>

        <span className={`px-2 py-1 rounded-full text-xs font-medium`}>

          {status}

        </span>

      </div>

      <form>

        {Object.entries(metadata).map(([key, { label, type, required }]) => (

          <div key={key} className="mb-5">

            <label className="block font-medium text-gray-700 mb-1">

              {label}

            </label>

            <input

              name={key}

              defaultValue={caseMetadata[key] || ""}

              type={type}

              required={required}

              className="border border-gray-300 rounded-md px-3 py-2 w-full"

            />

          </div>

        ))}

        <div className="flex justify-between mt-6">

            <div className="flex space-x-3">

                <PreviousAction caseId={caseId} />

                <button type="button" className="bg-red-500 text-white px-5 py-2">Close</button>

            </div>

            <div className="flex space-x-3">

                <button type="button" className="bg-blue-500 text-white px-5 py-2">Save</button>

                <button type="submit" className="bg-yellow-400 text-gray-900 px-5 py-2">Next</button>

            </div>

        </div>

      </form>

    </div>

  );

}
