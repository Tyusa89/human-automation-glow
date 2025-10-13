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
import { Boxes, Database, MessageCircle, BarChart3, Mail, Users } from "lucide-react";

const templates = [
  { label: "Data Sync Pipeline", href: "/templates/data-sync-tool", desc: "ETL + normalize + upsert to Supabase", tag: "Popular", icon: Database },
  { label: "Customer Support Widget", href: "/templates/support-widget", desc: "Chat + FAQ + ticket handoff", icon: MessageCircle },
  { label: "KPI Dashboard", href: "/templates/kpi-dashboard", desc: "Metrics by org with role-based views", icon: BarChart3 },
  { label: "Outbound Sequences", href: "/templates/outbound-seq", desc: "3‑step email + Slack for speed‑to‑lead", icon: Mail },
  { label: "Onboarding Pack", href: "/templates/onboarding-pack", desc: "Drive/Notion/Slack + checklist", icon: Users },
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
            <div className="w-[620px] p-6 md:w-[760px]">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground">
                <Boxes className="h-4 w-4"/> Ready‑to‑use Templates
              </div>
              <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {templates.map((item) => {
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
                          <span className="flex items-center gap-2 text-sm font-medium">
                            {item.label}
                            {item.tag && (
                              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">{item.tag}</span>
                            )}
                          </span>
                          <span className="block text-xs text-muted-foreground">{item.desc}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 text-right text-xs">
                <Link to="/templates" className="text-primary underline underline-offset-2">Browse all templates →</Link>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
