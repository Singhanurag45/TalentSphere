import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import type { Employee, EmployeePayload } from "../types/employee";

const employeeFormSchema = z.object({
  employeeCode: z.string().trim().min(3, "Minimum 3 characters").max(20),
  firstName: z.string().trim().min(2, "Minimum 2 characters").max(60),
  lastName: z.string().trim().min(2, "Minimum 2 characters").max(60),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().max(72).or(z.literal("")),
  phone: z
    .string()
    .trim()
    .min(7, "Invalid phone number")
    .max(20)
    .or(z.literal("")),
  department: z.string().trim().min(2, "Department is required"),
  designation: z.string().trim().min(2, "Designation is required"),
  employmentType: z.enum(["full-time", "part-time", "contract", "intern"]),
  status: z.enum(["active", "on-leave", "inactive"]),
  dateOfJoining: z.string().min(1, "Date of joining is required"),
  managerName: z.string().trim().max(80).or(z.literal("")),
  location: z.string().trim().max(120).or(z.literal("")),
  salary: z.union([z.coerce.number().min(0), z.nan()]).optional(),
  avatarUrl: z.string().trim().url("Enter a valid URL").or(z.literal("")),
  bio: z.string().trim().max(500).or(z.literal("")),
  skills: z.string().trim(),
  emergencyContactName: z.string().trim().max(80).or(z.literal("")),
  emergencyContactPhone: z.string().trim().max(20).or(z.literal("")),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

type EmployeeFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialEmployee?: Employee | null;
  onSubmit: (payload: EmployeePayload) => Promise<void>;
  isSubmitting: boolean;
};

const defaultValues: EmployeeFormValues = {
  employeeCode: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  department: "",
  designation: "",
  employmentType: "full-time",
  status: "active",
  dateOfJoining: "",
  managerName: "",
  location: "",
  avatarUrl: "",
  bio: "",
  skills: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
};

export function EmployeeFormModal({
  open,
  onOpenChange,
  initialEmployee,
  onSubmit,
  isSubmitting,
}: EmployeeFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!initialEmployee) {
      reset(defaultValues);
      return;
    }

    reset({
      employeeCode: initialEmployee.employeeCode,
      firstName: initialEmployee.firstName,
      lastName: initialEmployee.lastName,
      email: initialEmployee.email,
      password: "",
      phone: initialEmployee.phone || "",
      department: initialEmployee.department,
      designation: initialEmployee.designation,
      employmentType: initialEmployee.employmentType,
      status: initialEmployee.status,
      dateOfJoining: initialEmployee.dateOfJoining.slice(0, 10),
      managerName: initialEmployee.managerName || "",
      location: initialEmployee.location || "",
      salary: initialEmployee.salary ?? undefined,
      avatarUrl: initialEmployee.avatarUrl || "",
      bio: initialEmployee.bio || "",
      skills: initialEmployee.skills.join(", "),
      emergencyContactName: initialEmployee.emergencyContactName || "",
      emergencyContactPhone: initialEmployee.emergencyContactPhone || "",
    });
  }, [initialEmployee, open, reset]);

  const submitForm = async (values: EmployeeFormValues) => {
    if (!initialEmployee && values.password.length < 8) {
      setError("password", {
        type: "manual",
        message: "Minimum 8 characters",
      });
      return;
    }

    const payload: EmployeePayload = {
      employeeCode: values.employeeCode,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      department: values.department,
      designation: values.designation,
      employmentType: values.employmentType,
      status: values.status,
      dateOfJoining: values.dateOfJoining,
      managerName: values.managerName,
      location: values.location,
      avatarUrl: values.avatarUrl,
      bio: values.bio,
      skills: values.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      emergencyContactName: values.emergencyContactName,
      emergencyContactPhone: values.emergencyContactPhone,
      salary:
        typeof values.salary === "number" && !Number.isNaN(values.salary)
          ? values.salary
          : null,
    };

    if (!initialEmployee) {
      payload.password = values.password;
    }

    await onSubmit(payload);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-h-[90vh] overflow-y-auto">
        <ModalHeader>
          <ModalTitle>
            {initialEmployee ? "Edit Employee" : "Add Employee"}
          </ModalTitle>
          <ModalDescription>
            {initialEmployee
              ? "Update details to keep employee records current."
              : "Create a complete employee profile for your organization."}
          </ModalDescription>
        </ModalHeader>

        <form
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
          onSubmit={handleSubmit(submitForm)}
        >
          <Field label="Employee Code" error={errors.employeeCode?.message}>
            <Input placeholder="EMP-1001" {...register("employeeCode")} />
          </Field>

          <Field label="Work Email" error={errors.email?.message}>
            <Input placeholder="employee@company.com" {...register("email")} />
          </Field>

          {!initialEmployee ? (
            <Field label="Login Password" error={errors.password?.message}>
              <Input
                type="password"
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                {...register("password")}
              />
            </Field>
          ) : null}

          <Field label="First Name" error={errors.firstName?.message}>
            <Input {...register("firstName")} />
          </Field>

          <Field label="Last Name" error={errors.lastName?.message}>
            <Input {...register("lastName")} />
          </Field>

          <Field label="Phone" error={errors.phone?.message}>
            <Input {...register("phone")} />
          </Field>

          <Field label="Date Of Joining" error={errors.dateOfJoining?.message}>
            <Input type="date" {...register("dateOfJoining")} />
          </Field>

          <Field label="Department" error={errors.department?.message}>
            <Input {...register("department")} />
          </Field>

          <Field label="Designation" error={errors.designation?.message}>
            <Input {...register("designation")} />
          </Field>

          <Field label="Employment Type" error={errors.employmentType?.message}>
            <select
              className="h-11 w-full rounded-full border bg-background px-4 text-sm outline-none transition focus:ring-4 focus:ring-ring/20"
              {...register("employmentType")}
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
            </select>
          </Field>

          <Field label="Status" error={errors.status?.message}>
            <select
              className="h-11 w-full rounded-full border bg-background px-4 text-sm outline-none transition focus:ring-4 focus:ring-ring/20"
              {...register("status")}
            >
              <option value="active">Active</option>
              <option value="on-leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>

          <Field label="Manager" error={errors.managerName?.message}>
            <Input {...register("managerName")} />
          </Field>

          <Field label="Location" error={errors.location?.message}>
            <Input {...register("location")} />
          </Field>

          <Field label="Salary" error={errors.salary?.message}>
            <Input type="number" min="0" step="0.01" {...register("salary")} />
          </Field>

          <Field label="Avatar URL" error={errors.avatarUrl?.message}>
            <Input placeholder="https://..." {...register("avatarUrl")} />
          </Field>

          <Field
            label="Skills"
            error={errors.skills?.message}
            className="md:col-span-2"
          >
            <Input placeholder="React, Node.js, HRMS" {...register("skills")} />
          </Field>

          <Field
            label="Bio"
            error={errors.bio?.message}
            className="md:col-span-2"
          >
            <textarea
              rows={3}
              className="w-full rounded-2xl border bg-background px-4 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:ring-4 focus:ring-ring/20"
              {...register("bio")}
            />
          </Field>

          <Field
            label="Emergency Contact Name"
            error={errors.emergencyContactName?.message}
          >
            <Input {...register("emergencyContactName")} />
          </Field>

          <Field
            label="Emergency Contact Phone"
            error={errors.emergencyContactPhone?.message}
          >
            <Input {...register("emergencyContactPhone")} />
          </Field>

          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : initialEmployee
                  ? "Update Employee"
                  : "Create Employee"}
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
