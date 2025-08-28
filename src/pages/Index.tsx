import React from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Workflow,
  Shield,
  Database,
  Puzzle,
  Globe,
  Link as LinkIcon,
  BookOpen,
  DollarSign,
  Sparkles,
  Zap,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomerServiceWidget from "@/components/CustomerServiceWidget";

// --- Helpers ---
const Section: React.FC<{ id: string; title: string; eyebrow?: string; children: React.ReactNode }>
  = ({ id, title, eyebrow, children }) => (
  <section id={id} className="scroll-mt-24 py-16 md:py-24">
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8">
        {eyebrow && (
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{eyebrow}</div>
        )}
        <h2 className="text-2xl md:text-4xl font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  </section>
);

const Feature: React.FC<{ icon: React.ReactNode; title: string; copy: string }>
  = ({ icon, title, copy }) => (
  <div className="flex gap-4 p-4 rounded-2xl border bg-card shadow-sm">
    <div className="shrink-0 p-2 rounded-xl bg-muted border">{icon}</div>
    <div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{copy}</p>
    </div>
  </div>
);

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-full border bg-card px-2.5 py-1 text-xs text-muted-foreground">{children}</span>
);

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs">
    <Sparkles className="h-3.5 w-3.5" />
    {children}
  </span>
);

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
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-card border rounded-2xl shadow-sm p-4"
          >
            <div className="text-sm text-muted-foreground mb-2">Visual Automation Studio</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Bot className="h-5 w-5" />, label: "Agent" },
                { icon: <Workflow className="h-5 w-5" />, label: "Flow" },
                { icon: <Database className="h-5 w-5" />, label: "Data" },
                { icon: <Puzzle className="h-5 w-5" />, label: "Integration" },
                { icon: <Globe className="h-5 w-5" />, label: "Channel" },
                { icon: <Shield className="h-5 w-5" />, label: "Policy" },
              ].map((n, i) => (
                <div key={i} className="border rounded-xl p-3 bg-muted">
                  <div className="flex items-center gap-2 text-foreground">
                    {n.icon}
                    <span className="text-xs">{n.label}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" /> Drag, connect, and publish without code
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-12">
          <Feature icon={<Workflow className="h-5 w-5" />} title="Automations" copy="Multi‑step workflows with triggers, branches, retries, and human‑in‑the‑loop steps." />
          <Feature icon={<Bot className="h-5 w-5" />} title="Agents" copy="LLM‑powered agents with tools, memory, and guardrails — deploy to web, chat, or voice." />
          <Feature icon={<Puzzle className="h-5 w-5" />} title="Integrations" copy="A growing directory plus generic API/Webhook + DB connectors for anything custom." />
        </div>
      </Section>

      {/* Product */}
      <Section id="product" title="Product" eyebrow="Overview">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Feature icon={<Workflow className="h-5 w-5" />} title="Visual Flow Designer" copy="Snap together triggers, actions, conditions, and approvals. Reusable subflows keep things tidy." />
            <Feature icon={<Bot className="h-5 w-5" />} title="Agent Studio" copy="Define goals, tools, retrieval sources, and evaluation. Preview chats and measure resolution." />
            <Feature icon={<Database className="h-5 w-5" />} title="Data Hub" copy="Connect Supabase/Postgres, Notion, Sheets, or files. Control access with RLS and roles." />
            <Feature icon={<Shield className="h-5 w-5" />} title="Governance" copy="Workspaces, roles, audit logs, redaction, prompt shields, rate limits, and keys vault." />
          </div>
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Micro‑tour</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <div className="flex items-center gap-2"><Check className="h-4 w-4"/>Create a <b>Lead‑Qual Agent</b> from a template</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4"/>Wire to <b>Sheets</b> and <b>HubSpot</b></div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4"/>Add <b>scoring logic</b> and <b>booking</b></div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4"/>Publish to <b>website widget</b> and track outcomes</div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Solutions */}
      <Section id="solutions" title="Solutions" eyebrow="By team & industry">
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle>Support</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">Deflect FAQs, triage issues, and handoff with full context to agents in Zendesk/Intercom.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Marketing & Growth</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">Qualify leads, personalize pages, and route hot prospects to sales calendars.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Ops & RevOps</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">Automate back‑office: data syncs, enrichment, approvals, and reporting.</CardContent>
          </Card>
        </div>
      </Section>

      {/* Templates */}
      <Section id="templates" title="Templates" eyebrow="Start fast">
        <div className="grid md:grid-cols-4 gap-4">
          {templateCards.map((t) => (
            <Card key={t.title} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-base">{t.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{t.desc}</CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6">
          <Button>Browse all templates</Button>
        </div>
      </Section>

      {/* Integrations */}
      <Section id="integrations" title="Integrations" eyebrow="Connect everything">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {integrations.map((name) => (
            <div key={name} className="border rounded-xl bg-card p-3 text-sm flex items-center gap-2">
              <LinkIcon className="h-4 w-4" /> {name}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">Plus generic REST, Webhook, and DB connectors.</p>
      </Section>

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

      {/* Docs */}
      <Section id="docs" title="Docs & Academy" eyebrow="Learn & build">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5"/>Quickstart</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <div>1. Create your first agent from a template</div>
              <div>2. Connect data & integrations</div>
              <div>3. Publish to widget or channel</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Workflow className="h-5 w-5"/>How‑to Guides</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <div>• Build a lead‑qualifying concierge</div>
              <div>• Triage & deflection for support</div>
              <div>• Human‑in‑the‑loop approvals</div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6">
          <Button variant="outline">Open Docs</Button>
          <Button className="ml-2">Watch a 3‑min demo</Button>
        </div>
      </Section>

      {/* Trust */}
      <Section id="trust" title="Trust & Security" eyebrow="Governance first">
        <div className="grid md:grid-cols-3 gap-4">
          <Feature icon={<Shield className="h-5 w-5" />} title="Compliance" copy="SOC 2 Type II, GDPR, data residency options." />
          <Feature icon={<Database className="h-5 w-5" />} title="Data Controls" copy="Row‑Level Security, role‑based access, PII redaction, and secrets vault." />
          <Feature icon={<Globe className="h-5 w-5" />} title="Deployment" copy="Multi‑tenant cloud, VPC peering, or self‑hosted for maximum control." />
        </div>
      </Section>

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
