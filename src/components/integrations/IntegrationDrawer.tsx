import { CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { IntegrationProvider } from "@/lib/integration-providers";
import { Integration } from "@/hooks/useIntegrations";

interface IntegrationDrawerProps {
  provider: IntegrationProvider | null;
  integration?: Integration;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: () => void;
  onTest: () => void;
  canManage: boolean;
}

export function IntegrationDrawer({
  provider,
  integration,
  open,
  onOpenChange,
  onConnect,
  onTest,
  canManage
}: IntegrationDrawerProps) {
  if (!provider) return null;

  const isConnected = integration?.status === 'connected';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl text-foreground">{provider.name} Integration</SheetTitle>
          <SheetDescription className="text-base pt-2 text-foreground/80">
            {provider.description}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Key Features */}
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Key Features</h4>
            <ul className="space-y-2">
              {provider.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What We Sync */}
          <div>
            <h4 className="font-semibold mb-3 text-foreground">What We Sync</h4>
            <p className="text-sm text-foreground/80 mb-2">
              This integration syncs data bidirectionally to keep your systems in sync.
            </p>
            {provider.scopes && provider.scopes.length > 0 && (
              <div className="bg-muted rounded-lg p-3 text-xs">
                <p className="font-medium mb-1">Required Permissions:</p>
                <ul className="list-disc list-inside space-y-1">
                  {provider.scopes.map((scope, idx) => (
                    <li key={idx} className="text-muted-foreground">{scope}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Data Flow */}
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Data Flow</h4>
            <div className="bg-muted rounded-lg p-4 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span>Your App → {provider.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span>{provider.name} → Your App</span>
              </div>
            </div>
          </div>

          {/* Connection Status */}
          {integration && (
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Connection Status</h4>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Status</span>
                  <span className={`text-sm font-medium ${
                    isConnected ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {integration.status}
                  </span>
                </div>
                {integration.last_sync && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Sync</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(integration.last_sync).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Troubleshooting */}
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Troubleshooting</h4>
            <p className="text-sm text-foreground/80 mb-3">
              If you're experiencing issues, try testing the connection or reconnecting.
            </p>
            {isConnected && (
              <Button variant="outline" size="sm" onClick={onTest} className="w-full">
                Test Connection
              </Button>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            {!isConnected ? (
              <Button onClick={onConnect} className="flex-1" disabled={!canManage}>
                Connect {provider.name}
              </Button>
            ) : null}
            
            {provider.docs && (
              <Button variant="outline" asChild className={!isConnected ? "" : "flex-1"}>
                <a href={provider.docs} target="_blank" rel="noopener noreferrer">
                  View Docs
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
