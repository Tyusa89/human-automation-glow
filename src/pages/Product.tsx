import { Section, Feature } from "@/components/Sections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Workflow, Bot, Database, Shield, Check } from "lucide-react";

export default function ProductPage() {
  return (
    <Section title="Product" eyebrow="Overview">
      <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
        <div className="space-y-4">
          <div className="hover-scale">
            <Feature 
              icon={<Workflow className="h-5 w-5" />} 
              title="Visual Flow Designer" 
              copy="Snap together triggers, actions, conditions, and approvals. Reusable subflows keep things tidy." 
            />
          </div>
          <div className="hover-scale">
            <Feature 
              icon={<Bot className="h-5 w-5" />} 
              title="Agent Studio" 
              copy="Define goals, tools, retrieval sources, and evaluation. Preview chats and measure resolution." 
            />
          </div>
          <div className="hover-scale">
            <Feature 
              icon={<Database className="h-5 w-5" />} 
              title="Data Hub" 
              copy="Connect Supabase/Postgres, Notion, Sheets, or files. Control access with RLS and roles." 
            />
          </div>
          <div className="hover-scale">
            <Feature 
              icon={<Shield className="h-5 w-5" />} 
              title="Governance" 
              copy="Workspaces, roles, audit logs, redaction, prompt shields, rate limits, and keys vault." 
            />
          </div>
        </div>
        <Card className="border-dashed animate-scale-in">
          <CardHeader>
            <CardTitle>Micro‑tour</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <div className="flex items-center gap-2 transition-colors hover:text-foreground">
              <Check className="h-4 w-4 text-primary"/>
              Create a <b>Lead‑Qual Agent</b> from a template
            </div>
            <div className="flex items-center gap-2 transition-colors hover:text-foreground">
              <Check className="h-4 w-4 text-primary"/>
              Wire to <b>Sheets</b> and <b>HubSpot</b>
            </div>
            <div className="flex items-center gap-2 transition-colors hover:text-foreground">
              <Check className="h-4 w-4 text-primary"/>
              Add <b>scoring logic</b> and <b>booking</b>
            </div>
            <div className="flex items-center gap-2 transition-colors hover:text-foreground">
              <Check className="h-4 w-4 text-primary"/>
              Publish to <b>website widget</b> and track outcomes
            </div>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}