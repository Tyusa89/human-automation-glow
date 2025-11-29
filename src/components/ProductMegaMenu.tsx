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
import { Layout, PenTool, Share2, ShoppingBag, Mail, Bot, Palette, Code2, Megaphone, Sparkles, MessageSquare } from "lucide-react";

const productItems = [
  { label: "Web Design", href: "/product", desc: "Modern, fast, conversion‑focused sites", icon: Layout },
  { label: "Creative", href: "/product", desc: "Brand visuals, content, and ads", icon: PenTool },
  { label: "Social Media Marketing", href: "/product", desc: "Planning, UGC pipelines, scheduling", icon: Share2 },
  { label: "eCommerce", href: "/product", desc: "Stores, funnels, product ops", icon: ShoppingBag },
  { label: "Email Marketing", href: "/product", desc: "Newsletters, sequences, automations", icon: Mail },
  { label: "AI Marketing", href: "/product", desc: "Personalized content & targeting", icon: Sparkles },
  { label: "Branding", href: "/product", desc: "Identity, voice, and guidelines", icon: Palette },
  { label: "Web Development", href: "/product", desc: "Custom apps & integrations", icon: Code2 },
  { label: "Influencer Marketing", href: "/product", desc: "Creator strategy & outreach", icon: Megaphone },
  { label: "AI Agents", href: "/product", desc: "Intelligent automation workflows", icon: Bot },
  { label: "AI Chat bot", href: "/product", desc: "Site chat, support, lead capture", icon: MessageSquare },
];

export default function ProductMegaMenu({ className }: { className?: string }) {
  return (
    <NavigationMenu className={cn("", className)}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            Product
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[480px] p-4">
              <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {productItems.map((item) => {
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
