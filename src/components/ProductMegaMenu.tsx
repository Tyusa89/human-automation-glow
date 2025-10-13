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

const services = [
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
  { label: "AI Agents", href: "/services/ai-agents" },
  { label: "AI Chat bot", href: "/services/ai-chatbot" },
];

export default function ProductMegaMenu({ className }: { className?: string }) {
  return (
    <NavigationMenu className={cn("", className)}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-base bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent/50">
            Product
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[320px] p-4">
              <ul className="grid grid-cols-1 gap-1">
                {services.map((item) => (
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
