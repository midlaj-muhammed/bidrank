import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Wise badge system — positive uses the pale-green/positive-deep pairing;
 * never repurpose the Wise-green CTA as a success indicator.
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border border-ink text-foreground",
        positive: "bg-success-bg text-success-foreground",
        negative: "bg-destructive-bg text-destructive-foreground",
        dark: "bg-ink text-primary",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
