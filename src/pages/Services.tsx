import React from "react";
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

export default function ServicesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <Section id="solutions" title="Services & Solutions" eyebrow="By team & industry">
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle>Support Automation</CardTitle></CardHeader>
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
        <div className="mt-6">
          <Button className={`${brand.primary.bg} ${brand.primary.bgHover}`}>Book a consultation</Button>
        </div>
      </Section>
    </div>
  );
}