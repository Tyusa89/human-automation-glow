import { Link } from "react-router-dom";
import { brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";

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

// Layout wrapper (no header since App.tsx already renders AppHeader)
interface SiteLayoutProps {
  children: React.ReactNode;
}

export const SiteLayout: React.FC<SiteLayoutProps> = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-b from-secondary via-background to-background text-foreground">
    <main>{children}</main>
    <SiteFooter />
  </div>
);
