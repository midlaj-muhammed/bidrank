"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { buttonVariants } from "./ui/button";
import { Plus, LogOut, Moon, Sun, Menu, X, Shield } from "lucide-react";
import { useTheme } from "next-themes";
import { useQuery } from "convex/react";
import { useConvexAuth, useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { LogoMark } from "./logo";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const { theme, setTheme } = useTheme();
  const me = useQuery(api.users.me);
  const admin = useQuery(api.admin.isAdmin);

  // Close mobile menu when pathname changes without cascading render effects
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  const links = [
    { href: "/", label: "Leaderboard", active: pathname === "/" },
    { href: "/categories", label: "Categories", active: pathname.startsWith("/categories") },
    { href: "/how-it-works", label: "How it works", active: pathname === "/how-it-works" },
    ...(isAuthenticated
      ? [{ href: "/dashboard", label: "Dashboard", active: pathname.startsWith("/dashboard") }]
      : []),
    ...(admin ? [{ href: "/admin", label: "Admin", active: pathname.startsWith("/admin") }] : []),
  ];

  const name = me?.name ?? me?.email ?? "";

  return (
    <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-black tracking-tight"
        >
          <LogoMark size={30} />
          BidRank
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
                l.active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="size-4 dark:hidden" />
            <Moon className="hidden size-4 dark:block" />
          </Button>
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="hidden h-10 cursor-pointer items-center gap-2 rounded-full bg-card pl-1.5 pr-3.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:flex"
                aria-label="Go to dashboard"
                title="Go to dashboard"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {name.slice(0, 1).toUpperCase() || "?"}
                </span>
                <span className="max-w-28 truncate text-sm font-semibold">
                  {name}
                </span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex"
                onClick={async () => {
                  await signOut();
                  router.push("/");
                }}
                aria-label="Sign out"
              >
                <LogOut />
              </Button>
            </>
          ) : (
            <Link href="/signin" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:inline-flex")}>
              Sign in
            </Link>
          )}
          <Link href="/submit" className={buttonVariants({ size: "sm", variant: "dark" })}>
            <Plus /> <span className="hidden sm:inline">List your SaaS</span><span className="sm:hidden">List</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-muted bg-card px-4 pb-6 pt-2 shadow-lg md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3.5 py-2.5 text-base font-semibold transition-colors",
                  l.active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <span>{l.label}</span>
                {l.label === "Admin" && <Shield className="size-4 opacity-70" />}
              </Link>
            ))}
            <div className="my-2 border-t border-muted pt-2">
              {isAuthenticated ? (
                <div className="flex items-center justify-between px-2 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {name.slice(0, 1).toUpperCase() || "?"}
                    </span>
                    <span className="max-w-44 truncate text-sm font-semibold">
                      {name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await signOut();
                      router.push("/");
                    }}
                  >
                    <LogOut className="size-4" /> Sign out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={buttonVariants({ variant: "outline", className: "w-full" })}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className={buttonVariants({ variant: "secondary", className: "w-full" })}
                  >
                    Create account
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
