import { Link } from "react-router-dom";
import { brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";

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
            <li>
              <Link
                to="/product"
                className="hover:underline hover:text-foreground transition-colors"
              >
                Overview
              </Link>
            </li>
            <li>
              <Link
                to="/templates"
                className="hover:underline hover:text-foreground transition-colors"
              >
                Templates
              </Link>
            </li>
            <li>
              <Link
                to="/integrations"
                className="hover:underline hover:text-foreground transition-colors"
              >
                Integrations
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Company</div>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              <Link to="/trust" className="hover:underline hover:text-foreground transition-colors">
                Trust
              </Link>
            </li>
            <li>
              <Link to="/docs" className="hover:underline hover:text-foreground transition-colors">
                Docs
              </Link>
            </li>
            <li>
              <Link
                to="/pricing"
                className="hover:underline hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
            </li>
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
