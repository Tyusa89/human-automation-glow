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

const Feature: React.FC<{ icon: React.ReactNode; title: string; copy: string }>
  = ({ icon, title, copy }) => (
  <div className="flex gap-4 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="shrink-0 p-2 rounded-xl bg-slate-50 border border-slate-200">{icon}</div>
    <div>
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{copy}</p>
    </div>
  </div>
);

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">{children}</span>
);

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-700 text-white px-3 py-1 text-xs">
    <Sparkles className="h-3.5 w-3.5" />
    {children}
  </span>
);

/** --- Brand (Logo & Colors) --- **/
const brand = {
  name: "EcoNest",
  // Put your logo file in /public as logo-econest.svg, or update this path to your PNG/SVG
  logoUrl: "/logo-econest.svg",
  primary: {
    bg: "bg-emerald-600",
    bgHover: "hover:bg-emerald-700",
    tint: "text-emerald-700",
    border: "border-emerald-600",
    soft: "bg-emerald-50",
    solid: "bg-emerald-700",
  },
};

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

// --- Main Component ---
export default function EcoNestWireframe() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white text-slate-900">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-700 text-white grid place-items-center font-bold overflow-hidden">
              <img src={brand.logoUrl} alt={brand.name} className="h-8 w-8 object-contain" />
            </div>
            <div className="font-semibold">{brand.name}</div>
            <div className="hidden md:flex items-center gap-2 ml-3">
              <Badge>Beta</Badge>
              <Badge>Zapier × Intercom vibe</Badge>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#product" className="hover:text-slate-600">Product</a>
            <a href="#solutions" className="hover:text-slate-600">Solutions</a>
            <a href="#templates" className="hover:text-slate-600">Templates</a>
            <a href="#integrations" className="hover:text-slate-600">Integrations</a>
            <a href="#pricing" className="hover:text-slate-600">Pricing</a>
            <a href="#docs" className="hover:text-slate-600">Docs</a>
            <a href="#trust" className="hover:text-slate-600">Security</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="hidden md:inline-flex">Sign in</Button>
            <Button className={`${brand.primary.bg} ${brand.primary.bgHover}`}>Start free</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <Section id="home" title="Build AI agents and automations — visually" eyebrow="Home">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-lg text-slate-600 leading-relaxed">
              EcoNest is your Zapier‑meets‑Intercom workspace: design automations, launch customer‑facing agents, and wire them to your data — all in one place.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button className={`${brand.primary.bg} ${brand.primary.bgHover}`}>Start free</Button>
              <Button variant="outline" className={`${brand.primary.border} ${brand.primary.tint} hover:${brand.primary.soft}`}>Book a demo</Button>
              <Pill>Visual Studio • Templates • Integrations</Pill>
            </div>
            <div className="mt-6 flex items-center gap-6 text-xs text-slate-500">
              <div>GDPR-ready</div>
              <div>RLS/Row Security</div>
              <div>Self‑host option</div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white border rounded-2xl shadow-sm p-4"
          >
            <div className="text-sm text-slate-500 mb-2">Visual Automation Studio</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Bot className="h-5 w-5" />, label: "Agent" },
                { icon: <Workflow className="h-5 w-5" />, label: "Flow" },
                { icon: <Database className="h-5 w-5" />, label: "Data" },
                { icon: <Puzzle className="h-5 w-5" />, label: "Integration" },
                { icon: <Globe className="h-5 w-5" />, label: "Channel" },
                { icon: <Shield className="h-5 w-5" />, label: "Policy" },
              ].map((n, i) => (
                <div key={i} className="border rounded-xl p-3 bg-slate-50">
                  <div className="flex items-center gap-2 text-slate-900">
                    {n.icon}
                    <span className="text-xs">{n.label}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-slate-500 flex items-center gap-2">
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

      {/* Templates */}
      <Section id="templates" title="Start with a template" eyebrow="Templates">
        <div className="grid md:grid-cols-2 gap-4">
          {templateCards.map((t, i) => (
            <Card key={i} className="border-dashed">
              <CardHeader>
                <CardTitle className="text-lg">{t.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm leading-relaxed">{t.desc}</p>
                <Button variant="outline" className="mt-3" size="sm">Use template</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Integrations */}
      <Section id="integrations" title="Connect to everything" eyebrow="Integrations">
        <div className="flex flex-wrap gap-3">
          {integrations.map((name, i) => (
            <Badge key={i}>{name}</Badge>
          ))}
        </div>
        <p className="text-slate-600 mt-4">
          Plus generic API/Webhook connectors, database connections, and custom actions.
        </p>
      </Section>

      {/* Pricing */}
      <Section id="pricing" title="Simple, transparent pricing" eyebrow="Pricing">
        <div className="grid md:grid-cols-3 gap-6">
          {pricing.map((plan, i) => (
            <Card key={i} className={i === 1 ? `border-emerald-200 ${brand.primary.soft}` : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  {i === 1 && <Badge>Most popular</Badge>}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-slate-500">/month</span>}
                </div>
                <p className="text-slate-600 text-sm">{plan.blurb}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, fi) => (
                    <li key={fi} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full mt-4 ${i === 1 ? `${brand.primary.bg} ${brand.primary.bgHover}` : ""}`}
                  variant={i === 1 ? "default" : "outline"}
                >
                  {plan.price === "Custom" ? "Contact sales" : "Get started"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Security */}
      <Section id="trust" title="Enterprise-ready security" eyebrow="Trust & Security">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Feature icon={<Shield className="h-5 w-5" />} title="SOC 2 Type II" copy="Comprehensive security controls and annual audits." />
            <Feature icon={<Database className="h-5 w-5" />} title="Data Residency" copy="Choose where your data lives: US, EU, or self-hosted." />
          </div>
          <div>
            <Feature icon={<LinkIcon className="h-5 w-5" />} title="SSO & RBAC" copy="Single sign-on with role-based access controls." />
            <Feature icon={<BookOpen className="h-5 w-5" />} title="Audit Logs" copy="Complete visibility into who did what, when." />
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t bg-slate-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-xl bg-emerald-700 text-white grid place-items-center font-bold overflow-hidden">
                  <img src={brand.logoUrl} alt={brand.name} className="h-8 w-8 object-contain" />
                </div>
                <div className="font-semibold">{brand.name}</div>
              </div>
              <p className="text-slate-600 text-sm">
                Agents & automations for modern teams
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-slate-900">Overview</a></li>
                <li><a href="#templates" className="hover:text-slate-900">Templates</a></li>
                <li><a href="#integrations" className="hover:text-slate-900">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#trust" className="hover:text-slate-900">Trust</a></li>
                <li><a href="#docs" className="hover:text-slate-900">Docs</a></li>
                <li><a href="#pricing" className="hover:text-slate-900">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Get Started</h4>
              <div className="space-y-2">
                <Button className={`w-full ${brand.primary.bg} ${brand.primary.bgHover}`}>Start free</Button>
                <Button variant="outline" className="w-full">Book a demo</Button>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-slate-500">
            <p>&copy; 2024 {brand.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}