import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Admin from "./pages/Admin";
import Agent from "./pages/Agent";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import Product from "./pages/Product";
import Profile from "./pages/Profile";
import Templates from "./pages/Templates";
import OwnerDashboard from "./pages/OwnerDashboard";
import { AppShell } from "./components/nav/AppShell";
import AppLayout from "./layouts/AppLayout";

export default function App() {
  return (
    <Routes>
      {/* Auth (no layout) */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Marketing (AppShell) */}
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/pricing" element={<NotFound />} />
        <Route path="/solutions" element={<NotFound />} />
        <Route path="/integrations" element={<NotFound />} />
        <Route path="/services" element={<NotFound />} />
        <Route path="/support" element={<NotFound />} />
        <Route path="/contact" element={<NotFound />} />
        <Route path="/trust" element={<NotFound />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
      </Route>

      {/* App (AppLayout) */}
      <Route element={<AppLayout />}>
        <Route path="/agent" element={<Agent />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />

        {/* placeholders */}
        <Route path="/appointments" element={<NotFound />} />
        <Route path="/contacts" element={<NotFound />} />
        <Route path="/notes" element={<NotFound />} />
        <Route path="/reports" element={<NotFound />} />
        <Route path="/expenses" element={<NotFound />} />

        {/* demos */}
        <Route path="/analytics" element={<NotFound />} />
        <Route path="/email-builder" element={<NotFound />} />
        <Route path="/zapier-intercom" element={<NotFound />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}