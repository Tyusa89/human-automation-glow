import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { CommandMenu } from '@/components/CommandMenu';
import AuthPage from '@/pages/AuthPage';
import RequireAuth from '@/components/RequireAuth';
import RequireAdmin from '@/components/RequireAdmin';
import AuthedLayout from '@/layouts/AuthedLayout';
import Dashboard from '@/pages/Dashboard';
import Results from '@/pages/Results';
import AdminPage from '@/pages/Admin';
import Index from '@/pages/Index';
import ProductPage from '@/pages/Product';
import SolutionsPage from '@/pages/Solutions';
import TemplatesPage from '@/pages/Templates';
import IntegrationsPage from '@/pages/Integrations';
import ServicesPage from '@/pages/Services';
import PricingPage from '@/pages/Pricing';
import PaymentPage from '@/pages/Payment';
import SupportHub from '@/pages/SupportHub';
import TemplatesGuide from '@/pages/docs/TemplatesGuide';
import GettingStarted from '@/pages/docs/GettingStarted';
import IntegrationsGuide from '@/pages/docs/IntegrationsGuide';
import SolutionsGuide from '@/pages/docs/SolutionsGuide';
import TroubleshootingGuide from '@/pages/docs/TroubleshootingGuide';
import TrustPage from '@/pages/Trust';
import ContactPage from '@/pages/ContactPage';
import CreateProfile from '@/pages/CreateProfile';
import SetupPage from '@/pages/Setup';
import PaymentTerms from '@/pages/PaymentTerms';
import TermsAcceptance from '@/pages/TermsAcceptance';
import OwnerDashboard from '@/pages/OwnerDashboard';
import OwnerApprovals from '@/pages/OwnerApprovals';
import NotFound from '@/pages/NotFound';
import ErrorBoundary from "./components/ErrorBoundary";
import { TemplateDetail } from '@/components/templates/TemplateDetail';
import TemplateSetupWizard from '@/pages/templates/TemplateSetupWizard';
import ZapierIntercomIntegration from '@/pages/templates/ZapierIntercomIntegration';
import SocialMediaScheduler from '@/pages/templates/SocialMediaScheduler';
import EmailCampaignBuilder from '@/pages/templates/EmailCampaignBuilder';
import InventoryManager from '@/pages/templates/InventoryManager';
import DataSyncTool from '@/pages/templates/DataSyncTool';
import ReportGenerator from '@/pages/templates/ReportGenerator';
import AnalyticsDashboard from '@/pages/templates/AnalyticsDashboard';
import CustomerServiceWidget from '@/components/CustomerServiceWidget';
import TemplateSuccess from '@/pages/TemplateSuccess';
import BookPage from '@/pages/Book';
import DashboardAppointments from '@/pages/DashboardAppointments';
import AdminAppointments from '@/pages/AdminAppointments';
import AppointmentsPage from '@/pages/Appointments';
import Onboarding from '@/pages/Onboarding';
import DashboardSettings from '@/pages/DashboardSettings';
import RedirectTo from '@/components/routing/RedirectTo';

const queryClient = new QueryClient();

const App = () => {
  console.log('App component is rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ErrorBoundary>
          <CommandMenu />
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/book" element={<BookPage />} />

            {/* Authenticated routes - all wrapped in AuthedLayout */}
            <Route element={<RequireAuth><AuthedLayout /></RequireAuth>}>
              <Route path="/" element={<Index />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/product" element={<ProductPage />} />
              <Route path="/solutions" element={<SolutionsPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/templates/:templateId/setup" element={<TemplateSetupWizard />} />
              <Route path="/template-success" element={<TemplateSuccess />} />
              <Route path="/demo/zapier-intercom" element={<ZapierIntercomIntegration />} />
              <Route path="/demo/social-media-scheduler" element={<SocialMediaScheduler />} />
              <Route path="/demo/email-campaign-builder" element={<EmailCampaignBuilder />} />
              <Route path="/demo/inventory-manager" element={<InventoryManager />} />
              <Route path="/demo/data-sync-tool" element={<DataSyncTool />} />
              <Route path="/demo/report-generator" element={<ReportGenerator />} />
              <Route path="/demo/analytics-dashboard" element={<AnalyticsDashboard />} />
              <Route path="/templates/:slug" element={<TemplateDetail />} />
              <Route path="/integrations" element={<IntegrationsPage />} />
              
              {/* Support hub routes */}
              <Route path="/support" element={<SupportHub />} />
              <Route path="/support/getting-started" element={<GettingStarted />} />
              <Route path="/support/templates" element={<TemplatesGuide />} />
              <Route path="/support/integrations" element={<IntegrationsGuide />} />
              <Route path="/support/solutions" element={<SolutionsGuide />} />
              <Route path="/support/troubleshooting" element={<TroubleshootingGuide />} />
              
              {/* Redirects from old routes */}
              <Route path="/docs" element={<RedirectTo to="/support" />} />
              <Route path="/docs/getting-started" element={<RedirectTo to="/support/getting-started" />} />
              <Route path="/docs/templates" element={<RedirectTo to="/support/templates" />} />
              <Route path="/docs/integrations" element={<RedirectTo to="/support/integrations" />} />
              <Route path="/docs/solutions" element={<RedirectTo to="/support/solutions" />} />
              <Route path="/docs/troubleshooting" element={<RedirectTo to="/support/troubleshooting" />} />
              <Route path="/help" element={<RedirectTo to="/support" />} />
              
              <Route path="/trust" element={<TrustPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/payment-terms" element={<PaymentTerms />} />
              <Route path="/terms-acceptance" element={<TermsAcceptance />} />
              <Route path="/owner-dashboard" element={<OwnerDashboard />} />
              <Route path="/owner/approvals" element={<OwnerApprovals />} />
              <Route path="/setup" element={<SetupPage />} />
              <Route path="/create-profile" element={<CreateProfile />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/dashboard/appointments" element={<DashboardAppointments />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/settings" element={<DashboardSettings />} />
              
              {/* Admin routes */}
              <Route path="/results" element={<RequireAdmin><Results /></RequireAdmin>} />
              <Route path="/admin" element={<RequireAdmin><AdminPage /></RequireAdmin>} />
              <Route path="/admin/appointments" element={<RequireAdmin><AdminAppointments /></RequireAdmin>} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          <CustomerServiceWidget />
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
