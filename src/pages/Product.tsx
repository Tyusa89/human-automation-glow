import React from "react";
import { Bot, Workflow, Database, Shield, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function ProductPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
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
    </div>
  );
}