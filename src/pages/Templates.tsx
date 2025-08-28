import { Section, Feature } from "@/components/Sections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const templates = [
  { title: "Lead-Qual Agent", desc: "Captures site visitors, scores leads, syncs to CRM, and books meetings." },
  { title: "Support Triage", desc: "Resolves FAQs with AI, routes edge cases to human agents, logs in Helpdesk." },
  { title: "Onboarding Flow", desc: "Guided signup with form + agent combo; triggers workspace + welcome emails." },
  { title: "Data Enrichment", desc: "Research agent enriches prospects from domain, posts to spreadsheet/CRM." },
];

export default function TemplatesPage() {
  return (
    <Section title="Templates" eyebrow="Start fast">
      <div className="grid md:grid-cols-4 gap-4">
        {templates.map((t) => (
          <Card key={t.title} className="hover:shadow-md transition-shadow">
            <CardHeader><CardTitle className="text-base">{t.title}</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">{t.desc}</CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <Button>Browse all templates</Button>
      </div>
    </Section>
  );
}