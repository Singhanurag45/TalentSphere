import { type FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Plus, Trash2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, type DataTableColumn } from "@/shared/ui/data-table";
import {
  createEmployee,
  deleteEmployee,
  fetchDepartments,
  fetchEmployees,
  updateEmployee,
} from "../api/employee-api";
import { EmployeeFormModal } from "../components/employee-form-modal";
import type {
  Employee,
  EmployeeListFilters,
  EmployeePayload,
} from "../types/employee";

const PAGE_SIZE = 10;

export function EmployeesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState<"" | "active" | "on-leave" | "inactive">(
    "",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const filters: EmployeeListFilters = {
    page,
    limit: PAGE_SIZE,
    search,
    department,
    status,
  };

  const employeesQuery = useQuery({
    queryKey: ["employees", filters],
    queryFn: () => fetchEmployees(filters),
  });

  const departmentsQuery = useQuery({
    queryKey: ["employee-departments"],
    queryFn: fetchDepartments,
  });

  const createEmployeeMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      toast.success("Employee created successfully");
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee-departments"] });
    },
    onError: () => toast.error("Unable to create employee"),
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<EmployeePayload>;
    }) => updateEmployee(id, payload),
    onSuccess: () => {
      toast.success("Employee updated successfully");
      setIsModalOpen(false);
      setEditingEmployee(null);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: () => toast.error("Unable to update employee"),
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      toast.success("Employee deleted");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: () => toast.error("Unable to delete employee"),
  });

  const columns = useMemo<DataTableColumn<Employee>[]>(
    () => [
      {
        key: "employee",
        header: "Employee",
        render: (employee) => (
          <div>
            <p className="font-medium leading-tight">
              {employee.firstName} {employee.lastName}
            </p>
            <p className="text-xs text-muted-foreground">
              {employee.employeeCode}
            </p>
          </div>
        ),
      },
      {
        key: "contact",
        header: "Contact",
        render: (employee) => (
          <div>
            <p>{employee.email}</p>
            <p className="text-xs text-muted-foreground">
              {employee.phone || "-"}
            </p>
          </div>
        ),
      },
      {
        key: "department",
        header: "Department",
        render: (employee) => employee.department,
      },
      {
        key: "designation",
        header: "Designation",
        render: (employee) => employee.designation,
      },
      {
        key: "status",
        header: "Status",
        render: (employee) => (
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {employee.status}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Actions",
        className: "w-[220px]",
        render: (employee) => (
          <div
            className="flex gap-1"
            onClick={(event) => event.stopPropagation()}
          >
            <Link to={`/employees/${employee.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="mr-1.5 h-4 w-4" />
                View
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingEmployee(employee);
                setIsModalOpen(true);
              }}
            >
              <Pencil className="mr-1.5 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const confirmed = window.confirm(
                  `Delete employee ${employee.firstName} ${employee.lastName}?`,
                );
                if (confirmed) {
                  deleteEmployeeMutation.mutate(employee.id);
                }
              }}
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [deleteEmployeeMutation],
  );

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleClear = () => {
    setSearchInput("");
    setSearch("");
    setDepartment("");
    setStatus("");
    setPage(1);
  };

  const paginationMeta = employeesQuery.data?.meta;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-card p-5 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
              <Users className="h-3.5 w-3.5" />
              Employee Management
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              Workforce Directory
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage employee records with instant search, filters, and
              profile-level visibility.
            </p>
          </div>

          <Button
            onClick={() => {
              setEditingEmployee(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-4 shadow-soft">
        <form className="grid gap-3 md:grid-cols-4" onSubmit={handleSearch}>
          <div className="md:col-span-2">
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by name, code, email or designation"
            />
          </div>

          <select
            className="h-11 rounded-full border bg-background px-4 text-sm outline-none transition focus:ring-4 focus:ring-ring/20"
            value={department}
            onChange={(event) => {
              setDepartment(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All Departments</option>
            {(departmentsQuery.data || []).map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>

          <select
            className="h-11 rounded-full border bg-background px-4 text-sm outline-none transition focus:ring-4 focus:ring-ring/20"
            value={status}
            onChange={(event) => {
              setStatus(
                event.target.value as "" | "active" | "on-leave" | "inactive",
              );
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="on-leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="md:col-span-4 flex flex-wrap gap-2 justify-end">
            <Button type="button" variant="outline" onClick={handleClear}>
              Reset
            </Button>
            <Button type="submit">Search</Button>
          </div>
        </form>
      </section>

      <DataTable
        columns={columns}
        data={employeesQuery.data?.items || []}
        rowKey={(employee) => employee.id}
        isLoading={employeesQuery.isLoading}
        emptyState={
          <p className="text-sm text-muted-foreground">
            No employees match the current filters.
          </p>
        }
      />

      <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing page {paginationMeta?.page || 1} of{" "}
          {paginationMeta?.totalPages || 1} ({paginationMeta?.total || 0}{" "}
          employees)
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={!paginationMeta?.hasPrevPage}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={!paginationMeta?.hasNextPage}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <EmployeeFormModal
        open={isModalOpen}
        onOpenChange={(nextOpen) => {
          setIsModalOpen(nextOpen);
          if (!nextOpen) {
            setEditingEmployee(null);
          }
        }}
        initialEmployee={editingEmployee}
        onSubmit={async (payload) => {
          if (editingEmployee) {
            await updateEmployeeMutation.mutateAsync({
              id: editingEmployee.id,
              payload,
            });
            return;
          }

          await createEmployeeMutation.mutateAsync(payload);
        }}
        isSubmitting={
          createEmployeeMutation.isPending || updateEmployeeMutation.isPending
        }
      />
    </div>
  );
}
