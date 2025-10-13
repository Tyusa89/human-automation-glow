import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

const integrations = [
  { label: "Slack", href: "/integrations?provider=slack" },
  { label: "Gmail", href: "/integrations?provider=gmail" },
  { label: "Google Sheets", href: "/integrations?provider=google-sheets" },
  { label: "HubSpot", href: "/integrations?provider=hubspot" },
  { label: "Salesforce", href: "/integrations?provider=salesforce" },
  { label: "Zendesk", href: "/integrations?provider=zendesk" },
  { label: "Twilio", href: "/integrations?provider=twilio" },
  { label: "Notion", href: "/integrations?provider=notion" },
  { label: "All Integrations", href: "/integrations", highlight: true },
];

export default function IntegrationsMegaMenu({ className }: { className?: string }) {
  return (
    <NavigationMenu className={cn("", className)}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-base bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent/50">
            Integrations
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[280px] p-4">
              <ul className="grid grid-cols-1 gap-1">
                {integrations.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className={cn(
                        "block rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm hover:bg-muted transition-colors",
                        item.highlight && "text-primary font-medium"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
