"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ivory-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Something went wrong!</h2>
          <p className="text-gray-500 mt-2 text-sm">
            We encountered an unexpected error. Our team has been notified.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 bg-maroon-600 text-white font-medium rounded-lg shadow hover:bg-maroon-700 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
