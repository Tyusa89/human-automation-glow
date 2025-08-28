import React from "react";
import { motion } from "framer-motion";
import { Bot, Workflow, Database, Puzzle, Globe, Shield, Zap, Check } from "lucide-react";
import { Section, Feature, Badge, Pill } from "@/components/Sections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <>

      <Section title="Build AI agents and automations — visually" eyebrow="Home">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              EcoNest is your Zapier‑meets‑Intercom workspace: design automations, launch customer‑facing agents, and wire them to your data — all in one place.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Start free</Button>
              <Button variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50">Book a demo</Button>
              <Pill>Visual Studio • Templates • Integrations</Pill>
            </div>
            <div className="mt-6 flex items-center gap-6 text-xs text-muted-foreground">
              <div>GDPR-ready</div>
              <div>RLS/Row Security</div>
              <div>Self‑host option</div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-card border rounded-2xl shadow-sm p-4"
          >
            <div className="text-sm text-muted-foreground mb-2">Visual Automation Studio</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Bot className="h-5 w-5" />, label: "Agent" },
                { icon: <Workflow className="h-5 w-5" />, label: "Flow" },
                { icon: <Database className="h-5 w-5" />, label: "Data" },
                { icon: <Puzzle className="h-5 w-5" />, label: "Integration" },
                { icon: <Globe className="h-5 w-5" />, label: "Channel" },
                { icon: <Shield className="h-5 w-5" />, label: "Policy" },
              ].map((n, i) => (
                <div key={i} className="border rounded-xl p-3 bg-muted">
                  <div className="flex items-center gap-2 text-foreground">
                    {n.icon}
                    <span className="text-xs">{n.label}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" /> Drag, connect, and publish without code
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-12">
          <Feature icon={<Workflow className="h-5 w-5" />} title="Automations" copy="Multi‑step workflows with triggers, branches, retries, and human‑in‑the‑loop steps." />
          <Feature icon={<Bot className="h-5 w-5" />} title="Agents" copy="LLM‑powered agents with tools, memory, and guardrails — deploy to web, chat, or voice." />
          <Feature icon={<Puzzle className="h-5 w-5" />} title="Integrations" copy="A growing directory plus generic API/Webhook + DB connectors for anything custom." />
        </div>
      </Section>

      <Section title="Micro-tour" eyebrow="See it in action">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>From template to published agent in minutes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <div className="flex items-center gap-2"><Check className="h-4 w-4"/>Create a <b>Lead‑Qual Agent</b> from a template</div>
            <div className="flex items-center gap-2"><Check className="h-4 w-4"/>Wire to <b>Sheets</b> and <b>HubSpot</b></div>
            <div className="flex items-center gap-2"><Check className="h-4 w-4"/>Add <b>scoring logic</b> and <b>booking</b></div>
            <div className="flex items-center gap-2"><Check className="h-4 w-4"/>Publish to <b>website widget</b> and track outcomes</div>
          </CardContent>
        </Card>
      </Section>
    </>
  );
}