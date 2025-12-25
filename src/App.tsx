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
import DocsHub from '@/pages/docs/DocsHub';
import TemplatesGuide from '@/pages/docs/TemplatesGuide';
import GettingStarted from '@/pages/docs/GettingStarted';
import IntegrationsGuide from '@/pages/docs/IntegrationsGuide';
import SolutionsGuide from '@/pages/docs/SolutionsGuide';
import TroubleshootingGuide from '@/pages/docs/TroubleshootingGuide';
import TrustPage from '@/pages/Trust';
import HelpPage from '@/pages/Help';
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
                {/* public - only auth page */}
                <Route path="/auth" element={<AuthPage />} />

                {/* protected - all app routes require authentication */}
                <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
                <Route path="/product" element={<RequireAuth><ProductPage /></RequireAuth>} />
                <Route path="/solutions" element={<RequireAuth><SolutionsPage /></RequireAuth>} />
                <Route path="/templates" element={<RequireAuth><TemplatesPage /></RequireAuth>} />
                <Route path="/templates/:templateId/setup" element={<RequireAuth><TemplateSetupWizard /></RequireAuth>} />
                <Route path="/template-success" element={<RequireAuth><TemplateSuccess /></RequireAuth>} />
                <Route path="/demo/zapier-intercom" element={<RequireAuth><ZapierIntercomIntegration /></RequireAuth>} />
                <Route path="/demo/social-media-scheduler" element={<RequireAuth><SocialMediaScheduler /></RequireAuth>} />
                <Route path="/demo/email-campaign-builder" element={<RequireAuth><EmailCampaignBuilder /></RequireAuth>} />
                <Route path="/demo/inventory-manager" element={<RequireAuth><InventoryManager /></RequireAuth>} />
                <Route path="/demo/data-sync-tool" element={<RequireAuth><DataSyncTool /></RequireAuth>} />
                <Route path="/demo/report-generator" element={<RequireAuth><ReportGenerator /></RequireAuth>} />
                <Route path="/demo/analytics-dashboard" element={<RequireAuth><AnalyticsDashboard /></RequireAuth>} />
                <Route path="/templates/:slug" element={<RequireAuth><TemplateDetail /></RequireAuth>} />
                <Route path="/integrations" element={<RequireAuth><IntegrationsPage /></RequireAuth>} />
                <Route path="/docs" element={<RequireAuth><DocsHub /></RequireAuth>} />
                <Route path="/docs/getting-started" element={<RequireAuth><GettingStarted /></RequireAuth>} />
                <Route path="/docs/templates" element={<RequireAuth><TemplatesGuide /></RequireAuth>} />
                <Route path="/docs/integrations" element={<RequireAuth><IntegrationsGuide /></RequireAuth>} />
                <Route path="/docs/solutions" element={<RequireAuth><SolutionsGuide /></RequireAuth>} />
                <Route path="/docs/troubleshooting" element={<RequireAuth><TroubleshootingGuide /></RequireAuth>} />
                <Route path="/help" element={<RequireAuth><HelpPage /></RequireAuth>} />
                <Route path="/trust" element={<RequireAuth><TrustPage /></RequireAuth>} />
                <Route path="/services" element={<RequireAuth><ServicesPage /></RequireAuth>} />
                <Route path="/pricing" element={<RequireAuth><PricingPage /></RequireAuth>} />
                <Route path="/payment" element={<RequireAuth><PaymentPage /></RequireAuth>} />
                <Route path="/contact" element={<RequireAuth><ContactPage /></RequireAuth>} />
                <Route path="/payment-terms" element={<RequireAuth><PaymentTerms /></RequireAuth>} />
                <Route path="/terms-acceptance" element={<RequireAuth><TermsAcceptance /></RequireAuth>} />
                <Route path="/owner-dashboard" element={<RequireAuth><OwnerDashboard /></RequireAuth>} />
                <Route path="/owner/approvals" element={<RequireAuth><OwnerApprovals /></RequireAuth>} />
                <Route path="/setup" element={<RequireAuth><SetupPage /></RequireAuth>} />
                <Route path="/create-profile" element={<RequireAuth><CreateProfile /></RequireAuth>} />

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
