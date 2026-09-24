import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Wise button system — the lime-green CTA pill is the brand's conversion
 * signature. Canonical shape: 24px `rounded-xl` pill-rectangle, never sharp.
 * `primary` text is ink-deep (never white on green); `inverse` is for CTAs
 * placed on the dark `ink` surface.
 */
const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full text-base font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-hover shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-muted active:bg-muted",
        tertiary:
          "border border-border/80 bg-card text-card-foreground hover:bg-muted active:bg-muted shadow-sm",
        outline:
          "border border-border/80 bg-card text-card-foreground hover:bg-muted active:bg-muted shadow-sm",
        inverse:
          "bg-card text-foreground hover:bg-muted active:bg-muted shadow-sm",
        dark:
          "bg-[#0e0f0c] text-white dark:bg-foreground dark:text-background hover:bg-[#0e0f0c]/90 dark:hover:bg-foreground/90 active:scale-[0.99] shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive-deep active:bg-destructive-deep",
        ghost:
          "text-muted-foreground hover:bg-secondary hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5 text-sm", // 44px
        sm: "h-9 px-4 text-xs font-semibold", // 36px compact
        lg: "h-12 px-7 text-base font-bold", // 48px standard CTA
        icon: "h-9 w-9 rounded-full",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
