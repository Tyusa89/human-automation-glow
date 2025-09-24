import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { Header, Footer } from '@/components/Chrome';
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
import DocsPage from '@/pages/Docs';
import TrustPage from '@/pages/Trust';
import ContactPage from '@/pages/ContactPage';
import CreateProfile from '@/pages/CreateProfile';
import SetupPage from '@/pages/Setup';
import NotFound from '@/pages/NotFound';
import ErrorBoundary from "./components/ErrorBoundary";
import { TemplateDetail } from '@/components/templates/TemplateDetail';
import TemplateSetupWizard from '@/pages/templates/TemplateSetupWizard';
import ZapierIntercomIntegration from '@/pages/templates/ZapierIntercomIntegration';
import SocialMediaScheduler from '@/pages/templates/SocialMediaScheduler';
import EmailCampaignBuilder from '@/pages/templates/EmailCampaignBuilder';
import InventoryManager from '@/pages/templates/InventoryManager';
import AnalyticsDashboard from '@/pages/templates/AnalyticsDashboard';
import CustomerServiceWidget from '@/components/CustomerServiceWidget';

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
            <Header />
            <main>
              <Routes>
                {/* public */}
                <Route path="/" element={<Index />} />
                <Route path="/product" element={<ProductPage />} />
                <Route path="/solutions" element={<SolutionsPage />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/templates/:templateId/setup" element={<TemplateSetupWizard />} />
                <Route path="/demo/zapier-intercom" element={<ZapierIntercomIntegration />} />
                <Route path="/demo/social-media-scheduler" element={<SocialMediaScheduler />} />
                <Route path="/demo/email-campaign-builder" element={<EmailCampaignBuilder />} />
                <Route path="/demo/inventory-manager" element={<InventoryManager />} />
                <Route path="/demo/analytics-dashboard" element={<AnalyticsDashboard />} />
                <Route path="/templates/:slug" element={<TemplateDetail />} />
                <Route path="/integrations" element={<IntegrationsPage />} />
                <Route path="/docs" element={<DocsPage />} />
                <Route path="/trust" element={<TrustPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/contact" element={<ContactPage />} />
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
