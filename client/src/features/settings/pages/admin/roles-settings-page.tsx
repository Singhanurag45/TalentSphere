import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROLES } from "@/shared/config/roles";

import { fetchUsersForRoles, updateUserRole } from "../../api/settings-api";
import type { UserRoleRow } from "../../types/settings";
import { SettingsSection } from "../../components/settings-section";

export function RolesSettingsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["settings-users-roles", page, search],
    queryFn: () => fetchUsersForRoles(page, 15, search || undefined),
  });

  const mutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: "admin" | "employee" }) =>
      updateUserRole(id, role),
    onSuccess: () => {
      toast.success("Role updated");
      queryClient.invalidateQueries({ queryKey: ["settings-users-roles"] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data
        ?.message;
      toast.error(msg || "Could not update role");
    },
  });

  const items = data?.items ?? [];
  const meta = data?.meta;

  return (
    <SettingsSection
      title="Role management"
      description="Assign admin or employee access. You cannot change your own role here."
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        {meta && (
          <p className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.pages} · {meta.total} users
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u: UserRoleRow) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
                      value={u.role}
                      disabled={mutation.isPending}
                      onChange={(e) => {
                        const role = e.target.value as "admin" | "employee";
                        mutation.mutate({ id: u.id, role });
                      }}
                    >
                      <option value={ROLES.ADMIN}>Admin</option>
                      <option value={ROLES.EMPLOYEE}>Employee</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && meta.pages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= meta.pages}
            onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </SettingsSection>
  );
}
