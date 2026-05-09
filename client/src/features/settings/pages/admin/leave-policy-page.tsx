import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { fetchOrganizationSettings, patchLeavePolicy } from "../../api/settings-api";
import { SettingsSection } from "../../components/settings-section";

export function LeavePolicyPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["organization-settings"],
    queryFn: fetchOrganizationSettings,
  });

  const form = useForm({
    values: data
      ? {
          fiscalYearStartMonth: data.leavePolicy.fiscalYearStartMonth,
          carryForwardAnnual: data.leavePolicy.carryForwardAnnual,
          maxCarryForwardDays: data.leavePolicy.maxCarryForwardDays,
          advanceNoticeDays: data.leavePolicy.advanceNoticeDays,
          unpaidAllowed: data.leavePolicy.unpaidAllowed,
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: patchLeavePolicy,
    onSuccess: () => {
      toast.success("Leave policy saved");
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
      title="Leave policy"
      description="Fiscal year and rules that complement your leave engine configuration."
    >
      <form
        onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
        className="grid max-w-2xl gap-4 sm:grid-cols-2"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">Fiscal year starts (month 1–12)</label>
          <Input
            type="number"
            min={1}
            max={12}
            {...form.register("fiscalYearStartMonth", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Advance notice (days)</label>
          <Input type="number" min={0} {...form.register("advanceNoticeDays", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Max carry-forward days</label>
          <Input type="number" min={0} {...form.register("maxCarryForwardDays", { valueAsNumber: true })} />
        </div>
        <label className="flex items-center gap-2 sm:col-span-2">
          <input type="checkbox" {...form.register("carryForwardAnnual")} />
          <span className="text-sm font-medium">Allow annual leave carry forward</span>
        </label>
        <label className="flex items-center gap-2 sm:col-span-2">
          <input type="checkbox" {...form.register("unpaidAllowed")} />
          <span className="text-sm font-medium">Allow unpaid leave requests</span>
        </label>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving…" : "Save leave policy"}
          </Button>
        </div>
      </form>
    </SettingsSection>
  );
}
