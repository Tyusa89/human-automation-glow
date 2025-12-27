import { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen, Play, MessageCircle, Settings, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Help() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          EcoNest AI Help Center
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Learn how to use EcoNest AI, set up templates, and get answers to frequently asked questions.
        </p>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="getting-started" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10">
          <TabsTrigger value="getting-started" className="data-[state=active]:bg-white/10 text-white">Getting Started</TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-white/10 text-white">Templates</TabsTrigger>
          <TabsTrigger value="features" className="data-[state=active]:bg-white/10 text-white">Features</TabsTrigger>
          <TabsTrigger value="faq" className="data-[state=active]:bg-white/10 text-white">FAQ</TabsTrigger>
        </TabsList>

        {/* Getting Started Tab */}
        <TabsContent value="getting-started" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Play className="w-5 h-5" />
                Welcome to EcoNest AI
              </CardTitle>
              <CardDescription className="text-white/70">
                Your complete guide to getting started with EcoNest AI platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Step 1: Create Your Account</h3>
                  <p className="text-white/70">
                    Sign up for your EcoNest AI account to access all templates and features. 
                    You can use email or Google authentication for quick access.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Step 2: Explore Templates</h3>
                  <p className="text-white/70">
                    Browse our collection of pre-built templates for analytics, automation, 
                    data sync, and more. Each template is designed for specific business needs.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Step 3: Set Up Your First Project</h3>
                  <p className="text-white/70">
                    Choose a template and follow the setup wizard to configure your project. 
                    The wizard will guide you through all necessary settings and integrations.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Step 4: Launch & Monitor</h3>
                  <p className="text-white/70">
                    Deploy your project and use our dashboard to monitor performance, 
                    view analytics, and manage your automated workflows.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Quick Start Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm">✓</div>
                  <span className="text-white">Create your EcoNest AI account</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 text-white/60 flex items-center justify-center text-sm">2</div>
                  <span className="text-white/80">Complete your profile setup</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 text-white/60 flex items-center justify-center text-sm">3</div>
                  <span className="text-white/80">Browse available templates</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 text-white/60 flex items-center justify-center text-sm">4</div>
                  <span className="text-white/80">Set up your first project</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 text-white/60 flex items-center justify-center text-sm">5</div>
                  <span className="text-white/80">Launch and monitor your solution</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Template Setup Guides
                </CardTitle>
                <CardDescription>
                  Comprehensive step-by-step guides for setting up each EcoNest AI template
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {/* Analytics Dashboard Template */}
                  <AccordionItem value="analytics">
                    <AccordionTrigger className="text-lg font-semibold">
                      Analytics Dashboard Template
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-2">Who it's for</h4>
                          <p className="text-muted-foreground">Teams that need real-time KPIs, reports, and shareable dashboards without building chart plumbing from scratch.</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Time to complete</h4>
                            <p className="text-muted-foreground">10–15 minutes (first run)</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">What you'll build</h4>
                            <p className="text-muted-foreground">A live dashboard with at least three visualizations, a date filter, and an auto-refresh interval.</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Prerequisites</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Data source credentials (PostgreSQL/MySQL/Supabase, CSV, or API)</li>
                            <li>API key(s) for any services you intend to visualize</li>
                            <li>An EcoNest project with an environment selected (Dev/Prod)</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Setup Steps</h4>
                          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                            <li><strong>Connect a data source:</strong> Settings → Integrations → Add Source. Choose DB/API/CSV. Test connection.</li>
                            <li><strong>Define metrics:</strong> Templates → Analytics Dashboard → Metrics. Add metrics (e.g., active_users, mrr, orders_today).</li>
                            <li><strong>Create visualizations:</strong> Select chart type for each metric (line, area, bar, pie, stat). Give each a title and y-axis unit.</li>
                            <li><strong>Add filters:</strong> Enable global filters (date range, product, region). Pick defaults.</li>
                            <li><strong>Schedule reports (optional):</strong> Enable a report schedule (daily/weekly) to email a PDF or link.</li>
                            <li><strong>Branding:</strong> Add logo, theme color, and choose layout (1–3 columns).</li>
                            <li><strong>Save & preview:</strong> Use Preview to verify data loads within 3–5s. Adjust refresh interval.</li>
                          </ol>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Sample Configuration</h4>
                          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "datasource": "supabase",
  "refreshSeconds": 60,
  "filters": [
    {"id": "date", "type": "daterange", "default": "last_30_days"},
    {"id": "region", "type": "select", "options": ["NA","EU","APAC"]}
  ],
  "widgets": [
    {"type": "stat", "title": "Active Users", "metric": "active_users"},
    {"type": "line", "title": "MRR", "metric": "mrr", "yUnit": "$"},
    {"type": "bar", "title": "Orders by Day", "metric": "orders_daily"}
  ]
}`}
                          </pre>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">API Endpoints</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li><code className="bg-muted px-2 py-1 rounded">GET /api/analytics/widgets</code> – list widgets</li>
                            <li><code className="bg-muted px-2 py-1 rounded">POST /api/analytics/query</code> – run metric query</li>
                            <li><code className="bg-muted px-2 py-1 rounded">POST /api/analytics/schedule</code> – create a report schedule</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Common Errors & Fixes</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li><strong>Charts blank:</strong> Check metric query returns fields the widget expects (timestamp, value).</li>
                            <li><strong>Slow loads:</strong> Add a date filter & reduce default window; add DB index on created_at.</li>
                            <li><strong>Unauthorized:</strong> Verify project environment keys on server are set.</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Troubleshooting</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Use Preview → Network to confirm API calls return 200 in &lt;2s.</li>
                            <li>Toggle Mock data to test layout before live credentials.</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Data Sync Tool Template */}
                  <AccordionItem value="data-sync">
                    <AccordionTrigger className="text-lg font-semibold">
                      Data Sync Tool Template
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-2">Who it's for</h4>
                          <p className="text-muted-foreground">Ops teams moving data between apps/DBs on a schedule with mapping/transformations.</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Time to complete</h4>
                            <p className="text-muted-foreground">8–12 minutes</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">What you'll build</h4>
                            <p className="text-muted-foreground">A scheduled sync with mapping, optional transforms, and alerting on failures.</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Prerequisites</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Source & destination credentials (e.g., HubSpot → Postgres, Shopify → BigQuery)</li>
                            <li>Clear mapping of source fields → destination fields</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Setup Steps</h4>
                          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                            <li><strong>Choose connectors:</strong> Select Source and Destination. Authenticate both.</li>
                            <li><strong>Pick objects/tables:</strong> e.g., contacts → crm_contacts.</li>
                            <li><strong>Field mapping:</strong> Map source→destination. Enable auto-create for new columns (optional).</li>
                            <li><strong>Transformations (optional):</strong> Add transforms (trim strings, parse dates, currency to cents, etc.).</li>
                            <li><strong>De-duplication & upsert:</strong> Choose unique key(s) (email, external_id). Pick insert only or upsert.</li>
                            <li><strong>Schedule & alerts:</strong> Set frequency (5m/15m/hourly/daily). Add email/webhook alerts on error.</li>
                            <li><strong>Test run & validate:</strong> Run a dry run (10 records). Review summary. Start the sync.</li>
                          </ol>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Sample Mapping</h4>
                          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`source: hubspot.contacts
