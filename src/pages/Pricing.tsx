import { Section } from "@/components/Sections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const pricing = [
  { name: "Starter", price: "$0", blurb: "Explore & test", features: ["1 workspace","2 agents · 1k msgs/mo","10 templates","Community support"] },
  { name: "Pro", price: "$39", blurb: "Solo & small teams", features: ["Unlimited templates","5 agents · 10k msgs/mo","Integrations directory","Email support"] },
  { name: "Business", price: "Custom", blurb: "Scale ops", features: ["SSO, Roles & RLS","VPC / self-host","Audit logs & SLA","Dedicated success"] },
];

export default function PricingPage() {
  return (
    <Section title="Pricing" eyebrow="Simple & scalable">
      <div className="grid md:grid-cols-3 gap-6">
        {pricing.map(tier => (
          <Card key={tier.name} className="relative">
            <CardHeader>
              <div className="flex items-baseline justify-between">
                <CardTitle>{tier.name}</CardTitle>
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
                <Button>Choose {tier.name}</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4">Alt billing idea: per-resolution for support (Fin-style).</p>
    </Section>
  );
}