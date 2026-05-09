import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { fetchMeSettings, patchMePreferences } from "../../api/settings-api";
import { SettingsSection } from "../../components/settings-section";

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-4 rounded-xl border bg-muted/20 p-4 transition-colors hover:bg-muted/40">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span>
        <span className="font-medium">{label}</span>
        <span className="mt-0.5 block text-sm text-muted-foreground">{description}</span>
      </span>
    </label>
  );
}

export function NotificationsSettingsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["settings-me"],
    queryFn: fetchMeSettings,
  });

  const mutation = useMutation({
    mutationFn: patchMePreferences,
    onSuccess: () => {
      toast.success("Notification preferences saved");
      queryClient.invalidateQueries({ queryKey: ["settings-me"] });
    },
    onError: () => toast.error("Could not save"),
  });

  const prefs = data?.user.preferences;

  if (isLoading || !prefs) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const patch = (partial: Record<string, boolean>) => {
    mutation.mutate(partial);
  };

  return (
    <SettingsSection
      title="Notification preferences"
      description="Control which email digests and alerts you receive."
    >
      <div className="space-y-3">
        <ToggleRow
          label="Leave updates"
          description="Emails about leave approvals, rejections, and reminders."
          checked={prefs.emailLeaveUpdates}
          onChange={(emailLeaveUpdates) => patch({ emailLeaveUpdates })}
          disabled={mutation.isPending}
        />
        <ToggleRow
          label="Attendance summary"
          description="Weekly summary of your attendance and exceptions."
          checked={prefs.emailAttendanceSummary}
          onChange={(emailAttendanceSummary) => patch({ emailAttendanceSummary })}
          disabled={mutation.isPending}
        />
        <ToggleRow
          label="Company announcements"
          description="HR and leadership announcements."
          checked={prefs.emailAnnouncements}
          onChange={(emailAnnouncements) => patch({ emailAnnouncements })}
          disabled={mutation.isPending}
        />
        <ToggleRow
          label="Push notifications (beta)"
          description="Browser or app push when available."
          checked={prefs.pushEnabled}
          onChange={(pushEnabled) => patch({ pushEnabled })}
          disabled={mutation.isPending}
        />
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Preferences are saved when you toggle an option.
      </p>
    </SettingsSection>
  );
}
