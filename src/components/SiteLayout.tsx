import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { brand } from "@/components/Brand";

// Shared site header
export const SiteHeader: React.FC = () => (
  <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur">
    <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
      <Link to="/" className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl bg-emerald-700 text-white grid place-items-center font-bold overflow-hidden">
          <img src={brand.logoUrl} alt={brand.name} className="h-8 w-8 object-contain" />
        </div>
        <div className="font-semibold">{brand.name}</div>
      </Link>
      <nav className="hidden md:flex items-center gap-6 text-sm">
        <Link to="/product" className="hover:text-slate-600">Product</Link>
        <Link to="/solutions" className="hover:text-slate-600">Solutions</Link>
        <Link to="/templates" className="hover:text-slate-600">Templates</Link>
        <Link to="/integrations" className="hover:text-slate-600">Integrations</Link>
        <Link to="/pricing" className="hover:text-slate-600">Pricing</Link>
        <Link to="/docs" className="hover:text-slate-600">Docs</Link>
        <Link to="/trust" className="hover:text-slate-600">Security</Link>
        <Link to="/contact" className="hover:text-slate-600">Contact</Link>
      </nav>
      <div className="flex items-center gap-2">
        <Link to="/auth">
          <Button variant="ghost" className="hidden md:inline-flex">Sign in</Button>
        </Link>
        <Link to="/auth">
          <Button className={`${brand.primary.bg} ${brand.primary.bgHover}`}>Start free</Button>
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
      <p className="text-slate-600 mt-2">Agents & automations for modern teams.</p>
      <div className="flex justify-center gap-2 mt-4">
        <Link to="/auth">
          <Button className={`${brand.primary.bg} ${brand.primary.bgHover}`}>Start free</Button>
        </Link>
        <Button variant="outline" className={`${brand.primary.border} ${brand.primary.tint} hover:bg-emerald-50`}>Book a demo</Button>
      </div>
    </div>
  </footer>
);

// Layout wrapper
interface SiteLayoutProps {
  children: React.ReactNode;
}

export const SiteLayout: React.FC<SiteLayoutProps> = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white text-slate-900">
    <SiteHeader />
    <main>{children}</main>
    <SiteFooter />
  </div>
);