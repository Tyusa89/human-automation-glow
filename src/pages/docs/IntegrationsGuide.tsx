import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  Search,
  Shield,
  LogIn,
  AlertTriangle,
  TestTube,
  HelpCircle,
  Settings,
  BarChart3,
  Users,
  Globe,
  Code,
  FileText
} from "lucide-react";

const tocItems = [
  { id: "basics", label: "Integration Basics" },
  { id: "methods", label: "Connection Methods" },
  { id: "directory", label: "Supported Integrations" },
  { id: "checklist", label: "Setup Checklist" },
  { id: "security", label: "Security & Permissions" },
  { id: "testing", label: "Testing & Validation" },
  { id: "issues", label: "Common Issues" },
  { id: "faq", label: "FAQ" },
];

const categories = ["All", "CRM", "Support", "Marketing", "Automation", "Data", "Dev", "Webhooks"];

const integrations = [
  { name: "HubSpot", icon: Users, category: "CRM", status: "available" },
  { name: "Salesforce", icon: BarChart3, category: "CRM", status: "available" },
  { name: "Intercom", icon: MessageSquare, category: "Support", status: "available" },
  { name: "Zendesk", icon: MessageSquare, category: "Support", status: "available" },
  { name: "Mailchimp", icon: Mail, category: "Marketing", status: "available" },
  { name: "Meta Ads", icon: Globe, category: "Marketing", status: "beta" },
  { name: "Zapier", icon: Zap, category: "Automation", status: "available" },
  { name: "Make", icon: Settings, category: "Automation", status: "available" },
  { name: "Google Sheets", icon: FileText, category: "Data", status: "available" },
  { name: "PostgreSQL", icon: Database, category: "Data", status: "available" },
  { name: "GitHub", icon: Code, category: "Dev", status: "available" },
  { name: "Slack", icon: MessageSquare, category: "Dev", status: "available" },
  { name: "Custom Webhook", icon: Webhook, category: "Webhooks", status: "available" },
  { name: "N8N", icon: Zap, category: "Automation", status: "coming" },
];

const commonIssues = [
  {
    question: "My integration connected but nothing runs",
    answer: "Check that you've enabled the integration in your workflow or template. Connections must be explicitly activated in workflows to trigger actions. Also verify that the trigger events are configured correctly."
  },
  {
    question: "OAuth connected but data is missing",
    answer: "This usually indicates insufficient scopes. Reconnect the integration and ensure you grant all requested permissions. Some data may require additional scopes that weren't selected during initial authorization."
  },
  {
    question: "Webhook is firing but EcoNest shows nothing",
    answer: "Verify your webhook URL is correct and the endpoint is accessible. Check that the webhook signature is being validated correctly. Review the webhook logs in your dashboard for any parsing errors."
  },
  {
    question: "My API key keeps failing",
    answer: "API keys may expire or be revoked. Generate a new key from the source service and update it in EcoNest. Also check that the key has the required permissions for the operations you're attempting."
  },
  {
    question: "Why am I getting 401/403 errors?",
    answer: "401 means authentication failed (invalid or expired credentials). 403 means the credentials are valid but lack permission for the requested action. Re-authenticate or request additional scopes."
  },
  {
    question: "Where do I see logs?",
    answer: "Go to your Dashboard → Integrations → select the integration → View Logs. You can filter by date, status, and event type to find specific issues."
  },
];

const faqItems = [
  {
    question: "Can I connect multiple accounts to the same integration?",
    answer: "Yes, you can connect multiple accounts. Each connection is treated separately and can be used in different workflows. Go to Integrations → Add Connection to add additional accounts."
  },
  {
    question: "Can I disable an integration without breaking workflows?",
    answer: "Disabling an integration will pause all workflows using it. The workflows won't fail permanently — they'll queue actions and retry when the integration is re-enabled, or you can configure fallback behavior."
  },
  {
    question: "Who can edit integrations?",
    answer: "By default, Admins and Owners can create and edit integrations. Owners can configure which roles have integration management permissions in Settings → Roles & Permissions."
  },
  {
    question: "Do integrations affect billing?",
    answer: "Basic integrations are included in all plans. Premium integrations (enterprise CRMs, custom webhooks with high volume) may count toward your usage limits. Check your plan details for specifics."
  },
];

