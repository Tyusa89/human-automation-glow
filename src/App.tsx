import { Routes, Route } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";

import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Agent from "@/pages/Agent";
import Auth from "@/pages/Auth";
import Templates from "@/pages/Templates";
import Product from "@/pages/Product";
import Solutions from "@/pages/Solutions";
import Pricing from "@/pages/Pricing";
import Integrations from "@/pages/Integrations";
import Services from "@/pages/Services";
import Support from "@/pages/Support";
import Contact from "@/pages/Contact";
import Trust from "@/pages/Trust";
import Admin from "@/pages/Admin";
import AuthCallback from "@/pages/AuthCallback";
import ComingSoon from "@/pages/ComingSoon";
import OwnerDashboard from "@/pages/OwnerDashboard";
import SetOwner from "@/pages/SetOwner";
import Appointments from "@/pages/Appointments";
import Contacts from "@/pages/Contacts";
import Notes from "@/pages/Notes";
import Reports from "@/pages/Reports";
import Expenses from "@/pages/Expenses";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Site */}
        <Route path="/" element={<Home />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/product" element={<Product />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/services" element={<Services />} />
        <Route path="/support" element={<Support />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/trust" element={<Trust />} />

        {/* Auth */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* App */}
        <Route path="/agent" element={<Agent />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/expenses" element={<Expenses />} />

        {/* Admin/Owner */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/owner-agent" element={<ComingSoon title="Owner Agent" />} />
        <Route path="/acm" element={<ComingSoon title="ACM" />} />
        <Route path="/contacts-directory" element={<ComingSoon title="Contacts Directory" />} />
        <Route path="/approvals" element={<ComingSoon title="Approvals" />} />
        <Route path="/set-owner" element={<SetOwner />} />
        <Route path="/profile" element={<Profile />} />

        {/* Demos */}
        <Route path="/demos/analytics" element={<ComingSoon title="Analytics Demo" />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}