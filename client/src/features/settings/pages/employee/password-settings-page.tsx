import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { postChangePassword } from "../../api/settings-api";
import { SettingsSection } from "../../components/settings-section";

const schema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function PasswordSettingsPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await postChangePassword(values.currentPassword, values.newPassword);
      toast.success("Password updated");
      form.reset();
    } catch {
      toast.error("Check your current password and try again");
    }
  };

  return (
    <SettingsSection
      title="Change password"
      description="Use a strong password you do not reuse on other sites."
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Current password</label>
          <Input type="password" autoComplete="current-password" {...form.register("currentPassword")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">New password</label>
          <Input type="password" autoComplete="new-password" {...form.register("newPassword")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Confirm new password</label>
          <Input type="password" autoComplete="new-password" {...form.register("confirmPassword")} />
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
        )}
        <Button type="submit">Update password</Button>
      </form>
    </SettingsSection>
  );
}
