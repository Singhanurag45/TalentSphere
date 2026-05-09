import * as React from "react";

import { cn } from "@/shared/lib/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-full border bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground focus:ring-4 focus:ring-ring/20",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
