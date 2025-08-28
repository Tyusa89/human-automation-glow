import React from "react";
import { Check, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Section, Pill } from "@/components/common/ui";
import { pricing } from "@/lib/site-data";
import { brand } from "@/components/Brand";

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <Section id="pricing" title="Pricing" eyebrow="Simple & scalable">
        <div className="grid md:grid-cols-3 gap-6">
          {pricing.map((tier) => (
            <Card key={tier.name} className="relative">
              <CardHeader>
                <div className="flex items-baseline justify-between">
                  <CardTitle>{tier.name}</CardTitle>
                  {tier.name === "Pro" && <Pill>Most popular</Pill>}
                </div>
                <div className="text-3xl font-semibold mt-2">{tier.price}<span className="text-base text-slate-500">/mo</span></div>
                <div className="text-sm text-slate-500">{tier.blurb}</div>
              </CardHeader>
              <CardContent className="text-sm text-slate-700 space-y-2">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-center gap-2"><Check className="h-4 w-4"/>{f}</div>
                ))}
                <div className="pt-3">
                  <Button className={`${brand.primary.bg} ${brand.primary.bgHover}`}>Choose {tier.name}</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-4">Alt model inspiration: per‑resolution billing for support agents.</p>
      </Section>
    </div>
  );
}