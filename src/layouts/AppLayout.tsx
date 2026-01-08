import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/layout/AppHeader";
import Sidebar from "@/components/layout/Sidebar";

export default function AppLayout() {
  const location = useLocation();

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