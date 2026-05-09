export function AppLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-full border bg-card px-4 py-2 text-sm text-muted-foreground shadow-soft">
        {label}
      </div>
    </div>
  );
}