destination: postgres.public.crm_contacts
unique_key: email
mode: upsert
transforms:
  - field: phone
    op: normalize_phone
  - field: created_at
    op: parse_date
schedule: "*/15 * * * *"  # every 15 minutes`}
                          </pre>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">API Endpoints</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li><code className="bg-muted px-2 py-1 rounded">POST /api/syncs</code> – create a sync job</li>
                            <li><code className="bg-muted px-2 py-1 rounded">POST /api/syncs/:id/run</code> – trigger now</li>
                            <li><code className="bg-muted px-2 py-1 rounded">GET /api/syncs/:id/logs</code> – fetch last runs</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Common Errors & Fixes</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li><strong>404 instantiate:</strong> Ensure templateId = data-sync-tool and path /api/templates/:id/instantiate.</li>
                            <li><strong>Mapping mismatch:</strong> Destination column missing; enable auto-create or add migration.</li>
                            <li><strong>Rate limits:</strong> Reduce batch size; add backoff (e.g., 100ms).</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Troubleshooting</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Compare counts: source_processed == destination_upserted + skipped.</li>
                            <li>Enable verbose logs for first full run.</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Workflow Automation Template */}
                  <AccordionItem value="workflow">
                    <AccordionTrigger className="text-lg font-semibold">
                      Workflow Automation Template
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-2">Who it's for</h4>
                          <p className="text-muted-foreground">Teams automating repetitive tasks with triggers/conditions and multi-step actions.</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Time to complete</h4>
                            <p className="text-muted-foreground">7–10 minutes</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">What you'll build</h4>
                            <p className="text-muted-foreground">A trigger → condition → action pipeline with notifications.</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Prerequisites</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Access tokens for any third-party actions (Slack, Email, Twilio, etc.)</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Setup Steps</h4>
                          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                            <li><strong>Define trigger:</strong> Choose event (webhook received, row inserted, API threshold crossed).</li>
                            <li><strong>Add conditions:</strong> e.g., priority == "high" and region in ["NA","EU"].</li>
                            <li><strong>Add actions:</strong> Send Slack/Email, call API, write to DB, enqueue task.</li>
                            <li><strong>Retry & timeout:</strong> Configure exponential backoff and per-step timeout.</li>
                            <li><strong>Notifications:</strong> On success/failure, send alert to channel.</li>
                            <li><strong>Test:</strong> Fire a sample event; view execution log with step timings.</li>
                          </ol>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Sample Flow</h4>
                          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "trigger": {"type": "webhook", "path": "/events/ticket"},
  "conditions": [{"left": "payload.priority", "op": "==", "right": "high"}],
  "actions": [
    {"type": "slack.post", "channel": "#support", "text": "New high-priority ticket"},
    {"type": "db.insert", "table": "tickets", "record": {"from": "payload"}}
  ],
  "notify": {"on": ["failed"], "email": "ops@company.com"}
}`}
                          </pre>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">API Endpoints</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li><code className="bg-muted px-2 py-1 rounded">POST /api/flows</code> – create/update a flow</li>
                            <li><code className="bg-muted px-2 py-1 rounded">POST /api/flows/:id/test</code> – run with sample payload</li>
                            <li><code className="bg-muted px-2 py-1 rounded">GET /api/flows/:id/runs</code> – execution history</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Common Errors & Fixes</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li><strong>Action timeout:</strong> Increase per-step timeout; verify external API reachability.</li>
                            <li><strong>Condition never matches:</strong> Log payload, verify paths (e.g., payload.priority).</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Troubleshooting</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Enable step tracing to see where time is spent.</li>
                            <li>Use sandbox mode to run actions against mocks before going live.</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Customer Support Widget */}
                  <AccordionItem value="support-widget">
                    <AccordionTrigger className="text-lg font-semibold">
                      Customer Support Widget (Beta)
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-2">Who it's for</h4>
                          <p className="text-muted-foreground">Teams embedding a guided support widget on their site/app to deflect tickets and collect context before escalation.</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Time to complete</h4>
                            <p className="text-muted-foreground">6–9 minutes</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">What you'll build</h4>
                            <p className="text-muted-foreground">An embeddable widget with branded UI, suggested prompts, KB search, and human-handoff.</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Prerequisites</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Site/app where you can paste a script tag</li>
                            <li>Optional: Knowledge base URL(s) or FAQ CSV</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Setup Steps</h4>
                          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                            <li><strong>Branding & prompts:</strong> Choose color, logo, and 3–5 starter prompts.</li>
                            <li><strong>Knowledge sources:</strong> Add URLs/CSV for articles; enable crawling or upload.</li>
                            <li><strong>Escalation:</strong> Choose handoff: email form, Zendesk, or Slack channel.</li>
                            <li><strong>Behavior:</strong> Set default open/closed, position, and language.</li>
                            <li><strong>Install:</strong> Paste the generated &lt;script&gt; before &lt;/body&gt; or install via NPM.</li>
                            <li><strong>Test:</strong> Use preview, verify search, and trigger escalation.</li>
                          </ol>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Embed Snippet</h4>
                          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`<script 
  src="https://cdn.econest.ai/widget.js" 
  data-project="YOUR_PROJECT_ID" 
  data-theme="navy">
