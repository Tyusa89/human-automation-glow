import { Section } from "@/components/Sections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SolutionsPage() {
  return (
    <Section title="Solutions" eyebrow="By team & industry">
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
  );
}