import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useTheme } from "@/app/providers/theme-provider";
import { Button } from "@/components/ui/button";

import { fetchMeSettings, patchMePreferences } from "../../api/settings-api";
import { SettingsSection } from "../../components/settings-section";
import { cn } from "@/shared/lib/cn";

export function AppearanceSettingsPage() {
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["settings-me"],
    queryFn: fetchMeSettings,
  });

  const mutation = useMutation({
    mutationFn: patchMePreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings-me"] });
      toast.success("Theme preference saved");
    },
    onError: () => toast.error("Could not save theme"),
  });

  const selectTheme = (pref: "light" | "dark" | "system") => {
    mutation.mutate({ theme: pref });
    if (pref === "light") setTheme("light");
    else if (pref === "dark") setTheme("dark");
    else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  };

  if (isLoading || !data) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const current = data.user.preferences.theme;

  return (
    <SettingsSection
      title="Theme"
      description="Choose how TalentSphere looks on this device. System follows your OS preference."
    >
      <div className="flex flex-wrap gap-3">
        {(
          [
            { value: "light" as const, label: "Light" },
            { value: "dark" as const, label: "Dark" },
            { value: "system" as const, label: "System" },
          ]
        ).map((opt) => (
          <Button
            key={opt.value}
            type="button"
            variant={current === opt.value ? "default" : "outline"}
            className={cn("rounded-xl", current === opt.value && "shadow-soft")}
            onClick={() => selectTheme(opt.value)}
            disabled={mutation.isPending}
          >
            {opt.label}
          </Button>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Active display theme: <strong className="capitalize text-foreground">{theme}</strong>
      </p>
    </SettingsSection>
  );
}
