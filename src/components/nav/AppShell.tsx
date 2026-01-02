import React from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";

export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AppSidebar />
      {/* IMPORTANT: main area is offset by sidebar width using CSS variables */}
      <main
        className="min-h-screen transition-[padding] duration-200"
        style={{
          paddingLeft: "var(--sidebar-w, 88px)",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}