import React from "react";
import { Workflow, Bot, Database, Shield, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section, Feature } from "@/components/Sections";

export default function Product() {
  return (
    <Section id="product" title="Product" eyebrow="Overview">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Feature 
            icon={<Workflow className="h-5 w-5" />} 
            title="Visual Flow Designer" 
            copy="Snap together triggers, actions, conditions, and approvals. Reusable subflows keep things tidy." 
          />
          <Feature 
            icon={<Bot className="h-5 w-5" />} 
            title="Agent Studio" 
            copy="Define goals, tools, retrieval sources, and evaluation. Preview chats and measure resolution." 
          />
          <Feature 
            icon={<Database className="h-5 w-5" />} 
            title="Data Hub" 
            copy="Connect Supabase/Postgres, Notion, Sheets, or files. Control access with RLS and roles." 
          />
          <Feature 
            icon={<Shield className="h-5 w-5" />} 
            title="Governance" 
            copy="Workspaces, roles, audit logs, redaction, prompt shields, rate limits, and keys vault." 
          />
        </div>
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Micro‑tour</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4"/>
              Create a <b>Lead‑Qual Agent</b> from a template
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4"/>
              Wire to <b>Sheets</b> and <b>HubSpot</b>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4"/>
              Add <b>scoring logic</b> and <b>booking</b>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4"/>
              Publish to <b>website widget</b> and track outcomes
            </div>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}