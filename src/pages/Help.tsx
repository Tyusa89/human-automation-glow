import { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen, Play, MessageCircle, Settings, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Help() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-background to-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            EcoNest AI Help Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn how to use EcoNest AI, set up templates, and get answers to frequently asked questions.
          </p>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* Getting Started Tab */}
          <TabsContent value="getting-started" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Welcome to EcoNest AI
                </CardTitle>
                <CardDescription>
                  Your complete guide to getting started with EcoNest AI platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Step 1: Create Your Account</h3>
                    <p className="text-muted-foreground">
                      Sign up for your EcoNest AI account to access all templates and features. 
                      You can use email or Google authentication for quick access.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Step 2: Explore Templates</h3>
                    <p className="text-muted-foreground">
                      Browse our collection of pre-built templates for analytics, automation, 
                      data sync, and more. Each template is designed for specific business needs.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Step 3: Set Up Your First Project</h3>
                    <p className="text-muted-foreground">
                      Choose a template and follow the setup wizard to configure your project. 
                      The wizard will guide you through all necessary settings and integrations.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Step 4: Launch & Monitor</h3>
                    <p className="text-muted-foreground">
                      Deploy your project and use our dashboard to monitor performance, 
                      view analytics, and manage your automated workflows.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Start Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">✓</div>
                    <span>Create your EcoNest AI account</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm">2</div>
                    <span>Complete your profile setup</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm">3</div>
                    <span>Browse available templates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm">4</div>
                    <span>Set up your first project</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm">5</div>
                    <span>Launch and monitor your solution</span>
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
                  Template Setup Guide
                </CardTitle>
                <CardDescription>
                  Learn how to configure and customize EcoNest AI templates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">Analytics Dashboard Template</h3>
                    <p className="text-muted-foreground mb-4">
                      Create comprehensive analytics dashboards with real-time data visualization and reporting capabilities.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-medium">Setup Steps:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Configure data sources and connections</li>
                        <li>Select visualization types and metrics</li>
                        <li>Set up automated reporting schedules</li>
                        <li>Customize dashboard layout and branding</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">Data Sync Tool Template</h3>
                    <p className="text-muted-foreground mb-4">
                      Automate data synchronization between multiple systems and platforms.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-medium">Setup Steps:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Select source and destination systems</li>
                        <li>Configure data mapping and transformations</li>
                        <li>Set synchronization frequency</li>
                        <li>Test and validate data flow</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">Workflow Automation Template</h3>
                    <p className="text-muted-foreground mb-4">
                      Build automated workflows to streamline business processes and improve efficiency.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-medium">Setup Steps:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Define workflow triggers and conditions</li>
                        <li>Configure automated actions and responses</li>
                        <li>Set up notifications and alerts</li>
                        <li>Test workflow execution and performance</li>
                      </ul>
                    </div>
                  </div>
                </div>
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
        <Card className="mt-12">
          <CardHeader className="text-center">
            <CardTitle>Still Need Help?</CardTitle>
            <CardDescription>
              Our support team is here to help you succeed with EcoNest AI
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex justify-center gap-4">
              <Button asChild>
                <a href="/contact">Contact Support</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:support@econest.ai">Email Us</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}