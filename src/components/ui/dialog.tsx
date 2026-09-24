"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Lets DialogTitle / DialogDescription attach their ids to the dialog element. */
const DialogContext = React.createContext<{
  titleId: string;
  descriptionId: string;
} | null>(null);

export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const restoreRef = React.useRef<HTMLElement | null>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();

  // Stable handle on the latest callback so focus effects don't re-run on
  // every parent render.
  const onOpenChangeRef = React.useRef(onOpenChange);
  React.useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  });

  React.useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement as HTMLElement | null;

    // Initial focus: [data-autofocus] on precise pointers (avoids popping the
    // mobile keyboard), else the first focusable element, else the panel.
    const panel = panelRef.current;
    if (panel) {
      const finePointer =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(pointer: fine)").matches;
      const target =
        (finePointer
          ? panel.querySelector<HTMLElement>("[data-autofocus]")
          : null) ??
        panel.querySelector<HTMLElement>(FOCUSABLE) ??
        panel;
      target.focus();
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChangeRef.current(false);
        return;
      }
      if (e.key !== "Tab") return;
      const p = panelRef.current;
      if (!p) return;
      const focusables = Array.from(
        p.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) =>
        typeof el.checkVisibility === "function" ? el.checkVisibility() : true,
      );
      const active = document.activeElement;
      if (!p.contains(active)) {
        // Focus escaped the dialog — pull it back in.
        e.preventDefault();
        (focusables[0] ?? p).focus();
        return;
      }
      if (focusables.length === 0) {
        e.preventDefault();
        p.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && (active === first || active === p)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      // Restore focus to the element that opened the dialog.
      const prev = restoreRef.current;
      if (prev && prev.isConnected) prev.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        className="animate-overlay-in absolute inset-0 bg-ink/60 backdrop-blur-[6px]"
        onClick={() => onOpenChangeRef.current(false)}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="relative z-10 w-full max-w-lg outline-none"
      >
        <DialogContext.Provider value={{ titleId, descriptionId }}>
          {children}
        </DialogContext.Provider>
      </div>
    </div>
  );
}

export function DialogContent({
  className,
  children,
  onClose,
}: {
  className?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "animate-dialog-in relative max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain rounded-3xl border border-border/70 bg-card p-6 sm:p-7 text-card-foreground shadow-[0_24px_60px_-16px_rgba(14,15,12,0.35)]",
        className,
      )}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 cursor-pointer rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <X className="size-4" />
      </button>
      {children}
    </div>
  );
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 space-y-1 pr-8">{children}</div>;
}

export function DialogTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(DialogContext);
  return (
    <h2
      id={ctx?.titleId}
      className={cn("font-display text-2xl font-black tracking-tight", className)}
    >
      {children}
    </h2>
  );
}

export function DialogDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(DialogContext);
  return (
    <p
      id={ctx?.descriptionId}
      className={cn("text-sm text-muted-foreground", className)}
    >
      {children}
    </p>
  );
}
