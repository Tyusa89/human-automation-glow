import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Workflow, Puzzle } from "lucide-react";
import { Section, Feature, Pill } from "@/components/Sections";
import StudioMock from "@/components/StudioMock";

export default function HomePage() {
  return (
    <>
      <Section id="home" title="Build AI agents and automations — visually" eyebrow="Home">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              EcoNest is your Zapier-meets-Intercom workspace: design automations, launch customer-facing agents,
              and wire them to your data — all in one place.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button>Start free</Button>
              <Button variant="outline">Book a demo</Button>
              <Pill>Visual Studio • Templates • Integrations</Pill>
            </div>
            <div className="mt-6 flex items-center gap-6 text-xs text-muted-foreground">
              <div>GDPR-ready</div>
              <div>RLS/Row Security</div>
              <div>Self-host option</div>
            </div>
          </div>
          <StudioMock />
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-12">
          <Feature icon={<Workflow className="h-5 w-5" />} title="Automations" copy="Multi-step workflows with triggers, branches, retries, and human-in-the-loop steps." />
          <Feature icon={<Bot className="h-5 w-5" />} title="Agents" copy="LLM-powered agents with tools, memory, and guardrails — deploy to web, chat, or voice." />
          <Feature icon={<Puzzle className="h-5 w-5" />} title="Integrations" copy="A growing directory plus generic API/Webhook + DB connectors for anything custom." />
        </div>
      </Section>

      <Section id="microtour" title="Micro-tour" eyebrow="See it in action">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>From template to published agent in minutes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <div>1. Create a <b>Lead-Qual Agent</b> from a template</div>
            <div>2. Wire to <b>Sheets</b> and <b>HubSpot</b></div>
            <div>3. Add <b>scoring logic</b> and <b>booking</b></div>
            <div>4. Publish to a <b>website widget</b> and track outcomes</div>
          </CardContent>
        </Card>
      </Section>
    </>
  );
}