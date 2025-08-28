import React from "react";
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

export default function TemplatesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
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
          <Button>Browse all templates</Button>
        </div>
      </Section>
    </div>
  );
}