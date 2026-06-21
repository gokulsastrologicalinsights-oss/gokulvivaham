import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ivory-100 p-4">
      <div className="bg-white p-12 rounded-3xl shadow-xl max-w-lg w-full text-center space-y-8 border border-gray-100">
        <div className="relative">
          <h1 className="text-9xl font-black text-ivory-200">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center">
              <Search className="w-10 h-10 text-maroon-600" />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-gray-900">Page not found</h2>
          <p className="text-gray-500 text-lg">
            We couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-maroon-600 to-maroon-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
