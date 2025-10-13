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
import { BadgeCheck, MessageSquare, Users, DollarSign, Zap } from "lucide-react";

const solutions = [
  { label: "Lead Intake & Qualification", href: "/solutions/lead-qualification", desc: "Forms → enrichment → CRM deal + alerts", icon: BadgeCheck },
  { label: "AI Support Widget", href: "/solutions/ai-support", desc: "Chat + ticketing → Zendesk → summaries", icon: MessageSquare },
  { label: "Onboarding Automation", href: "/solutions/onboarding", desc: "DocuSign, Notion, Drive, Slack in one click", icon: Users },
  { label: "Revenue Ops / Dunning", href: "/solutions/revops", desc: "Stripe retries + sequences + status dashboards", icon: DollarSign },
  { label: "Agent + Workflow Hybrid", href: "/solutions/agents", desc: "EcoNest agents call n8n flows for heavy lifting", icon: Zap },
];

export default function SolutionsMegaMenu({ className }: { className?: string }) {
  return (
    <NavigationMenu className={cn("", className)}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-base bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent/50">
            Solutions
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[640px] p-6 md:w-[780px]">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground">
                <BadgeCheck className="h-4 w-4"/> Featured Solutions
              </div>
              <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {solutions.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label}>
                      <Link
                        to={item.href}
                        className="group flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 hover:bg-muted transition-colors"
                      >
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="leading-tight">
                          <span className="block text-sm font-medium">{item.label}</span>
                          <span className="block text-xs text-muted-foreground">{item.desc}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
