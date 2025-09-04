import React from "react";
import { motion } from "framer-motion";
import { Bot, Workflow, Database, Puzzle, Globe, Shield, Zap, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Section, Feature, Pill, Badge, StudioTiles } from "@/components/common/ui";
import { brand } from "@/components/Brand";
import { templateCards, integrations } from "@/lib/site-data";

export default function Index() {
  console.log('Index component is rendering');
  return (
    <>
      <div>Hello World</div>

      <Section id="home" title="Build AI agents and automations — visually" eyebrow="Home">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-lg text-slate-600 leading-relaxed">
              EcoNest is your Zapier‑meets‑Intercom workspace: design automations, launch customer‑facing agents, and wire them to your data — all in one place.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button className={`${brand.primary.bg} ${brand.primary.bgHover}`}>Start free</Button>
              <Button variant="outline" className={`${brand.primary.border} ${brand.primary.tint} hover:bg-emerald-50`}>Book a demo</Button>
              <Pill>Visual Studio • Templates • Integrations</Pill>
            </div>
            <div className="mt-6 flex items-center gap-6 text-xs text-slate-500">
              <div>GDPR-ready</div><div>RLS/Row Security</div><div>Self‑host option</div>
            </div>
          </div>
          <StudioTiles
            items={[
              { icon: <Bot className="h-5 w-5" />, label: "Agent" },
              { icon: <Workflow className="h-5 w-5" />, label: "Flow" },
              { icon: <Database className="h-5 w-5" />, label: "Data" },
              { icon: <Puzzle className="h-5 w-5" />, label: "Integration" },
              { icon: <Globe className="h-5 w-5" />, label: "Channel" },
              { icon: <Shield className="h-5 w-5" />, label: "Policy" },
            ]}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-12">
          <Feature icon={<Workflow className="h-5 w-5" />} title="Automations" copy="Multi‑step workflows with triggers, branches, retries, and human‑in‑the‑loop steps." />
          <Feature icon={<Bot className="h-5 w-5" />} title="Agents" copy="LLM‑powered agents with tools, memory, and guardrails — deploy to web, chat, or voice." />
          <Feature icon={<Puzzle className="h-5 w-5" />} title="Integrations" copy="Directory + generic API/Webhook & DB connectors for anything custom." />
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
            <CardContent className="text-sm text-slate-600 space-y-3">
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
            <CardContent className="text-sm text-slate-600">Deflect FAQs, triage issues, and handoff with full context to agents in Zendesk/Intercom.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Marketing & Growth</CardTitle></CardHeader>
            <CardContent className="text-sm text-slate-600">Qualify leads, personalize pages, and route hot prospects to sales calendars.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Ops & RevOps</CardTitle></CardHeader>
            <CardContent className="text-sm text-slate-600">Automate back‑office: data syncs, enrichment, approvals, and reporting.</CardContent>
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
              <CardContent className="text-sm text-slate-600">{t.desc}</CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6">
          <Button className={`${brand.primary.bg} ${brand.primary.bgHover}`}>Browse all templates</Button>
        </div>
      </Section>

      {/* Integrations */}
      <Section id="integrations" title="Integrations" eyebrow="Connect everything">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {integrations.map((name) => (
            <div key={name} className="border rounded-xl bg-white p-3 text-sm flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-600"/> {name}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">Plus generic REST, Webhook, and DB connectors.</p>
      </Section>

      {/* Pricing */}
      <Section id="pricing" title="Pricing" eyebrow="Simple & scalable">
        <Card className="border-dashed">
          <CardHeader><CardTitle>Micro‑tour</CardTitle></CardHeader>
          <CardContent className="text-sm text-slate-600 space-y-3">
            <div className="flex items-center gap-2"><Check className="h-4 w-4"/>Create a <b>Lead‑Qual Agent</b> from a template</div>
            <div className="flex items-center gap-2"><Check className="h-4 w-4"/>Wire to <b>Sheets</b> and <b>HubSpot</b></div>
            <div className="flex items-center gap-2"><Check className="h-4 w-4"/>Add <b>scoring</b> & <b>booking</b></div>
            <div className="flex items-center gap-2"><Check className="h-4 w-4"/>Publish to <b>website widget</b> and track outcomes</div>
          </CardContent>
        </Card>
      </Section>

      {/* Docs */}
      <Section id="docs" title="Docs & Academy" eyebrow="Learn & build">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">Quickstart</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 space-y-2">
              <div>1. Create your first agent from a template</div>
              <div>2. Connect data & integrations</div>
              <div>3. Publish to widget or channel</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">How‑to Guides</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 space-y-2">
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
            <p className="text-slate-600 mt-2">Agents & automations for modern teams.</p>
          </div>
          <div>
            <div className="font-semibold mb-2">Product</div>
            <ul className="space-y-1 text-slate-600">
              <li><a href="#product" className="hover:underline">Overview</a></li>
              <li><a href="#templates" className="hover:underline">Templates</a></li>
              <li><a href="#integrations" className="hover:underline">Integrations</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Company</div>
            <ul className="space-y-1 text-slate-600">
              <li><a href="#trust" className="hover:underline">Trust</a></li>
              <li><a href="#docs" className="hover:underline">Docs</a></li>
              <li><a href="#pricing" className="hover:underline">Pricing</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Get started</div>
            <div className="flex gap-2">
              <Button className={`${brand.primary.bg} ${brand.primary.bgHover}`}>Start free</Button>
              <Button variant="outline">Book a demo</Button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}