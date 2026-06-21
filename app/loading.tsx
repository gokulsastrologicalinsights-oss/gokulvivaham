export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory-100">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-maroon-200 border-t-maroon-700 rounded-full animate-spin"></div>
        <p className="text-maroon-800 font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
