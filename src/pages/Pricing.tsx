import { Section } from "@/components/Sections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const pricing = [
  {
    name: "Starter",
    price: "$0",
    blurb: "For exploring and testing",
    features: [
      "1 workspace",
      "2 agents · 1,000 msgs/mo",
      "10 templates",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$39",
    blurb: "For solopreneurs & small teams", 
    features: [
      "Unlimited templates",
      "5 agents · 10k msgs/mo",
      "Integrations directory",
      "Email support",
    ],
  },
  {
    name: "Business",
    price: "Custom",
    blurb: "For scaling operations",
    features: [
      "SSO, Roles & RLS",
      "VPC / self‑host options",
      "Audit logs & SLA",
      "Dedicated success",
    ],
  },
];

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-700 text-white px-3 py-1 text-xs">
      <Sparkles className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

export default function PricingPage() {
  return (
    <Section title="Pricing" eyebrow="Simple & scalable">
      <div className="grid md:grid-cols-3 gap-6">
        {pricing.map(tier => (
          <Card key={tier.name} className="relative">
            <CardHeader>
              <div className="flex items-baseline justify-between">
                <CardTitle>{tier.name}</CardTitle>
                {tier.name === "Pro" && <Pill>Most popular</Pill>}
              </div>
              <div className="text-3xl font-semibold mt-2">
                {tier.price}<span className="text-base text-muted-foreground">/mo</span>
              </div>
              <div className="text-sm text-muted-foreground">{tier.blurb}</div>
            </CardHeader>
            <CardContent className="text-sm text-foreground space-y-2">
              {tier.features.map(f => (
                <div key={f} className="flex items-center gap-2"><Check className="h-4 w-4"/>{f}</div>
              ))}
              <div className="pt-3">
                <Button variant={tier.name === "Pro" ? "default" : "outline"}>Choose {tier.name}</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4">Alt model inspiration: per‑resolution billing for support agents (à la Intercom Fin).</p>
    </Section>
  );
}