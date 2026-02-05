"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import PreviousAction from "./PreviousAction";

// Basic type definitions, assuming a more robust solution will be provided.
interface Property {
  type: string;
  enum?: string[];
}

interface Schema {
  title: string;
  description: string;
  properties: { [key: string]: Property };
}

interface UIElement {
  type: string;
  scope: string;
  label?: string;
}

interface UISchema {
  elements: UIElement[];
}


interface SubmitAssignmentFormProps {
  caseId: string;
  schema: Schema;
  uischema: UISchema;
  isPreviousActionAllowed: boolean;
}

const renderFormControl = (key: string, property: Property, uischema: UISchema) => {
  const uiOptions = uischema.elements.find(el => el.scope === `#/properties/${key}`);
  
  switch (property.type) {
    case 'string':
      if (property.enum) {
        return (
          <select
            id={key}
            name={key}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {property.enum.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      }
      return (
        <input
          type="text"
          id={key}
          name={key}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      );
    case 'number':
    case 'integer':
      return (
        <input
          type="number"
          id={key}
          name={key}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      );
    case 'boolean':
      return (
          <input
            type="checkbox"
            id={key}
            name={key}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
      );
    default:
        return <input type="text" id={key} name={key} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />;
  }
};


export default function SubmitAssignmentForm({
  caseId,
  schema,
  uischema,
  isPreviousActionAllowed,
}: SubmitAssignmentFormProps) {
  const router = useRouter();
  const [notification, setNotification] = useState<{type: 'error' | 'info', message: string} | null>(null);


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotification(null);

    const formData = new FormData(event.currentTarget);
    const metadata: { [key: string]: any } = {};
    formData.forEach((value, key) => {
        if (event.currentTarget.elements.namedItem(key) instanceof HTMLInputElement && (event.currentTarget.elements.namedItem(key) as HTMLInputElement).type === 'checkbox') {
            metadata[key] = (event.currentTarget.elements.namedItem(key) as HTMLInputElement).checked;
        } else {
            metadata[key] = value;
        }
    });

    try {
      const res = await fetch(`http://localhost:3001/cases/${caseId}/next`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": localStorage.getItem("userId") || "1",
        },
        body: JSON.stringify(metadata),
      });

      const resp = await res.json();

      if (!res.ok) {
        const error: any = new Error(resp.error || "Error processing assignment");
        error.statusCode = res.status;
        throw error;
      }

      if (resp.currentAssignmentId) {
        router.push(`/cases/${caseId}/assignment/${resp.currentAssignmentId}`);
      } else {
        router.push(`/cases/${caseId}?status=completed`);
      }
    } catch (err: any) {
        if (err.statusCode === 402) {
            setNotification({ type: 'info', message: err.message || "The assignment has been routed appropriately." });
        } else {
            setNotification({ type: 'error', message: err.message || "There was an error while processing the assignment."});
        }
        
        setTimeout(() => {
            setNotification(null);
            router.push(`/cases/${caseId}`);
        }, 3000);
    }
  };
  
    const Notification = () => {
    if (!notification) return null;

    const isError = notification.type === 'error';
    const bgColor = isError ? 'bg-red-100' : 'bg-blue-100';
    const borderColor = isError ? 'border-red-500' : 'border-blue-500';
    const textColor = isError ? 'text-red-700' : 'text-blue-700';
    const iconColor = isError ? 'text-red-500' : 'text-blue-500';
    const title = isError ? 'Error' : 'Assignment Routed';

    return (
      <div className={`fixed bottom-4 right-4 ${bgColor} border-l-4 ${borderColor} ${textColor} p-4 rounded shadow-md z-50`}>
        <div className="flex">
          <div className="py-1">
            <svg className={`h-6 w-6 ${iconColor} mr-4`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isError ? "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" : "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
            </svg>
          </div>
          <div>
            <p className="font-bold">{title}</p>
            <p className="text-sm">{notification.message}</p>
          </div>
        </div>
      </div>
    );
  };


  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.entries(schema.properties).map(([key, property]) => {
            const uiElement = uischema.elements.find(el => el.scope === `#/properties/${key}`);
            return (
                <div key={key} className="flex flex-col">
                    <label htmlFor={key} className="mb-2 font-semibold text-gray-700">{uiElement?.label || key}</label>
                    {renderFormControl(key, property, uischema)}
                </div>
            );
        })}

        <div className="flex justify-between items-center mt-8">
          {isPreviousActionAllowed && <PreviousAction caseId={caseId as string} />}
          <button
            type="submit"
            className="cba-yellow text-gray-900 px-5 py-2 rounded-md font-medium hover:bg-yellow-500 transition duration-200"
          >
            Next
          </button>
        </div>
      </form>
      <Notification />
    </>
  );
}