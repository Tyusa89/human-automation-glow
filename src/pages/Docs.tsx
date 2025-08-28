import { Section } from "@/components/Sections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Workflow } from "lucide-react";

export default function DocsPage() {
  return (
    <Section title="Docs & Academy" eyebrow="Learn & build">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5"/>Quickstart</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <div>1. Create your first agent from a template</div>
            <div>2. Connect data & integrations</div>
            <div>3. Publish to widget or channel</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Workflow className="h-5 w-5"/>How‑to Guides</CardTitle></CardHeader>
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
  );
}