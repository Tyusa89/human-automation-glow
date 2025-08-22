import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import AuthPage from '@/pages/AuthPage';
import RequireAuth from '@/components/RequireAuth';
import Dashboard from '@/pages/Dashboard';
import Index from '@/pages/Index';
import ServicesPage from '@/pages/Services';
import ContactPage from '@/pages/ContactPage';
import NotFound from '@/pages/NotFound';
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ErrorBoundary>
        <Routes>
          {/* public */}
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* protected */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
