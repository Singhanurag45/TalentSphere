import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { fetchOrganizationSettings, patchAdminNotifications } from "../../api/settings-api";
import { SettingsSection } from "../../components/settings-section";

function Row({
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
    <label className="flex cursor-pointer items-start gap-4 rounded-xl border bg-muted/20 p-4">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4"
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

export function AdminNotificationsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["organization-settings"],
    queryFn: fetchOrganizationSettings,
  });

  const mutation = useMutation({
    mutationFn: patchAdminNotifications,
    onSuccess: () => {
      toast.success("Saved");
      queryClient.invalidateQueries({ queryKey: ["organization-settings"] });
    },
    onError: () => toast.error("Could not save"),
  });

  const n = data?.notificationSettings;

  if (isLoading || !n) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <SettingsSection
      title="Notification settings"
      description="Org-wide channels for HR workflows (integrate webhooks later)."
    >
      <div className="space-y-3">
        <Row
          label="Leave request email"
          description="Notify approvers and HR on new leave submissions."
          checked={n.leaveRequestEmail}
          onChange={(leaveRequestEmail) => mutation.mutate({ leaveRequestEmail })}
          disabled={mutation.isPending}
        />
        <Row
          label="Slack / Teams hooks"
          description="Placeholder for future integration toggle."
          checked={n.leaveRequestSlack}
          onChange={(leaveRequestSlack) => mutation.mutate({ leaveRequestSlack })}
          disabled={mutation.isPending}
        />
        <Row
          label="Birthday announcements"
          description="Optional team celebration digests."
          checked={n.birthdayAnnouncements}
          onChange={(birthdayAnnouncements) => mutation.mutate({ birthdayAnnouncements })}
          disabled={mutation.isPending}
        />
        <Row
          label="Weekly HR digest"
          description="Summary to leadership inboxes."
          checked={n.weeklyDigest}
          onChange={(weeklyDigest) => mutation.mutate({ weeklyDigest })}
          disabled={mutation.isPending}
        />
      </div>
    </SettingsSection>
  );
}
