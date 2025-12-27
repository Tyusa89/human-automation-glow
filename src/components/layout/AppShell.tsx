import React from "react";
import { Link } from "react-router-dom";
import { brand } from "@/components/Brand";

type AppShellProps = {
  title?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
};

export default function AppShell({ title, rightSlot, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              B
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-none">{brand.name}</span>
              <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
                {brand.tagline}
              </span>
            </div>
          </Link>

          {/* Page title (optional) */}
          <div className="hidden sm:block text-sm font-medium text-muted-foreground">
            {title ?? ""}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">{rightSlot}</div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          {children}
        </div>
      </main>
    </div>
  );
}
