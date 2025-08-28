import { Section, Feature } from "@/components/Sections";
import { Workflow, Bot, Database, Shield } from "lucide-react";

export default function ProductPage() {
  return (
    <Section title="Product" eyebrow="Overview">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Feature icon={<Workflow className="h-5 w-5" />} title="Visual Flow Designer" copy="Snap together triggers, actions, conditions, approvals. Reusable subflows."/>
          <Feature icon={<Bot className="h-5 w-5" />} title="Agent Studio" copy="Define goals, tools, retrieval, evaluation. Preview chats & measure resolution."/>
          <Feature icon={<Database className="h-5 w-5" />} title="Data Hub" copy="Connect Supabase/Postgres, Notion, Sheets, or files. Control access with RLS."/>
          <Feature icon={<Shield className="h-5 w-5" />} title="Governance" copy="Roles, audit logs, redaction, prompt shields, rate limits, secrets vault."/>
        </div>
      </div>
    </Section>
  );
}