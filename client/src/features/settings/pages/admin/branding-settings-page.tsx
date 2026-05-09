import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { fetchOrganizationSettings, patchBrandingSettings } from "../../api/settings-api";
import { SettingsSection } from "../../components/settings-section";

type FormValues = {
  companyNameDisplay: string;
  primaryColor: string;
  logoUrl: string;
};

export function BrandingSettingsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["organization-settings"],
    queryFn: fetchOrganizationSettings,
  });

  const form = useForm<FormValues>({
    values: data
      ? {
          companyNameDisplay: data.branding.companyNameDisplay,
          primaryColor: data.branding.primaryColor,
          logoUrl: data.branding.logoUrl,
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: patchBrandingSettings,
    onSuccess: () => {
      toast.success("Branding updated");
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
      title="Branding"
      description="Logo and colors for emails and future white-label surfaces."
    >
      <form
        onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
        className="max-w-2xl space-y-4"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">Display name</label>
          <Input {...form.register("companyNameDisplay")} placeholder="Shown in headers" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Primary color</label>
          <div className="flex gap-3">
            <Input type="color" className="h-11 w-20 cursor-pointer p-1" {...form.register("primaryColor")} />
            <Input {...form.register("primaryColor")} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Logo URL</label>
          <Input {...form.register("logoUrl")} placeholder="https://… or data URL" />
          <p className="text-xs text-muted-foreground">Small logo recommended; HTTPS preferred.</p>
        </div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving…" : "Save branding"}
        </Button>
      </form>
    </SettingsSection>
  );
}
