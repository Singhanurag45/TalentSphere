import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/shared/lib/cn";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  mobileLabel?: string;
  render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  emptyState?: ReactNode;
  onRowClick?: (row: T) => void;
};

export function DataTable<T>({
  columns,
  data,
  rowKey,
  isLoading = false,
  emptyState,
  onRowClick,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex h-56 items-center justify-center rounded-2xl border bg-card shadow-soft">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center shadow-soft">
        {emptyState || (
          <p className="text-sm text-muted-foreground">No records found.</p>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border bg-card shadow-soft md:block">
        <table className="w-full border-separate border-spacing-0">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                    column.className,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const key = rowKey(row);
              return (
                <tr
                  key={key}
                  className={cn(
                    "border-t transition",
                    onRowClick && "cursor-pointer hover:bg-muted/40",
                  )}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn("px-4 py-3 text-sm", column.className)}
                    >
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {data.map((row) => {
          const key = rowKey(row);
          return (
            <article
              key={key}
              className={cn(
                "space-y-2 rounded-2xl border bg-card p-4 shadow-soft",
                onRowClick && "cursor-pointer",
              )}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column) => (
                <div
                  key={column.key}
                  className="flex items-start justify-between gap-3 text-sm"
                >
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {column.mobileLabel || column.header}
                  </span>
                  <span className="text-right">{column.render(row)}</span>
                </div>
              ))}
            </article>
          );
        })}
      </div>
    </>
  );
}
