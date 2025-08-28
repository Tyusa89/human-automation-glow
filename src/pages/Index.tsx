import React from "react";
import { Bot, Workflow, Check, Puzzle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section, Feature, Pill } from "@/components/Sections";
import { StudioMock } from "@/components/StudioMock";
import Product from "./Product";
import Solutions from "./Solutions";
import Templates from "./Templates";
import Integrations from "./Integrations";
import Docs from "./Docs";
import Trust from "./Trust";
import CustomerServiceWidget from "@/components/CustomerServiceWidget";

// --- Content data ---
const templateCards = [
  {
    title: "Lead‑Qual Agent",
    desc: "Captures site visitors, scores leads, syncs to CRM, and books meetings.",
  },
  {
    title: "Support Triage",
    desc: "Resolves FAQs with AI, routes edge cases to human agents, logs in Helpdesk.",
  },
  {
    title: "Onboarding Flow",
    desc: "Guided signup with form + agent combo; triggers workspace + welcome emails.",
  },
  {
    title: "Data Enrichment",
    desc: "Research agent enriches prospects from domain, posts to spreadsheet/CRM.",
  },
];

const integrations = [
  "Slack",
  "Gmail",
  "Google Sheets",
  "HubSpot",
  "Salesforce",
  "Zendesk",
  "Twilio",
  "Notion",
  "Postgres",
  "Webhook",
];

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

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 via-background to-background text-foreground">

      {/* Hero / Home */}
      <Section id="home" title="Build AI agents and automations — visually" eyebrow="Home">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              EcoNest is your Zapier‑meets‑Intercom workspace: design automations, launch customer‑facing agents, and wire them to your data — all in one place.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button className="">Start free</Button>
              <Button variant="outline">Book a demo</Button>
              <Pill>Visual Studio • Templates • Integrations</Pill>
            </div>
            <div className="mt-6 flex items-center gap-6 text-xs text-muted-foreground">
              <div>GDPR-ready</div>
              <div>RLS/Row Security</div>
              <div>Self‑host option</div>
            </div>
          </div>
          <StudioMock />
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-12">
          <Feature icon={<Workflow className="h-5 w-5" />} title="Automations" copy="Multi‑step workflows with triggers, branches, retries, and human‑in‑the‑loop steps." />
          <Feature icon={<Bot className="h-5 w-5" />} title="Agents" copy="LLM‑powered agents with tools, memory, and guardrails — deploy to web, chat, or voice." />
          <Feature icon={<Puzzle className="h-5 w-5" />} title="Integrations" copy="A growing directory plus generic API/Webhook + DB connectors for anything custom." />
        </div>
      </Section>

      <Product />
      <Solutions />
      <Templates />
      <Integrations />

      {/* Pricing */}
      <Section id="pricing" title="Pricing" eyebrow="Simple & scalable">
        <div className="grid md:grid-cols-3 gap-6">
          {pricing.map((tier) => (
            <Card key={tier.name} className="relative">
              <CardHeader>
                <div className="flex items-baseline justify-between">
                  <CardTitle>{tier.name}</CardTitle>
                  {tier.name === "Pro" && <Pill>Most popular</Pill>}
                </div>
                <div className="text-3xl font-semibold mt-2">{tier.price}<span className="text-base text-muted-foreground">/mo</span></div>
                <div className="text-sm text-muted-foreground">{tier.blurb}</div>
              </CardHeader>
              <CardContent className="text-sm text-foreground space-y-2">
                {tier.features.map((f) => (
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

      <Docs />
      <Trust />

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="font-semibold">EcoNest</div>
            <p className="text-muted-foreground mt-2">Agents & automations for modern teams.</p>
          </div>
          <div>
            <div className="font-semibold mb-2">Product</div>
            <ul className="space-y-1 text-muted-foreground">
              <li><a href="#product" className="hover:underline">Overview</a></li>
              <li><a href="#templates" className="hover:underline">Templates</a></li>
              <li><a href="#integrations" className="hover:underline">Integrations</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Company</div>
            <ul className="space-y-1 text-muted-foreground">
              <li><a href="#trust" className="hover:underline">Trust</a></li>
              <li><a href="#docs" className="hover:underline">Docs</a></li>
              <li><a href="#pricing" className="hover:underline">Pricing</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Get started</div>
            <div className="flex gap-2">
              <Button>Start free</Button>
              <Button variant="outline">Book a demo</Button>
            </div>
          </div>
        </div>
      </footer>

      <CustomerServiceWidget />
    </div>
  );
};

export default Index;