</script>`}
                          </pre>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">API Endpoints</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li><code className="bg-muted px-2 py-1 rounded">POST /api/widget/session</code> – start session</li>
                            <li><code className="bg-muted px-2 py-1 rounded">POST /api/widget/search</code> – query KB</li>
                            <li><code className="bg-muted px-2 py-1 rounded">POST /api/widget/handoff</code> – escalate</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Common Errors & Fixes</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li><strong>Widget not loading:</strong> Script blocked; check CSP or ad-blocker. Ensure data-project is correct.</li>
                            <li><strong>KB empty:</strong> Add at least one source or enable mock content.</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Lead Qualification Bot */}
                  <AccordionItem value="lead-bot">
                    <AccordionTrigger className="text-lg font-semibold">
                      Lead Qualification Bot
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-2">Who it's for</h4>
                          <p className="text-muted-foreground">Sales/marketing teams qualifying inbound leads 24/7 and routing high-intent prospects.</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Time to complete</h4>
                            <p className="text-muted-foreground">9–12 minutes</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">What you'll build</h4>
                            <p className="text-muted-foreground">A conversational bot that captures contact info, scores leads, and routes hot leads.</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Prerequisites</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Destination for qualified leads (CRM table/API)</li>
                            <li>Your qualification criteria (budget, need, timeline, authority)</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Setup Steps</h4>
                          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                            <li><strong>Conversation script:</strong> Start from the BANT template; edit tone and questions.</li>
                            <li><strong>Scoring:</strong> Assign points per answer; set a threshold for "qualified".</li>
                            <li><strong>Data capture:</strong> Map name, email, company, use case → CRM fields.</li>
                            <li><strong>Routing:</strong> Choose action for qualified: create CRM record + Slack alert; unqualified: send nurture email.</li>
                            <li><strong>Embed or share:</strong> Use hosted link or embed on landing page.</li>
                            <li><strong>Test:</strong> Run 3 sample conversations; confirm records created and scores correct.</li>
                          </ol>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Sample Scoring</h4>
                          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "threshold": 70,
  "rules": [
    {"field": "budget", "values": {"$gte": 1000}, "score": 25},
    {"field": "timeline", "values": ["now","this_quarter"], "score": 20},
    {"field": "authority", "values": ["decision_maker"], "score": 25}
  ]
}`}
                          </pre>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">API Endpoints</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li><code className="bg-muted px-2 py-1 rounded">POST /api/leads/score</code> – calculate score</li>
                            <li><code className="bg-muted px-2 py-1 rounded">POST /api/leads/submit</code> – persist & route</li>
                            <li><code className="bg-muted px-2 py-1 rounded">GET /api/leads/:id</code> – status</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Common Errors & Fixes</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li><strong>Unknown templateId:</strong> Ensure templateId exactly matches lead-qualification-bot when instantiating.</li>
                            <li><strong>Missing consent:</strong> Add consent checkbox to form step if required by region.</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Platform Features
                </CardTitle>
                <CardDescription>
                  Discover all the powerful features available in EcoNest AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-primary" />
                      <div>
                        <h3 className="font-semibold">Template Customization</h3>
                        <p className="text-sm text-muted-foreground">Fully customize templates to match your specific needs</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      <div>
                        <h3 className="font-semibold">AI-Powered Support</h3>
                        <p className="text-sm text-muted-foreground">Get instant help with our AI customer service agent</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <div>
                        <h3 className="font-semibold">Real-time Analytics</h3>
                        <p className="text-sm text-muted-foreground">Monitor your projects with live data and insights</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-primary" />
                      <div>
                        <h3 className="font-semibold">Automated Workflows</h3>
                        <p className="text-sm text-muted-foreground">Streamline processes with intelligent automation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find answers to common questions about EcoNest AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is EcoNest AI?</AccordionTrigger>
                    <AccordionContent>
                      EcoNest AI is a comprehensive platform that provides pre-built templates and tools for creating analytics dashboards, data synchronization tools, workflow automation, and more. It's designed to help businesses streamline their operations and gain valuable insights from their data.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>How do I get started with templates?</AccordionTrigger>
                    <AccordionContent>
                      To get started, simply browse our template library, select a template that matches your needs, and follow the setup wizard. The wizard will guide you through configuring the template with your specific requirements, including data sources, integrations, and customization options.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>Can I customize the templates?</AccordionTrigger>
                    <AccordionContent>
                      Yes! All templates are fully customizable. You can modify the project name, select different features, configure integrations, and adjust settings to match your specific business needs. The setup wizard makes customization straightforward and user-friendly.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>What integrations are supported?</AccordionTrigger>
                    <AccordionContent>
                      EcoNest AI supports a wide range of integrations including Salesforce, HubSpot, Stripe, Supabase, QuickBooks, Xero, Google Drive, Dropbox, and many more. The available integrations vary by template, and you can select the ones you need during the setup process.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger>How do I monitor my projects?</AccordionTrigger>
                    <AccordionContent>
                      Use the EcoNest AI dashboard to monitor all your projects in real-time. You can view analytics, track performance metrics, manage automated workflows, and receive alerts about important events. The dashboard provides a comprehensive overview of all your active solutions.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6">
                    <AccordionTrigger>What support options are available?</AccordionTrigger>
                    <AccordionContent>
                      EcoNest AI offers multiple support channels including this help center, AI-powered chat support, email support, and comprehensive documentation. Our AI customer service agent is available 24/7 to answer questions and provide assistance with setup and troubleshooting.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7">
                    <AccordionTrigger>Is my data secure?</AccordionTrigger>
                    <AccordionContent>
                      Yes, data security is our top priority. EcoNest AI uses enterprise-grade security measures including encryption, secure authentication, role-based access controls, and regular security audits. Your data is protected both in transit and at rest.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-8">
                    <AccordionTrigger>Can I export my data?</AccordionTrigger>
                    <AccordionContent>
                      Yes, you can export your data at any time in various formats including CSV, JSON, and Excel. This ensures you always have access to your data and can integrate it with other systems or use it for backup purposes.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contact Support Section */}
        <Card className="mt-12 bg-white/5 border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Still Need Help?</CardTitle>
            <CardDescription className="text-white/70">
              Our support team is here to help you succeed with EcoNest AI
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex justify-center gap-4">
              <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <a href="/contact">Contact Support</a>
              </Button>
              <Button variant="outline" asChild className="border-white/20 text-white hover:bg-white/10">
                <a href="mailto:support@econest.ai">Email Us</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }