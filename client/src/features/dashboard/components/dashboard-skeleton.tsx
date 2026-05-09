export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-56 animate-pulse rounded-xl bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-36 animate-pulse rounded-2xl border bg-muted/70" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="h-80 animate-pulse rounded-2xl border bg-muted/70 xl:col-span-2" />
        <div className="h-80 animate-pulse rounded-2xl border bg-muted/70" />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="h-72 animate-pulse rounded-2xl border bg-muted/70 xl:col-span-2" />
        <div className="h-72 animate-pulse rounded-2xl border bg-muted/70" />
      </div>
    </div>
  );
}
