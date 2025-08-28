import React from "react";
import { Check, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { brand } from "@/components/Brand";

// --- Helpers ---
const Section: React.FC<{ id: string; title: string; eyebrow?: string; children: React.ReactNode }>
  = ({ id, title, eyebrow, children }) => (
  <section id={id} className="scroll-mt-24 py-16 md:py-24">
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8">
        {eyebrow && (
          <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">{eyebrow}</div>
        )}
        <h2 className="text-2xl md:text-4xl font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  </section>
);

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-700 text-white px-3 py-1 text-xs">
    <Sparkles className="h-3.5 w-3.5" />
    {children}
  </span>
);

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