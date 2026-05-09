import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { fetchOrganizationSettings, patchSecuritySettings } from "../../api/settings-api";
import { SettingsSection } from "../../components/settings-section";

export function SecuritySettingsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["organization-settings"],
    queryFn: fetchOrganizationSettings,
  });

  const form = useForm({
    values: data
      ? {
          sessionTimeoutMinutes: data.securitySettings.sessionTimeoutMinutes,
          minPasswordLength: data.securitySettings.minPasswordLength,
          requireUppercase: data.securitySettings.requireUppercase,
          requireNumber: data.securitySettings.requireNumber,
          lockoutAfterFailedAttempts: data.securitySettings.lockoutAfterFailedAttempts,
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: patchSecuritySettings,
    onSuccess: () => {
      toast.success("Security settings saved");
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
      title="Security"
      description="Session and password policy hints for your identity setup. Enforced on next login flows."
    >
      <form
        onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
        className="grid max-w-2xl gap-4 sm:grid-cols-2"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">Session timeout (minutes)</label>
          <Input type="number" {...form.register("sessionTimeoutMinutes", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Min password length</label>
          <Input type="number" {...form.register("minPasswordLength", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Lockout after failed attempts (0=off)</label>
          <Input
            type="number"
            {...form.register("lockoutAfterFailedAttempts", { valueAsNumber: true })}
          />
        </div>
        <label className="flex items-center gap-2 sm:col-span-2">
          <input type="checkbox" {...form.register("requireUppercase")} />
          <span className="text-sm font-medium">Require uppercase letter in passwords</span>
        </label>
        <label className="flex items-center gap-2 sm:col-span-2">
          <input type="checkbox" {...form.register("requireNumber")} />
          <span className="text-sm font-medium">Require number in passwords</span>
        </label>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving…" : "Save security"}
          </Button>
        </div>
      </form>
    </SettingsSection>
  );
}
