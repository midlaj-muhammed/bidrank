import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Wise text-input: white fill, 1px ink hairline border, 12px radius,
 * green focus ring. Level 1 elevation (hairline on dark).
 */
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "flex h-12 w-full rounded-2xl border border-border/80 bg-card px-4 py-3 text-base shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
