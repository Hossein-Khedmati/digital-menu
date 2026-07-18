export default function MenuLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="h-14 bg-white border-b border-gray-100" />

      <div className="mx-auto max-w-3xl px-4 py-5 space-y-5">
        {/* Search skeleton */}
        <div className="h-11 rounded-2xl bg-gray-200 animate-pulse" />

        {/* Category bar skeleton */}
        <div className="flex gap-2 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 rounded-2xl bg-gray-200
                         animate-pulse shrink-0"
            />
          ))}
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-3xl bg-gray-200 animate-pulse h-64" />
          ))}
        </div>
      </div>
    </div>
  )
}