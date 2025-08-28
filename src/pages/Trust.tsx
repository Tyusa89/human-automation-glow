import React from "react";
import { Shield, Database, Globe } from "lucide-react";
import { Section, Feature } from "@/components/Sections";

export default function Trust() {
  return (
    <Section id="trust" title="Trust & Security" eyebrow="Governance first">
      <div className="grid md:grid-cols-3 gap-4">
        <Feature 
          icon={<Shield className="h-5 w-5" />} 
          title="Compliance" 
          copy="SOC 2 Type II, GDPR, data residency options." 
        />
        <Feature 
          icon={<Database className="h-5 w-5" />} 
          title="Data Controls" 
          copy="Row‑Level Security, role‑based access, PII redaction, and secrets vault." 
        />
        <Feature 
          icon={<Globe className="h-5 w-5" />} 
          title="Deployment" 
          copy="Multi‑tenant cloud, VPC peering, or self‑hosted for maximum control." 
        />
      </div>
    </Section>
  );
}