export default function IntegrationsGuide() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Link 
            to="/docs" 
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Docs
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Plug className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Integrations</h1>
            </div>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl mb-8">
            Connect EcoNest to the tools you already use — securely and reliably.
          </p>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                    : "border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-12">
          {/* Sticky Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-8">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">On this page</p>
              <nav className="space-y-1">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 max-w-3xl space-y-16">
            
            {/* Section 1: Integration Basics */}
            <section id="basics">
              <h2 className="text-2xl font-bold text-white mb-4">What is an Integration in EcoNest?</h2>
              <p className="text-slate-400 mb-6">
                Integrations allow EcoNest to communicate with your existing tools, enabling seamless data flow 
                and automation across your entire tech stack.
              </p>
              <ul className="space-y-3 text-slate-300 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Connect external tools to send and receive data automatically</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Used by Templates, Workflows, Bots, and Dashboards</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Powered by secure credentials, field mappings, and triggers</span>
                </li>
              </ul>
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="pt-6">
                  <p className="text-slate-300 text-sm">
                    <span className="text-emerald-400 font-medium">Note:</span> Integrations don't change anything 
                    until you configure actions and run tests. Connecting is safe.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Section 2: Connection Methods */}
            <section id="methods">
              <h2 className="text-2xl font-bold text-white mb-6">Connection Methods</h2>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-slate-900/50 border-slate-800 hover:border-emerald-500/30 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2">
                      <LogIn className="h-5 w-5 text-blue-400" />
                    </div>
                    <CardTitle className="text-white text-lg">OAuth / Sign-in</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-400">
                    <p className="mb-2">Fastest and most secure method.</p>
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-0">
                      Recommended
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800 hover:border-emerald-500/30 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-2">
                      <Key className="h-5 w-5 text-amber-400" />
                    </div>
                    <CardTitle className="text-white text-lg">API Key / Token</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-400">
                    <p className="mb-2">Most common method. Requires secure storage.</p>
                    <Badge variant="secondary" className="bg-slate-700 text-slate-300 border-0">
                      Common
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800 hover:border-emerald-500/30 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-2">
                      <Webhook className="h-5 w-5 text-purple-400" />
                    </div>
                    <CardTitle className="text-white text-lg">Webhooks</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-400">
                    <p className="mb-2">Best for real-time events. Requires endpoint validation.</p>
                    <Badge variant="secondary" className="bg-slate-700 text-slate-300 border-0">
                      Advanced
                    </Badge>
                  </CardContent>
                </Card>
              </div>
              <Card className="bg-emerald-500/5 border-emerald-500/20">
                <CardContent className="pt-6">
                  <p className="text-slate-300 text-sm">
                    <span className="text-emerald-400 font-medium">Tip:</span> Start with OAuth when available. 
                    Use API keys only when OAuth isn't supported by the service.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Section 3: Supported Integrations */}
            <section id="directory">
              <h2 className="text-2xl font-bold text-white mb-6">Supported Integrations</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {filteredIntegrations.map((integration) => (
                  <Card 
                    key={integration.name} 
                    className="bg-slate-900/50 border-slate-800 hover:border-emerald-500/30 transition-colors"
                  >
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                            <integration.icon className="h-5 w-5 text-slate-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{integration.name}</p>
                            <Badge variant="outline" className="text-xs border-slate-700 text-slate-500">
                              {integration.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={
                              integration.status === "available" 
                                ? "bg-emerald-500/10 text-emerald-400 border-0"
                                : integration.status === "beta"
                                ? "bg-amber-500/10 text-amber-400 border-0"
                                : "bg-slate-700 text-slate-400 border-0"
                            }
                          >
                            {integration.status === "available" ? "Available" : 
                             integration.status === "beta" ? "Beta" : "Coming Soon"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {filteredIntegrations.length === 0 && (
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="py-12 text-center">
                    <p className="text-slate-400">No integrations found matching your criteria.</p>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Section 4: Setup Checklist */}
            <section id="checklist">
              <h2 className="text-2xl font-bold text-white mb-6">Setup Checklist</h2>
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {[
                      "Choose integration method (OAuth/API/Webhook)",
                      "Connect credentials securely",
                      "Confirm permissions scope",
                      "Map fields (inputs/outputs)",
                      "Run a test event",
                      "Verify logs and results",
                      "Enable in workflow or template"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center text-xs text-slate-500">
                          {index + 1}
                        </div>
                        <span className="text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-amber-500/5 border-amber-500/20 mt-4">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-slate-300 text-sm">
                      <span className="text-amber-400 font-medium">Important:</span> Always test with sample data 
                      before enabling integrations in production workflows.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section 5: Security & Permissions */}
            <section id="security">
              <h2 className="text-2xl font-bold text-white mb-6">Security Best Practices</h2>
              <Card className="bg-slate-900/50 border-slate-800 mb-4">
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {[
                      "Never paste secrets into public fields or logs",
                      "Use least privilege scopes — request only what you need",
                      "Rotate API keys on a regular schedule",
                      "Use role-based access (Admin/Owner only for sensitive integrations)",
                      "Enable webhook signature verification when available"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-slate-300">
                        <Shield className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <p className="text-slate-300 text-sm">
                    <span className="text-white font-medium">Owner/Admin Note:</span> Owners control which roles 
                    can create, edit, and delete integrations. Configure this in Settings → Roles & Permissions.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Section 6: Testing & Validation */}
            <section id="testing">
              <h2 className="text-2xl font-bold text-white mb-6">Testing & Validation</h2>
              <Card className="bg-slate-900/50 border-slate-800 mb-6">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {[
                      { step: "Connect", desc: "Establish the integration connection" },
                      { step: "Send Test", desc: "Send a test payload to verify connectivity" },
                      { step: "Confirm", desc: "Verify response data and field mappings" },
                      { step: "Check Logs", desc: "Review integration logs for any issues" },
                      { step: "Enable", desc: "Turn on automation in your workflow" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <span className="text-emerald-400 font-medium text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{item.step}</p>
                          <p className="text-sm text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <h3 className="text-lg font-semibold text-white mb-4">Quick Troubleshooting Checks</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  "Invalid or expired token",
                  "Missing required scopes",
                  "Wrong endpoint URL",
                  "Webhook signature mismatch",
                  "Field mapping errors",
                  "Rate limit exceeded"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-slate-400 text-sm">
                    <TestTube className="h-4 w-4 text-slate-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 7: Common Issues */}
            <section id="issues">
              <h2 className="text-2xl font-bold text-white mb-6">Common Issues</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {commonIssues.map((issue, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`issue-${index}`}
                    className="bg-slate-900/50 border border-slate-800 rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-white hover:text-emerald-400 hover:no-underline">
                      {issue.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-400">
                      {issue.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Section 8: FAQ */}
            <section id="faq">
              <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {faqItems.map((item, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`}
                    className="bg-slate-900/50 border border-slate-800 rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-white hover:text-emerald-400 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-slate-500" />
                        {item.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-400">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Footer CTA */}
            <Card className="bg-gradient-to-br from-emerald-500/10 to-slate-900 border-emerald-500/20">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-xl font-bold text-white mb-2">Ready to connect your first tool?</h3>
                <p className="text-slate-400 mb-6">
                  Browse available integrations or explore templates that include pre-configured connections.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                    <Link to="/integrations">
                      View Integrations Directory
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                    <Link to="/templates">
                      Browse Templates
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="text-slate-400 hover:text-white">
                    <Link to="/docs">
                      Back to Docs
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
