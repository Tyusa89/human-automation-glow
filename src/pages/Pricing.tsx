import { Section, Pill } from "@/components/Sections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { pricing } from "@/lib/data";

export default function PricingPage() {
  return (
    <Section title="Pricing" eyebrow="Simple & scalable">
      <div className="grid md:grid-cols-3 gap-6">
        {pricing.map((tier, index) => (
          <Card 
            key={tier.name} 
            className={`relative hover-scale transition-all duration-300 animate-fade-in ${tier.name === "Pro" ? "ring-2 ring-primary shadow-lg" : ""}`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
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
                <div key={f} className="flex items-center gap-2 transition-colors hover:text-primary">
                  <Check className="h-4 w-4 text-primary"/>{f}
                </div>
              ))}
              <div className="pt-3">
                <Button 
                  variant={tier.name === "Pro" ? "default" : "outline"}
                  className="hover-scale w-full"
                >
                  Choose {tier.name}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4">Alt model inspiration: per‑resolution billing for support agents (à la Intercom Fin).</p>
    </Section>
  );
}