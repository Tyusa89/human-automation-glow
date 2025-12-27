import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { PlugZap } from "lucide-react";

const integrations = [
  { label: "HubSpot", href: "/integrations", desc: "Deals, contacts, activities" },
  { label: "Slack", href: "/integrations", desc: "Alerts, war rooms, approvals" },
  { label: "Gmail", href: "/integrations", desc: "Sequences, summaries, send-as" },
  { label: "Notion", href: "/integrations", desc: "Docs, project pages, wiki" },
  { label: "Google Drive", href: "/integrations", desc: "Client folders, exports" },
  { label: "Stripe", href: "/integrations", desc: "Invoices, dunning, products" },
  { label: "Zendesk", href: "/integrations", desc: "Tickets + sentiment" },
  { label: "Twilio", href: "/integrations", desc: "SMS notifications, OTP" },
  { label: "Supabase", href: "/integrations", desc: "Auth, RLS, storage, functions" },
  { label: "GitHub", href: "/integrations", desc: "Issues, releases, webhooks" },
];

export default function IntegrationsMegaMenu({ className }: { className?: string }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/integrations");
  };

  return (
    <NavigationMenu className={cn("", className)}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger onClick={handleClick} className="cursor-pointer">
            Integrations
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[620px] p-6 md:w-[760px]">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground">
                <PlugZap className="h-4 w-4"/> Connect your stack
              </div>
              <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {integrations.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="group flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 hover:bg-muted transition-colors"
                    >
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-foreground text-[11px] font-bold text-background">
                        {item.label.charAt(0)}
                      </span>
                      <span className="leading-tight">
                        <span className="block text-sm font-medium">{item.label}</span>
                        <span className="block text-xs text-muted-foreground">{item.desc}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-3 text-right text-xs">
                <Link to="/integrations" className="text-primary underline underline-offset-2">See all integrations →</Link>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
