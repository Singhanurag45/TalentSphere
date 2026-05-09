import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";

import {
  createDepartment,
  deleteDepartment,
  fetchDepartments,
  updateDepartment,
} from "../../api/settings-api";
import type { DepartmentRow } from "../../types/settings";
import { SettingsSection } from "../../components/settings-section";

type DeptForm = { name: string; code: string; description: string; isActive: boolean };

const emptyForm = (): DeptForm => ({
  name: "",
  code: "",
  description: "",
  isActive: true,
});

export function DepartmentsSettingsPage() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<DeptForm>(emptyForm());
  const [editing, setEditing] = useState<DepartmentRow | null>(null);
  const [editForm, setEditForm] = useState<DeptForm>(emptyForm());

  const { data, isLoading } = useQuery({
    queryKey: ["settings-departments"],
    queryFn: fetchDepartments,
  });

  const rows = (data ?? []) as DepartmentRow[];

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["settings-departments"] });
  };

  const createMut = useMutation({
    mutationFn: () =>
      createDepartment({
        name: createForm.name,
        code: createForm.code,
        description: createForm.description || undefined,
      }),
    onSuccess: () => {
      toast.success("Department created");
      setCreateOpen(false);
      setCreateForm(emptyForm());
      invalidate();
    },
    onError: () => toast.error("Could not create (duplicate code?)"),
  });

  const updateMut = useMutation({
    mutationFn: () =>
      updateDepartment(editing!._id, {
        name: editForm.name,
        code: editForm.code,
        description: editForm.description,
        isActive: editForm.isActive,
      }),
    onSuccess: () => {
      toast.success("Department updated");
      setEditing(null);
      invalidate();
    },
    onError: () => toast.error("Could not update"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteDepartment(id),
    onSuccess: () => {
      toast.success("Department removed");
      invalidate();
    },
    onError: () => toast.error("Could not delete"),
  });

  const openEdit = (row: DepartmentRow) => {
    setEditing(row);
    setEditForm({
      name: row.name,
      code: row.code,
      description: row.description,
      isActive: row.isActive,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <SettingsSection
      title="Departments"
      description="Maintain department codes used across employees and reporting."
    >
      <div className="mb-4 flex justify-end">
        <Modal open={createOpen} onOpenChange={setCreateOpen}>
          <ModalTrigger asChild>
            <Button type="button" className="gap-2 rounded-xl">
              <Plus className="h-4 w-4" /> Add department
            </Button>
          </ModalTrigger>
          <ModalContent>
            <ModalTitle>New department</ModalTitle>
            <div className="mt-4 space-y-3">
              <Input
                placeholder="Name"
                value={createForm.name}
                onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
              />
              <Input
                placeholder="Code (e.g. ENG)"
                value={createForm.code}
                onChange={(e) => setCreateForm((f) => ({ ...f, code: e.target.value }))}
              />
              <Input
                placeholder="Description"
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, description: e.target.value }))
                }
              />
              <div className="flex justify-end gap-2 pt-2">
                <ModalClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </ModalClose>
                <Button
                  type="button"
                  disabled={createMut.isPending || !createForm.name || !createForm.code}
                  onClick={() => createMut.mutate()}
                >
                  Create
                </Button>
              </div>
            </div>
          </ModalContent>
        </Modal>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Code</th>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row._id} className="border-b last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{row.code}</td>
                <td className="px-4 py-3 font-medium">{row.name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {row.isActive ? "Active" : "Inactive"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9"
                    onClick={() => openEdit(row)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 text-destructive"
                    onClick={() => {
                      if (window.confirm(`Delete ${row.name}?`)) deleteMut.mutate(row._id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <ModalContent>
          <ModalTitle>Edit department</ModalTitle>
          <div className="mt-4 space-y-3">
            <Input
              placeholder="Name"
              value={editForm.name}
              onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
            />
            <Input
              placeholder="Code"
              value={editForm.code}
              onChange={(e) => setEditForm((f) => ({ ...f, code: e.target.value }))}
            />
            <Input
              placeholder="Description"
              value={editForm.description}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, description: e.target.value }))
              }
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editForm.isActive}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, isActive: e.target.checked }))
                }
              />
              Active
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button
                type="button"
                disabled={updateMut.isPending}
                onClick={() => updateMut.mutate()}
              >
                Save
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </SettingsSection>
  );
}
