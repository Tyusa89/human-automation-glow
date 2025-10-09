import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface IntegrationModalProps {
  name: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const integrationDetails: Record<string, {
  description: string;
  features: string[];
  docs?: string;
}> = {
  "Slack": {
    description: "Connect your workflows to Slack for real-time notifications and team collaboration.",
    features: ["Send notifications to channels", "Direct messages", "Interactive buttons", "File sharing"],
    docs: "https://api.slack.com/docs"
  },
  "Gmail": {
    description: "Automate email workflows and communications through Gmail integration.",
    features: ["Send automated emails", "Read inbox", "Manage labels", "Email templates"],
    docs: "https://developers.google.com/gmail/api"
  },
  "Google Sheets": {
    description: "Sync data bidirectionally with Google Sheets for easy data management.",
    features: ["Read/write data", "Create new sheets", "Append rows", "Real-time sync"],
    docs: "https://developers.google.com/sheets/api"
  },
  "HubSpot": {
    description: "Integrate with HubSpot CRM to manage contacts, deals, and marketing automation.",
    features: ["Sync contacts", "Create deals", "Track interactions", "Marketing automation"],
    docs: "https://developers.hubspot.com/docs/api/overview"
  },
  "Salesforce": {
    description: "Connect to Salesforce for enterprise-grade CRM integration.",
    features: ["Manage leads & opportunities", "Custom objects", "Reports & dashboards", "Workflow automation"],
    docs: "https://developer.salesforce.com/docs"
  },
  "Zendesk": {
    description: "Integrate customer support workflows with Zendesk.",
    features: ["Create tickets", "Update status", "Add comments", "Customer insights"],
    docs: "https://developer.zendesk.com/api-reference"
  },
  "Twilio": {
    description: "Add SMS, voice, and WhatsApp capabilities to your workflows.",
    features: ["Send SMS", "Voice calls", "WhatsApp messaging", "Phone verification"],
    docs: "https://www.twilio.com/docs"
  },
  "Notion": {
    description: "Sync tasks, documents, and databases with Notion.",
    features: ["Create pages", "Update databases", "Task management", "Documentation sync"],
    docs: "https://developers.notion.com"
  },
  "Postgres": {
    description: "Direct database integration for custom data operations.",
    features: ["Query data", "Insert records", "Update operations", "Transaction support"],
    docs: "https://www.postgresql.org/docs"
  },
  "Webhook": {
    description: "Send HTTP requests to any webhook endpoint for custom integrations.",
    features: ["POST/GET requests", "Custom headers", "Authentication", "Error handling"],
    docs: "https://docs.lovable.dev/integrations/webhook"
  }
};

export function IntegrationModal({ name, open, onOpenChange }: IntegrationModalProps) {
  const details = integrationDetails[name] || {
    description: `Connect your workflows with ${name} integration.`,
    features: ["Seamless integration", "Real-time sync", "Secure connection"],
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{name} Integration</DialogTitle>
          <DialogDescription className="text-base pt-2">
            {details.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <h4 className="font-semibold mb-3 text-sm">Key Features</h4>
            <ul className="space-y-2">
              {details.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2 pt-2">
            <Button className="flex-1" onClick={() => onOpenChange(false)}>
              Connect {name}
            </Button>
            {details.docs && (
              <Button variant="outline" asChild>
                <a href={details.docs} target="_blank" rel="noopener noreferrer">
                  View Docs
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
