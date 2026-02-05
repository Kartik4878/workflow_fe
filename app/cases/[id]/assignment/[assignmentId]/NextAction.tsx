"use client";

type NextActionProps = {
  isLoading: boolean;
};

export default function NextAction({ isLoading }: NextActionProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="bg-yellow-400 text-gray-900 px-5 py-2 rounded-md font-medium hover:bg-yellow-500 transition duration-200 disabled:opacity-50"
    >
      {isLoading ? "Submitting..." : "Next"}
    </button>
  );
}
