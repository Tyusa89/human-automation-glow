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

const solutions = [
  { label: "CRM Integration", href: "/solutions/crm" },
  { label: "Payment Processing", href: "/solutions/payments" },
  { label: "Marketing Automation", href: "/solutions/marketing-automation" },
  { label: "Customer Service AI", href: "/solutions/customer-service" },
  { label: "Analytics & Reporting", href: "/solutions/analytics" },
  { label: "Workflow Automation", href: "/solutions/workflow" },
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
            <div className="w-[280px] p-4">
              <ul className="grid grid-cols-1 gap-1">
                {solutions.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="block rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm hover:bg-muted transition-colors"
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
