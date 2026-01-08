import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const integrations = [
  {
    name: "Gmail",
    description: "Connect your Gmail account to send and receive emails",
    category: "Email"
  },
  {
    name: "Slack",
    description: "Integrate with Slack for team communication and notifications",
    category: "Communication"
  },
  {
    name: "Stripe",
    description: "Process payments and manage billing through Stripe",
    category: "Payments"
  },
  {
    name: "Supabase",
    description: "Connect to your Supabase database and authentication",
    category: "Database"
  },
  {
    name: "Google Drive",
    description: "Access and manage files stored in Google Drive",
    category: "Storage"
  },
  {
    name: "Twilio",
    description: "Send SMS messages and make voice calls through Twilio",
    category: "Communication"
  },
  {
    name: "GitHub",
    description: "Integrate with GitHub for code repository management",
    category: "Development"
  },
  {
    name: "Zendesk",
    description: "Connect customer support tickets and communications",
    category: "Support"
  }
];

export default function Integrations() {
  const handleIntegrationClick = (integrationName: string) => {
    // Placeholder for integration setup
    console.log(`Setting up ${integrationName} integration...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="container mx-auto px-6 py-16">
        {/* Back to Dashboard Link */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Integrations</h1>
          <p className="text-lg text-slate-400">
            Connect EcoNest to the tools you already use.
          </p>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <button
              key={integration.name}
              onClick={() => handleIntegrationClick(integration.name)}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 hover:border-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <div className="flex flex-col h-full">
                {/* Integration Name */}
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  {integration.name}
                </h3>
                
                {/* Category */}
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">
                  {integration.category}
                </div>
                
                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed flex-grow">
                  {integration.description}
                </p>
                
                {/* Connection Status */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <span className="text-xs text-slate-500">
                    Click to configure
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm">
            More integrations coming soon. Need a specific integration?{" "}
            <Link to="/contact" className="text-blue-400 hover:text-blue-300 transition-colors">
              Let us know
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}