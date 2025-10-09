import { Link as LinkIcon, MoreVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { integrationProviders, IntegrationProvider } from "@/lib/integration-providers";
import { Integration } from "@/hooks/useIntegrations";
import { cn } from "@/lib/utils";

interface IntegrationCardProps {
  provider: IntegrationProvider;
  integration?: Integration;
  onConnect: () => void;
  onDisconnect: () => void;
  onSync: () => void;
  onTest: () => void;
  onLearnMore: () => void;
  isConnecting: boolean;
  canManage: boolean;
}

export function IntegrationCard({
  provider,
  integration,
  onConnect,
  onDisconnect,
  onSync,
  onTest,
  onLearnMore,
  isConnecting,
  canManage
}: IntegrationCardProps) {
  const isConnected = integration?.status === 'connected';
  const hasError = integration?.status === 'error';

  return (
    <div className={cn(
      "border rounded-xl bg-card p-4 transition-all duration-200 hover:shadow-md",
      hasError && "border-destructive/50"
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">{provider.name}</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {isConnected && (
            <Badge variant="default" className="text-xs">Connected</Badge>
          )}
          {hasError && (
            <Badge variant="destructive" className="text-xs">Error</Badge>
          )}
          
          {isConnected && canManage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onTest}>
                  Test connection
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSync}>
                  Sync now
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLearnMore}>
                  Edit settings
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={onDisconnect}
                  className="text-destructive"
                >
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {provider.description}
      </p>

      {integration?.last_sync && (
        <p className="text-xs text-muted-foreground mb-3">
          Last sync: {new Date(integration.last_sync).toLocaleString()}
        </p>
      )}

      {hasError && integration?.error_message && (
        <p className="text-xs text-destructive mb-3">
          {integration.error_message}
        </p>
      )}

      <div className="flex gap-2">
        {!isConnected ? (
          <>
            <Button 
              onClick={onConnect} 
              className="flex-1"
              disabled={isConnecting || !canManage}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                `Connect ${provider.name}`
              )}
            </Button>
            <Button variant="outline" onClick={onLearnMore}>
              Learn more
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={onLearnMore} className="flex-1">
            View details
          </Button>
        )}
      </div>
    </div>
  );
}
