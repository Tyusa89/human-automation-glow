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

const templates = [
  { label: "Lead-Qual Agent", href: "/templates/lead-qual" },
  { label: "Support Triage", href: "/templates/support-triage" },
  { label: "Onboarding Flow", href: "/templates/onboarding" },
  { label: "Data Enrichment", href: "/templates/data-enrichment" },
  { label: "Email Campaign Builder", href: "/templates/email-campaign" },
  { label: "Analytics Dashboard", href: "/templates/analytics" },
  { label: "All Templates", href: "/templates", highlight: true },
];

export default function TemplatesMegaMenu({ className }: { className?: string }) {
  return (
    <NavigationMenu className={cn("", className)}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-base bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent/50">
            Templates
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[280px] p-4">
              <ul className="grid grid-cols-1 gap-1">
                {templates.map((item) => (
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
