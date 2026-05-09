import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { fetchMeSettings, patchMeAvatar, patchMeProfile } from "../../api/settings-api";
import { SettingsSection } from "../../components/settings-section";

const schema = z.object({
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  phone: z.string().max(30).optional(),
  emergencyContactName: z.string().max(120).optional(),
  emergencyContactPhone: z.string().max(30).optional(),
  location: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
});

type FormValues = z.infer<typeof schema>;

export function ProfileSettingsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["settings-me"],
    queryFn: fetchMeSettings,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: data
      ? {
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          phone: data.employee?.phone ?? "",
          emergencyContactName: data.employee?.emergencyContactName ?? "",
          emergencyContactPhone: data.employee?.emergencyContactPhone ?? "",
          location: data.employee?.location ?? "",
          bio: data.employee?.bio ?? "",
        }
      : undefined,
  });

  const saveMutation = useMutation({
    mutationFn: (payload: FormValues) => patchMeProfile(payload),
    onSuccess: () => {
      toast.success("Profile saved");
      queryClient.invalidateQueries({ queryKey: ["settings-me"] });
    },
    onError: () => toast.error("Could not save profile"),
  });

  const avatarMutation = useMutation({
    mutationFn: (avatarUrl: string) => patchMeAvatar(avatarUrl),
    onSuccess: () => {
      toast.success("Photo updated");
      queryClient.invalidateQueries({ queryKey: ["settings-me"] });
    },
    onError: () => toast.error("Could not update photo"),
  });

  const onAvatarFile = (file: File | null) => {
    if (!file) return;
    if (file.size > 800 * 1024) {
      toast.error("Image must be under 800KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      avatarMutation.mutate(url);
    };
    reader.readAsDataURL(file);
  };

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SettingsSection
        title="Profile photo"
        description="Upload a square image for your avatar (shown where your profile appears)."
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-muted">
            {data.user.avatarUrl ? (
              <img
                src={data.user.avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold text-muted-foreground">
                {data.user.firstName[0]}
                {data.user.lastName[0]}
              </span>
            )}
          </div>
          <div>
            <Input
              type="file"
              accept="image/*"
              className="max-w-xs cursor-pointer"
              onChange={(e) => onAvatarFile(e.target.files?.[0] ?? null)}
              disabled={avatarMutation.isPending}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              PNG or JPG, max ~800KB. Stored as a data URL for this demo.
            </p>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Personal details"
        description="Update your name and contact information. Work email is managed by HR."
      >
        <form
          onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Work email</label>
              <Input value={data.user.email} disabled className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Employee ID</label>
              <Input
                value={data.employee?.employeeCode ?? "—"}
                disabled
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">First name</label>
              <Input {...form.register("firstName")} />
              {form.formState.errors.firstName && (
                <p className="text-xs text-destructive">{form.formState.errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last name</label>
              <Input {...form.register("lastName")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input {...form.register("phone")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input {...form.register("location")} placeholder="City / office" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Emergency contact name</label>
              <Input {...form.register("emergencyContactName")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Emergency contact phone</label>
              <Input {...form.register("emergencyContactPhone")} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <textarea
              {...form.register("bio")}
              rows={4}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </SettingsSection>
    </div>
  );
}
