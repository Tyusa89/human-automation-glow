import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { brand } from "@/components/Brand";

// Shared site header
export const SiteHeader: React.FC = () => (
  <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur">
    <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
      <Link to="/" className="flex items-center gap-2">
        <img src={brand.logoUrl} alt={brand.name} className="h-8 w-8" />
        <div className="font-semibold">{brand.name}</div>
      </Link>
      <nav className="hidden md:flex items-center gap-6 text-sm">
        <Link to="/product" className="hover:text-muted-foreground">Product</Link>
        <Link to="/solutions" className="hover:text-muted-foreground">Solutions</Link>
        <Link to="/templates" className="hover:text-muted-foreground">Templates</Link>
        <Link to="/integrations" className="hover:text-muted-foreground">Integrations</Link>
        <Link to="/pricing" className="hover:text-muted-foreground">Pricing</Link>
        <Link to="/docs" className="hover:text-muted-foreground">Docs</Link>
        <Link to="/trust" className="hover:text-muted-foreground">Security</Link>
        <Link to="/contact" className="hover:text-muted-foreground">Contact</Link>
      </nav>
      <div className="flex items-center gap-2">
        <Link to="/auth">
          <Button variant="ghost" className="hidden md:inline-flex">Sign in</Button>
        </Link>
        <Link to="/create-profile">
          <Button variant="default">Start free</Button>
        </Link>
      </div>
    </div>
  </header>
);

// Shared site footer
export const SiteFooter: React.FC = () => (
  <footer className="border-t py-10">
    <div className="max-w-6xl mx-auto px-4 text-center">
      <div className="font-semibold">{brand.name}</div>
      <p className="text-muted-foreground mt-2">Agents & automations for modern teams.</p>
      <div className="flex justify-center gap-2 mt-4">
        <Link to="/create-profile">
          <Button variant="default">Start free</Button>
        </Link>
        <Button variant="outline">Book a demo</Button>
      </div>
    </div>
  </footer>
);

// Layout wrapper
interface SiteLayoutProps {
  children: React.ReactNode;
}

export const SiteLayout: React.FC<SiteLayoutProps> = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-b from-secondary via-background to-background text-foreground">
    <SiteHeader />
    <main>{children}</main>
    <SiteFooter />
  </div>
);