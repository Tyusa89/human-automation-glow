import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Plug, 
  ChevronLeft, 
  ArrowRight,
  CheckCircle2,
  Webhook,
  Key,
  Zap,
  MessageSquare,
  Database,
  Mail,
  Calendar
} from "lucide-react";

const popularIntegrations = [
  { name: "Zapier", icon: Zap, category: "Automation" },
  { name: "Intercom", icon: MessageSquare, category: "Support" },
  { name: "Slack", icon: MessageSquare, category: "Communication" },
  { name: "PostgreSQL", icon: Database, category: "Database" },
  { name: "SendGrid", icon: Mail, category: "Email" },
  { name: "Google Calendar", icon: Calendar, category: "Scheduling" },
];

export default function IntegrationsGuide() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-50 via-background to-background border-b">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <Link 
            to="/docs" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Docs
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 text-purple-600">
              <Plug className="h-6 w-6" />
            </div>
            <div>
              <Badge variant="secondary" className="mb-2">Guide</Badge>
              <h1 className="text-3xl md:text-4xl font-bold">Integrations Guide</h1>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Connect EcoNest to your favorite tools, APIs, and services. Learn how to set up 
            integrations, manage credentials, and use webhooks.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Connecting Tools Section */}
          <section id="connecting" className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Connecting Tools</h2>
            <p className="text-muted-foreground mb-6">
              EcoNest supports 50+ integrations out of the box. Here's how to connect:
            </p>
            
            <div className="space-y-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <ol className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">1</span>
                      <div>
                        <p className="font-medium">Navigate to Integrations</p>
                        <p className="text-sm text-muted-foreground">Go to your dashboard and click on Integrations in the sidebar.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">2</span>
                      <div>
                        <p className="font-medium">Choose an Integration</p>
                        <p className="text-sm text-muted-foreground">Browse the catalog or search for a specific tool.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">3</span>
                      <div>
                        <p className="font-medium">Authorize the Connection</p>
                        <p className="text-sm text-muted-foreground">Follow the OAuth flow or enter your API credentials.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">4</span>
                      <div>
                        <p className="font-medium">Configure & Test</p>
                        <p className="text-sm text-muted-foreground">Map your data fields and run a test to verify the connection.</p>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>

            {/* Popular Integrations */}
            <h3 className="text-lg font-semibold mb-4">Popular Integrations</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {popularIntegrations.map((integration) => (
                <Card key={integration.name} className="hover:border-primary/30 transition-colors">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <integration.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{integration.name}</p>
                        <p className="text-xs text-muted-foreground">{integration.category}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Button asChild>
              <Link to="/integrations">
                View All Integrations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </section>

          {/* API & Webhooks Section */}
          <section id="api" className="mb-12">
            <h2 className="text-2xl font-bold mb-4">API & Webhooks</h2>
            <p className="text-muted-foreground mb-6">
              For custom integrations, use our REST API or set up webhooks to receive real-time events.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Key className="h-5 w-5" />
                    REST API
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>• Full CRUD operations on all resources</p>
                  <p>• API key authentication</p>
                  <p>• Rate limiting: 1000 requests/minute</p>
                  <p>• OpenAPI spec available</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Webhook className="h-5 w-5" />
                    Webhooks
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>• Real-time event notifications</p>
                  <p>• HMAC-SHA256 signature verification</p>
                  <p>• Automatic retries with exponential backoff</p>
                  <p>• Event filtering by type</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6 border-purple-200 bg-purple-50/50">
              <CardContent className="pt-6">
                <h4 className="font-medium text-purple-900 mb-2">Available Webhook Events</h4>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-purple-700">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    lead.created, lead.updated
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    workflow.started, workflow.completed
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    template.deployed, template.updated
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    integration.connected, integration.error
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* CTA */}
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-0">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4">Need Help?</h3>
              <p className="text-muted-foreground mb-4">
                Can't find the integration you need? Contact us and we'll help you set it up.
              </p>
              <Button variant="outline" asChild>
                <Link to="/contact">
                  Contact Support
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
