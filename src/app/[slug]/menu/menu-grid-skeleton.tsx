// features/menu/components/menu-grid-skeleton.tsx

export function MenuGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-28">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-64 rounded-3xl animate-pulse bg-ui-border"
        />
      ))}
    </div>
  );
}