import { Link } from "react-router-dom";
import { brand } from "@/components/Brand";
import { Badge } from "@/components/Sections";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground grid place-items-center font-bold overflow-hidden">
              <img src={brand.logoUrl} alt={brand.name} className="h-8 w-8 object-contain" />
            </div>
            <div className="font-semibold">{brand.name}</div>
          </Link>
          <div className="hidden md:flex items-center gap-2 ml-3">
            <Badge>Beta</Badge>
            <Badge>Zapier × Intercom vibe</Badge>
          </div>
        </div>

        <nav aria-label="Main" className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/product" className="hover:text-primary transition-colors">Product</Link>
          <Link to="/solutions" className="hover:text-primary transition-colors">Solutions</Link>
          <Link to="/templates" className="hover:text-primary transition-colors">Templates</Link>
          <Link to="/integrations" className="hover:text-primary transition-colors">Integrations</Link>
          <Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
          <Link to="/docs" className="hover:text-primary transition-colors">Docs</Link>
          <Link to="/trust" className="hover:text-primary transition-colors">Security</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/auth">
            <Button variant="ghost" className="hidden md:inline-flex">Sign in</Button>
          </Link>
          <Link to="/create-profile">
            <Button>Start free</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t py-10">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="font-semibold">{brand.name}</div>
          <p className="text-muted-foreground mt-2">Agents & automations for modern teams.</p>
        </div>
        <div>
          <div className="font-semibold mb-2">Product</div>
          <ul className="space-y-1 text-muted-foreground">
            <li><Link to="/product" className="hover:underline hover:text-foreground transition-colors">Overview</Link></li>
            <li><Link to="/templates" className="hover:underline hover:text-foreground transition-colors">Templates</Link></li>
            <li><Link to="/integrations" className="hover:underline hover:text-foreground transition-colors">Integrations</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Company</div>
          <ul className="space-y-1 text-muted-foreground">
            <li><Link to="/trust" className="hover:underline hover:text-foreground transition-colors">Trust</Link></li>
            <li><Link to="/docs" className="hover:underline hover:text-foreground transition-colors">Docs</Link></li>
            <li><Link to="/pricing" className="hover:underline hover:text-foreground transition-colors">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Get started</div>
          <div className="flex gap-2">
            <Link to="/create-profile">
              <Button>Start free</Button>
            </Link>
            <Button variant="outline">Book a demo</Button>
          </div>
        </div>
      </div>
    </footer>
  );
}