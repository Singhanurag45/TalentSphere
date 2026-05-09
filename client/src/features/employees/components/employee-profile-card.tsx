import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import type { ReactNode } from "react";

import type { Employee } from "../types/employee";

export function EmployeeProfileCard({ employee }: { employee: Employee }) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-soft">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <img
            src={
              employee.avatarUrl ||
              `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&background=EAF0FF&color=1E3A8A`
            }
            alt={`${employee.firstName} ${employee.lastName}`}
            className="h-20 w-20 rounded-2xl border object-cover"
          />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {employee.firstName} {employee.lastName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {employee.employeeCode}
            </p>
            <span className="mt-2 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {employee.status}
            </span>
          </div>
        </div>

        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <InfoLine icon={<Mail className="h-4 w-4" />} text={employee.email} />
          <InfoLine
            icon={<Phone className="h-4 w-4" />}
            text={employee.phone || "-"}
          />
          <InfoLine
            icon={<Building2 className="h-4 w-4" />}
            text={employee.department}
          />
          <InfoLine
            icon={<BriefcaseBusiness className="h-4 w-4" />}
            text={employee.designation}
          />
          <InfoLine
            icon={<MapPin className="h-4 w-4" />}
            text={employee.location || "-"}
          />
          <InfoLine
            icon={<CalendarDays className="h-4 w-4" />}
            text={new Date(employee.dateOfJoining).toLocaleDateString()}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-muted/30 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Employment
          </p>
          <p className="mt-1 text-sm font-medium capitalize">
            {employee.employmentType}
          </p>
        </div>
        <div className="rounded-2xl border bg-muted/30 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Manager
          </p>
          <p className="mt-1 text-sm font-medium">
            {employee.managerName || "Not assigned"}
          </p>
        </div>
        <div className="rounded-2xl border bg-muted/30 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Salary
          </p>
          <p className="mt-1 text-sm font-medium">
            {typeof employee.salary === "number"
              ? new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(employee.salary)
              : "Not disclosed"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border p-4">
          <h2 className="text-sm font-semibold">Bio</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {employee.bio || "No bio provided."}
          </p>
        </div>
        <div className="rounded-2xl border p-4">
          <h2 className="text-sm font-semibold">Skills</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {employee.skills.length ? (
              employee.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No skills listed.</p>
            )}
          </div>
        </div>
        <div className="rounded-2xl border p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold">Emergency Contact</h2>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4" />
              {employee.emergencyContactName || "N/A"}
            </span>
            <span>{employee.emergencyContactPhone || "N/A"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoLine({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1.5">
      <span className="text-muted-foreground">{icon}</span>
      <span className="font-medium">{text}</span>
    </p>
  );
}
