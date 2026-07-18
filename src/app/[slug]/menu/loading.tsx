export default function MenuLoading() {
  return (
    <div className="min-h-screen bg-ui-bg">
      <div className="h-14 bg-ui-bg border-b border-gray-100" />

      <div className="mx-auto max-w-7xl px-4 py-5 space-y-5">
        <div className="h-11 rounded-2xl bg-ui-bg animate-pulse" />

        <div className="flex gap-2 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 rounded-2xl bg-ui-bg-muted
                         animate-pulse shrink-0"
            />
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-3xl bg-ui-border animate-pulse h-64"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
