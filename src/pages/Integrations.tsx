import { Section } from "@/components/Sections";
import { Link as LinkIcon } from "lucide-react";
import { integrations } from "@/lib/data";
import { IntegrationModal } from "@/components/IntegrationModal";
import { useState } from "react";

export default function IntegrationsPage() {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

  return (
    <Section title="Integrations" eyebrow="Connect everything">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {integrations.map((name, index) => (
          <button
            key={name}
            onClick={() => setSelectedIntegration(name)}
            className="border rounded-xl bg-card p-3 text-sm flex items-center gap-2 hover-scale transition-all duration-200 animate-fade-in hover:shadow-md cursor-pointer text-left w-full"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <LinkIcon className="h-4 w-4 text-primary" /> {name}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-3">Plus generic REST, Webhook, and DB connectors.</p>

      <IntegrationModal
        name={selectedIntegration || ""}
        open={!!selectedIntegration}
        onOpenChange={(open) => !open && setSelectedIntegration(null)}
      />
    </Section>
  );
}