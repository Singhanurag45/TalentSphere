import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { fetchOrganizationSettings, patchAttendancePolicy } from "../../api/settings-api";
import { SettingsSection } from "../../components/settings-section";

export function AttendancePolicyPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["organization-settings"],
    queryFn: fetchOrganizationSettings,
  });

  const form = useForm({
    values: data
      ? {
          workdayStart: data.attendancePolicy.workdayStart,
          workdayEnd: data.attendancePolicy.workdayEnd,
          graceMinutesForLate: data.attendancePolicy.graceMinutesForLate,
          halfDayHours: data.attendancePolicy.halfDayHours,
          requireCheckout: data.attendancePolicy.requireCheckout,
          weekStartsOn: data.attendancePolicy.weekStartsOn,
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: patchAttendancePolicy,
    onSuccess: () => {
      toast.success("Attendance policy saved");
      queryClient.invalidateQueries({ queryKey: ["organization-settings"] });
    },
    onError: () => toast.error("Could not save"),
  });

  if (isLoading || !data) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <SettingsSection
      title="Attendance policy"
      description="Define standard work hours and lateness grace used across reporting."
    >
      <form
        onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
        className="grid max-w-2xl gap-4 sm:grid-cols-2"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">Workday start</label>
          <Input {...form.register("workdayStart")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Workday end</label>
          <Input {...form.register("workdayEnd")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Grace minutes (late)</label>
          <Input type="number" {...form.register("graceMinutesForLate", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Half-day hours</label>
          <Input type="number" step={0.5} {...form.register("halfDayHours", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Week starts on (0=Sun … 6=Sat)</label>
          <Input type="number" min={0} max={6} {...form.register("weekStartsOn", { valueAsNumber: true })} />
        </div>
        <label className="flex items-center gap-2 sm:col-span-2">
          <input type="checkbox" {...form.register("requireCheckout")} />
          <span className="text-sm font-medium">Require checkout time</span>
        </label>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving…" : "Save policy"}
          </Button>
        </div>
      </form>
    </SettingsSection>
  );
}
