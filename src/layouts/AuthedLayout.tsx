import { Outlet } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import Header from "@/components/Header";

export default function AuthedLayout() {
  return (
    <AppShell>
      <Header />
      <Outlet />
    </AppShell>
  );
}
