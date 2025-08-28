import { Section } from "@/components/Sections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const templates = [
  { title: "Lead-Qual Agent", desc: "Capture, score, sync to CRM, and book meetings." },
  { title: "Support Triage", desc: "Resolve FAQs, route edge cases, log in Helpdesk." },
  { title: "Onboarding Flow", desc: "Guided signup with agent + form; trigger workspace." },
  { title: "Data Enrichment", desc: "Research agent enriches from domain; post to CRM." },
];

export default function TemplatesPage() {
  return (
    <Section title="Templates" eyebrow="Start fast">
      <div className="grid md:grid-cols-4 gap-4">
        {templates.map(t => (
          <Card key={t.title} className="hover:shadow-md transition-shadow">
            <CardHeader><CardTitle className="text-base">{t.title}</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">{t.desc}</CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}