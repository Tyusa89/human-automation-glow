import { Section } from "@/components/Sections";
import { Link as LinkIcon } from "lucide-react";

const integrations = ["Slack","Gmail","Google Sheets","HubSpot","Salesforce","Zendesk","Twilio","Notion","Postgres","Webhook"];

export default function IntegrationsPage() {
  return (
    <Section title="Integrations" eyebrow="Connect everything">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {integrations.map(name => (
          <div key={name} className="border rounded-xl bg-card p-3 text-sm flex items-center gap-2">
            <LinkIcon className="h-4 w-4" /> {name}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-3">Plus generic REST, Webhook, and DB connectors.</p>
    </Section>
  );
}