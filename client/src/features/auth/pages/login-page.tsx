import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandLogo } from "@/shared/ui/brand-logo";
import { useAuth } from "../context/auth-context";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Minimum 8 characters")
    .regex(/[A-Z]/, "Use at least one uppercase letter")
    .regex(/[0-9]/, "Use at least one number"),
});

type LoginFormInput = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@newhrms.com",
      password: "Admin@12345",
    },
  });

  const onSubmit = async (values: LoginFormInput) => {
    try {
      await login(values);
      navigate(redirectTo, { replace: true });
    } catch {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="absolute -left-10 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md rounded-[1.5rem] border bg-card/90 p-8 shadow-float backdrop-blur"
      >
        <BrandLogo className="mb-2" />
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Secure sign in for your HRMS workspace.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Work Email</label>
            <Input placeholder="you@company.com" {...register("email")} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Password</label>
            <Input type="password" placeholder="Enter password" {...register("password")} />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Demo credentials are prefilled.{" "}
          <Link to="#" className="underline underline-offset-2">
            Need help?
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
