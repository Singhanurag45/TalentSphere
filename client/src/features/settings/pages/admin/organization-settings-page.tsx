import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { fetchOrganizationSettings, patchOrganizationSettings } from "../../api/settings-api";
import { SettingsSection } from "../../components/settings-section";

type FormValues = {
  organizationName: string;
  legalName: string;
  timezone: string;
  address: string;
  supportEmail: string;
  phone: string;
};

export function OrganizationSettingsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["organization-settings"],
    queryFn: fetchOrganizationSettings,
  });

  const form = useForm<FormValues>({
    values: data
      ? {
          organizationName: data.organizationName,
          legalName: data.legalName,
          timezone: data.timezone,
          address: data.address,
          supportEmail: data.supportEmail,
          phone: data.phone,
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: patchOrganizationSettings,
    onSuccess: () => {
      toast.success("Organization saved");
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
      title="Organization"
      description="Legal identity and how employees reach your HR team."
    >
      <form
        onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
        className="grid max-w-2xl gap-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium">Organization name</label>
            <Input {...form.register("organizationName")} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium">Legal name</label>
            <Input {...form.register("legalName")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Timezone</label>
            <Input {...form.register("timezone")} placeholder="e.g. Asia/Kolkata" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <Input {...form.register("phone")} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium">Support email</label>
            <Input type="email" {...form.register("supportEmail")} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium">Address</label>
            <textarea
              {...form.register("address")}
              rows={3}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving…" : "Save organization"}
        </Button>
      </form>
    </SettingsSection>
  );
}
