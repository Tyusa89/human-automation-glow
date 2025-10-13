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

// ---- Data you can edit quickly ----
const tools = [
  { label: "CRM Tools", href: "/services/crm-tools", desc: "HubSpot, Pipedrive, Salesforce wiring" },
  { label: "Online Payment Tools", href: "/services/payments", desc: "Stripe checkout, subscriptions & dunning" },
  { label: "AI Tools", href: "/services/ai-tools", desc: "AI agents, chat widgets, RAG" },
  { label: "Accounting Tools", href: "/services/accounting", desc: "QuickBooks, Xero automations" },
  { label: "Social Media Planning Tools", href: "/services/social", desc: "Scheduling & UGC pipelines" },
  { label: "Project Management Tools", href: "/services/project-mgmt", desc: "ClickUp, Asana, Notion ops" },
];

const mostPopular = [
  { label: "Web Design Tools", href: "/services/web-design" },
  { label: "Agency Management Tools", href: "/services/agency-mgmt" },
  { label: "SEO Tools", href: "/services/seo" },
  { label: "Landing Page Builders", href: "/services/landing-pages" },
  { label: "Marketing Reporting Tools", href: "/services/reporting" },
  { label: "Digital Marketing Analytics Tools", href: "/services/analytics" },
  { label: "All Tools", href: "/services", highlight: true },
];

const servicesUSA = [
  { label: "Web Design", href: "/services/web-design" },
  { label: "Creative", href: "/services/creative" },
  { label: "SEO", href: "/services/seo" },
  { label: "Social Media Marketing", href: "/services/social" },
  { label: "eCommerce", href: "/services/ecommerce" },
  { label: "Email Marketing", href: "/services/email" },
  { label: "AI Marketing", href: "/services/ai-marketing" },
  { label: "Branding", href: "/services/branding" },
  { label: "Web Development", href: "/services/web-dev" },
  { label: "Influencer Marketing", href: "/services/influencer" },
  { label: "Other Services", href: "/services/other", highlight: true },
];

// ---- Component ----
export default function ServicesMegaMenu({ className }: { className?: string }) {
  return (
    <NavigationMenu className={cn("", className)}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-base bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent/50">
            Services
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[640px] gap-6 p-6 md:w-[780px] md:grid-cols-2">
              {/* Column 1 */}
              <div>
                <h4 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground">Tools</h4>
                <ul className="space-y-1">
                  {tools.map((item) => (
                    <li key={item.label}>
                      <Link to={item.href} className="group flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 hover:bg-muted transition-colors">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-foreground text-[11px] font-bold text-background">
                          {item.label.charAt(0)}
                        </span>
                        <span className="leading-tight">
                          <span className="block text-sm font-medium">{item.label}</span>
                          {item.desc && (
                            <span className="block text-xs text-muted-foreground">{item.desc}</span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2 */}
              <div className="grid gap-6 sm:grid-rows-2">
                <div>
                  <h4 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground">Most Popular</h4>
                  <ul className="grid grid-cols-1 gap-1 sm:grid-cols-1">
                    {mostPopular.map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.href}
                          className={cn(
                            "block rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-sm hover:bg-muted transition-colors",
                            item.highlight && "text-primary underline underline-offset-2"
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground">All services in USA</h4>
                  <ul className="grid grid-cols-1 gap-1">
                    {servicesUSA.map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.href}
                          className={cn(
                            "block rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-sm hover:bg-muted transition-colors",
                            item.highlight && "text-primary underline underline-offset-2"
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
