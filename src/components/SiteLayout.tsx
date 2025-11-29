import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { brand } from "@/components/Brand";
import ProductMegaMenu from "@/components/ProductMegaMenu";
import SolutionsMegaMenu from "@/components/SolutionsMegaMenu";
import TemplatesMegaMenu from "@/components/TemplatesMegaMenu";
import IntegrationsMegaMenu from "@/components/IntegrationsMegaMenu";
import { supabase } from "@/integrations/supabase/client";
import { useRole, isAdminLike } from "@/hooks/useRole";

// Shared site header
export const SiteHeader: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const navigate = useNavigate();
  const { role, loading: roleLoading } = useRole();
  const adminLike = isAdminLike(role);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setAuthed(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (mounted) setAuthed(!!session);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/auth");
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src={brand.logoUrl} alt={brand.name} className="h-8 w-8" />
          <div className="font-semibold">{brand.name}</div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 text-sm">
          <ProductMegaMenu />
          <SolutionsMegaMenu />
          <TemplatesMegaMenu />
          <IntegrationsMegaMenu />
          <Link to="/pricing" className="hover:text-muted-foreground px-2">Pricing</Link>
          <Link to="/docs" className="hover:text-muted-foreground px-2">Docs</Link>
          <Link to="/trust" className="hover:text-muted-foreground px-2">Security</Link>
          {authed && (
            <>
              <Link to="/dashboard" className="hover:text-primary transition-colors px-2">Dashboard</Link>
              {role === "owner" && (
                <Link
                  to="/owner-dashboard"
                  className="hover:text-primary transition-colors px-2 text-emerald-500 font-medium"
                >
                  Owner Dashboard
                </Link>
              )}
              {adminLike && (
                <Link to="/admin" className="hover:text-primary transition-colors px-2 font-medium">
                  Admin
                </Link>
              )}
            </>
          )}
          {!roleLoading && role && (
            <span className="px-2 py-0.5 text-xs rounded-full border border-border text-foreground/80">
              {role.toUpperCase()}
            </span>
          )}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          {authed ? (
            <Button variant="ghost" onClick={handleLogout}>Sign out</Button>
          ) : (
            <Link to="/auth">
              <Button variant="ghost">Sign in</Button>
            </Link>
          )}
          <Link to="/create-profile">
            <Button variant="default">Start free</Button>
          </Link>
        </div>

        {/* Mobile: Menu button and Start free */}
        <div className="flex md:hidden items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/product" className="text-lg hover:text-primary" onClick={() => setOpen(false)}>Product</Link>
                <Link to="/solutions" className="text-lg hover:text-primary" onClick={() => setOpen(false)}>Solutions</Link>
                <Link to="/templates" className="text-lg hover:text-primary" onClick={() => setOpen(false)}>Templates</Link>
                <Link to="/integrations" className="text-lg hover:text-primary" onClick={() => setOpen(false)}>Integrations</Link>
                <Link to="/pricing" className="text-lg hover:text-primary" onClick={() => setOpen(false)}>Pricing</Link>
                <Link to="/docs" className="text-lg hover:text-primary" onClick={() => setOpen(false)}>Docs</Link>
                <Link to="/trust" className="text-lg hover:text-primary" onClick={() => setOpen(false)}>Security</Link>
                <Link to="/contact" className="text-lg hover:text-primary" onClick={() => setOpen(false)}>Contact</Link>
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                  {authed ? (
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                    >
                      Sign out
                    </Button>
                  ) : (
                    <Link to="/auth" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full">Sign in</Button>
                    </Link>
                  )}
                  <Link to="/create-profile" onClick={() => setOpen(false)}>
                    <Button variant="default" className="w-full">Start free</Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          
          <Link to="/create-profile">
            <Button variant="default" size="sm">Start free</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

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
