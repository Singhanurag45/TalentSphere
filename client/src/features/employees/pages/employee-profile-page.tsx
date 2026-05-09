import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { fetchEmployeeById } from "../api/employee-api";
import { EmployeeProfileCard } from "../components/employee-profile-card";

export function EmployeeProfilePage() {
  const { employeeId = "" } = useParams();

  const employeeQuery = useQuery({
    queryKey: ["employee-profile", employeeId],
    queryFn: () => fetchEmployeeById(employeeId),
    enabled: Boolean(employeeId),
  });

  return (
    <div className="space-y-4">
      <div>
        <Link to="/employees">
          <Button variant="outline">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to employees
          </Button>
        </Link>
      </div>

      {employeeQuery.isLoading ? (
        <div className="rounded-2xl border bg-card p-10 text-sm text-muted-foreground shadow-soft">
          Loading employee profile...
        </div>
      ) : null}

      {!employeeQuery.isLoading && employeeQuery.data ? (
        <EmployeeProfileCard employee={employeeQuery.data} />
      ) : null}

      {!employeeQuery.isLoading && !employeeQuery.data ? (
        <div className="rounded-2xl border bg-card p-10 text-center shadow-soft">
          <h1 className="text-lg font-semibold">Employee not found</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The requested profile does not exist.
          </p>
        </div>
      ) : null}
    </div>
  );
}
