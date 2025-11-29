import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { Footer } from '@/components/Chrome';
import AppHeader from '@/components/Header';
import { CommandMenu } from '@/components/CommandMenu';
import AuthPage from '@/pages/AuthPage';
import RequireAuth from '@/components/RequireAuth';
import RequireAdmin from '@/components/RequireAdmin';
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
import DocsPage from '@/pages/Docs';
import TrustPage from '@/pages/Trust';
import HelpPage from '@/pages/Help';
import ContactPage from '@/pages/ContactPage';
import CreateProfile from '@/pages/CreateProfile';
import SetupPage from '@/pages/Setup';
import PaymentTerms from '@/pages/PaymentTerms';
import TermsAcceptance from '@/pages/TermsAcceptance';
import OwnerDashboard from '@/pages/OwnerDashboard';
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

const queryClient = new QueryClient();

const App = () => {
  console.log('App component is rendering');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-background to-background text-foreground">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ErrorBoundary>
            <CommandMenu />
            <AppHeader />
            <main>
              <Routes>
                {/* public */}
                <Route path="/" element={<Index />} />
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
                <Route path="/docs" element={<DocsPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/trust" element={<TrustPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/contact" element={<ContactPage />} />
          <Route path="/payment-terms" element={<PaymentTerms />} />
          <Route path="/terms-acceptance" element={<TermsAcceptance />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
                <Route path="/setup" element={<SetupPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/create-profile" element={<CreateProfile />} />

                {/* protected */}
                <Route
                  path="/dashboard"
                  element={
                    <RequireAuth>
                      <Dashboard />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/results"
                  element={
                    <RequireAuth>
                      <RequireAdmin>
                        <Results />
                      </RequireAdmin>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <RequireAuth>
                      <RequireAdmin>
                        <AdminPage />
                      </RequireAdmin>
                    </RequireAuth>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <CustomerServiceWidget />
          </ErrorBoundary>
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
};

export default App;
