import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/layout/AppHeader";
import Sidebar from "../components/layout/Sidebar";
import { hardSignOut } from "../lib/authActions";

function useHardSignOutHotkey() {
  useEffect(() => {
    const onKeyDown = async (e: KeyboardEvent) => {
      if (e.key === "Escape" && e.shiftKey) {
        console.log("🔴 Hard sign out triggered (Shift+Esc)");
        hardSignOut("/auth");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}

export default function AppLayout() {
  const location = useLocation();
  
  // Global escape hatch: Shift+Esc to force sign out
  useHardSignOutHotkey();

  // Optional: hide sidebar on auth pages only
  const hideSidebar = location.pathname.startsWith("/auth");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex h-[calc(100vh-56px)]">
        {!hideSidebar && <Sidebar />}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}