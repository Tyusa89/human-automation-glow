import { Section } from "@/components/Sections";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { integrationProviders } from "@/lib/integration-providers";
import { useIntegrations } from "@/hooks/useIntegrations";
import { useRole } from "@/hooks/useRole";
import { IntegrationCard } from "@/components/integrations/IntegrationCard";
import { IntegrationDrawer } from "@/components/integrations/IntegrationDrawer";
import { OnboardingWizard } from "@/components/integrations/OnboardingWizard";
import { useToast } from "@/hooks/use-toast";

export default function IntegrationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const { toast } = useToast();
  const { role } = useRole();
  
  const {
    integrations,
    isLoading,
    getIntegration,
    connect,
    disconnect,
    sync,
    test,
    isConnecting
  } = useIntegrations();

  const canManage = role === 'admin' || role === 'owner';

  // Handle deep links
  useEffect(() => {
    const connectParam = searchParams.get('connect');
    const providerParam = searchParams.get('provider');
    const onboardParam = searchParams.get('onboard');
    const connectedParam = searchParams.get('connected');
    const errorParam = searchParams.get('error');

    if (connectedParam) {
      toast({
        title: "Connected!",
        description: `Successfully connected to ${connectedParam}`
      });
      searchParams.delete('connected');
      setSearchParams(searchParams);
    } else if (errorParam) {
      toast({
        title: "Connection failed",
        description: errorParam.replace(/_/g, ' '),
        variant: "destructive"
      });
      searchParams.delete('error');
      setSearchParams(searchParams);
    } else if (connectParam && integrationProviders[connectParam]) {
      setSelectedProvider(connectParam);
      // Auto-start connection
      setTimeout(() => {
        if (canManage) {
          connect(connectParam);
        }
      }, 500);
      searchParams.delete('connect');
      setSearchParams(searchParams);
    } else if (providerParam && integrationProviders[providerParam]) {
      setSelectedProvider(providerParam);
      searchParams.delete('provider');
      setSearchParams(searchParams);
    } else if (onboardParam === '1') {
      setShowWizard(true);
      searchParams.delete('onboard');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, canManage, connect, toast]);

  const handleWizardComplete = (selectedProviders: string[]) => {
    toast({
      title: "Ready to connect",
      description: `Selected ${selectedProviders.length} integrations. Click Connect on each card to get started.`
    });
  };

  if (isLoading) {
    return (
      <Section title="Integrations" eyebrow="Connect everything">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Section>
    );
  }

  return (
    <Section title="Integrations" eyebrow="Connect everything">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">
          Connect your favorite tools and automate your workflows
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowWizard(true)}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Quick Setup
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(integrationProviders).map((provider) => {
          const integration = getIntegration(provider.id);
          
          return (
            <IntegrationCard
              key={provider.id}
              provider={provider}
              integration={integration}
              onConnect={() => connect(provider.id)}
              onDisconnect={() => disconnect(provider.id)}
              onSync={() => sync(provider.id)}
              onTest={() => test(provider.id)}
              onLearnMore={() => setSelectedProvider(provider.id)}
              isConnecting={isConnecting}
              canManage={canManage}
            />
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        Plus generic REST, Webhook, and DB connectors for custom integrations.
      </p>

      <IntegrationDrawer
        provider={selectedProvider ? integrationProviders[selectedProvider] : null}
        integration={selectedProvider ? getIntegration(selectedProvider) : undefined}
        open={!!selectedProvider}
        onOpenChange={(open) => !open && setSelectedProvider(null)}
        onConnect={() => selectedProvider && connect(selectedProvider)}
        onTest={() => selectedProvider && test(selectedProvider)}
        canManage={canManage}
      />

      <OnboardingWizard
        open={showWizard}
        onOpenChange={setShowWizard}
        onComplete={handleWizardComplete}
      />
    </Section>
  );
}