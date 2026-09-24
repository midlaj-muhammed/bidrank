"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  Bot,
  Terminal,
  Zap,
  Megaphone,
  BadgePercent,
  Palette,
  Wallet,
  BarChart3,
  Smartphone,
  Layers,
  Check,
  ChevronDown,
  Search,
  X,
  type LucideIcon,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  All: LayoutGrid,
  AI: Bot,
  "Developer Tools": Terminal,
  Productivity: Zap,
  Marketing: Megaphone,
  Sales: BadgePercent,
  Design: Palette,
  Finance: Wallet,
  Analytics: BarChart3,
  Consumer: Smartphone,
  Other: Layers,
};

export function getCategoryIcon(name: string): LucideIcon {
  return CATEGORY_ICONS[name] ?? Layers;
}

export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = CATEGORY_ICONS[name] ?? (name === "All" || !name ? LayoutGrid : Layers);
  return <Icon className={className} />;
}

export interface CategoryItem {
  name: string;
  count: number;
}

interface CategoryDropdownProps {
  value: string;
  onChange: (category: string) => void;
  categories?: CategoryItem[];
  className?: string;
  showCategoryCatalogLink?: boolean;
}

export function CategoryDropdown({
  value,
  onChange,
  categories = [],
  className,
  showCategoryCatalogLink = true,
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearch("");
  }, []);

  const openDropdown = useCallback(() => {
    setIsOpen(true);
    setSearch("");
  }, []);

  // Close on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeDropdown();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeDropdown]);

  // Focus search input when popover opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const totalProducts = useMemo(() => {
    return categories.reduce((sum, c) => sum + c.count, 0);
  }, [categories]);

  const currentCategory = useMemo(() => {
    if (value === "All" || !value) return null;
    return categories.find((c) => c.name === value) ?? { name: value, count: 0 };
  }, [value, categories]);

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  const isFiltered = value !== "All" && Boolean(value);

  return (
    <div ref={containerRef} className={cn("relative inline-block text-left", className)}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Filter by category"
        className={cn(
          "group inline-flex h-10 items-center gap-2 rounded-full border bg-card px-3.5 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-xs",
          isOpen
            ? "border-foreground/40 ring-2 ring-primary/20 bg-muted/60"
            : isFiltered
              ? "border-primary/60 bg-primary/10 text-foreground hover:border-primary"
              : "border-border/90 text-foreground hover:border-foreground/30 hover:bg-muted/40",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        )}
      >
        <span
          className={cn(
            "flex size-5.5 items-center justify-center rounded-full transition-colors",
            isFiltered
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-foreground group-hover:bg-primary/20",
          )}
        >
          <CategoryIcon name={value} className="size-3.5" />
        </span>

        <span className="font-semibold tracking-tight">
          {value === "All" || !value ? "All categories" : value}
        </span>

        {/* Count badge */}
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums transition-colors",
            isFiltered
              ? "bg-primary/20 text-foreground"
              : "bg-secondary text-muted-foreground group-hover:text-foreground",
          )}
        >
          {value === "All" || !value
            ? totalProducts
            : currentCategory?.count ?? 0}
        </span>

        {/* Clear filter button if a category is selected */}
        {isFiltered && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onChange("All");
              closeDropdown();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                onChange("All");
                closeDropdown();
              }
            }}
            title="Clear category filter"
            aria-label="Clear category filter"
            className="flex size-4.5 items-center justify-center rounded-full bg-foreground/10 text-muted-foreground hover:bg-foreground hover:text-background transition-colors ml-0.5"
          >
            <X className="size-3" />
          </span>
        )}

        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-200 ease-out",
            isOpen && "rotate-180 text-foreground",
          )}
        />
      </button>

      {/* Modern Popover Dropdown */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Category options"
          className="absolute right-0 top-full z-50 mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] origin-top-right rounded-2xl border border-border/90 bg-card/98 p-1.5 shadow-xl backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/10 animate-in fade-in-0 zoom-in-95 duration-150"
        >
          {/* Search Header */}
          <div className="relative p-1.5 pb-2">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="h-9 w-full rounded-xl border border-border/80 bg-muted/40 pl-8.5 pr-8 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 flex size-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          <div className="max-h-68 overflow-y-auto px-1 py-1 space-y-1 overscroll-contain">
            {/* "All categories" option (visible if search is empty or matches "all") */}
            {(!search || "all categories".includes(search.toLowerCase())) && (
              <button
                type="button"
                role="option"
                aria-selected={value === "All" || !value}
                onClick={() => {
                  onChange("All");
                  closeDropdown();
                }}
                className={cn(
                  "group flex w-full items-center justify-between gap-3 rounded-xl px-2.5 py-2 text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer",
                  value === "All" || !value
                    ? "bg-primary text-primary-foreground shadow-xs font-bold"
                    : "text-foreground hover:bg-muted/70",
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                      value === "All" || !value
                        ? "bg-primary-foreground/15 text-primary-foreground"
                        : "bg-secondary text-foreground group-hover:bg-primary group-hover:text-primary-foreground",
                    )}
                  >
                    <CategoryIcon name="All" className="size-3.5" />
                  </span>
                  <span className="truncate">All categories</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums",
                      value === "All" || !value
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-secondary text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    {totalProducts}
                  </span>
                  {(value === "All" || !value) && (
                    <Check className="size-4 shrink-0 text-primary-foreground" />
                  )}
                </div>
              </button>
            )}

            {/* Category Items */}
            {filteredCategories.map((c) => {
              const isSelected = value === c.name;

              return (
                <button
                  key={c.name}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(c.name);
                    closeDropdown();
                  }}
                  className={cn(
                    "group flex w-full items-center justify-between gap-3 rounded-xl px-2.5 py-2 text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs font-bold"
                      : "text-foreground hover:bg-muted/70",
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                        isSelected
                          ? "bg-primary-foreground/15 text-primary-foreground"
                          : "bg-secondary text-foreground group-hover:bg-primary group-hover:text-primary-foreground",
                      )}
                    >
                      <CategoryIcon name={c.name} className="size-3.5" />
                    </span>
                    <span className="truncate">{c.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums",
                        isSelected
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-secondary text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      {c.count}
                    </span>
                    {isSelected && (
                      <Check className="size-4 shrink-0 text-primary-foreground" />
                    )}
                  </div>
                </button>
              );
            })}

            {filteredCategories.length === 0 && search && (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No categories matching &ldquo;{search}&rdquo;
              </div>
            )}
          </div>

          {/* Footer Navigation Link */}
          {showCategoryCatalogLink && (
            <div className="mt-1 border-t border-muted/80 p-1.5 pt-2">
              <Link
                href="/categories"
                onClick={closeDropdown}
                className="group flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <span>Browse category directory</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
