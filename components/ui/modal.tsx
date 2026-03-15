"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];

  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
}

export function Modal({
  children,
  titleId,
}: {
  children: React.ReactNode;
  titleId?: string;
}) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    previousActiveElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    document.body.style.overflow = "hidden";

    const focusable = getFocusableElements(dialogRef.current);
    (focusable[0] ?? closeButtonRef.current ?? dialogRef.current)?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previousActiveElementRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onDismiss();
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = getFocusableElements(dialogRef.current);
      if (focusable.length === 0) {
        e.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onDismiss]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onDismiss();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative mx-4 w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-lg"
      >
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close modal"
          onClick={onDismiss}
          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          Close
        </button>
        {children}
      </div>
    </div>
  );
}
