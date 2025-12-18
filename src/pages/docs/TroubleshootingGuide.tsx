import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  ChevronLeft, 
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  MessageCircle,
  Mail,
  BookOpen
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Why isn't my template deploying?",
    answer: "Check that you have the required integrations connected. Some templates require specific services (like Zapier or Intercom) to be authorized before deployment. You can see required integrations in the template preview."
  },
  {
    question: "How do I connect an integration that requires an API key?",
    answer: "Go to Integrations → find your service → click Connect. If the service uses API keys, you'll see a form to enter your credentials. API keys are encrypted and stored securely."
  },
  {
    question: "My webhook isn't receiving events",
    answer: "Verify your endpoint URL is correct and publicly accessible. Check that your server returns a 200 status code. EcoNest will retry failed deliveries 3 times with exponential backoff. Check your webhook logs in Settings → Webhooks."
  },
  {
    question: "How do I update a deployed template?",
    answer: "Deployed templates are fully editable. Go to your dashboard, find the template, and click Edit. Changes are saved automatically but won't affect live workflows until you publish."
  },
  {
    question: "Can I use multiple instances of the same template?",
    answer: "Yes! You can deploy the same template multiple times. Each instance is independent and can be configured differently. This is useful for testing or running parallel workflows."
  },
  {
    question: "How do I transfer ownership of a template?",
    answer: "Go to the template settings → Team → Transfer Ownership. You'll need the new owner's email address. They'll receive an invitation to accept ownership."
  },
  {
    question: "What happens if I delete a template instance?",
    answer: "Deleting a template instance stops all associated workflows and removes the configuration. Historical data (like completed runs) is retained for 30 days. This action cannot be undone."
  },
  {
    question: "How do I upgrade my plan?",
    answer: "Go to Settings → Billing → Upgrade Plan. Choose your new plan and enter payment details. The upgrade takes effect immediately and you'll be prorated for the current billing cycle."
  }
];

const commonIssues = [
  {
    title: "Connection Timeout",
    description: "If integrations are timing out, check your network connection and verify the external service is operational.",
    solution: "Try disconnecting and reconnecting the integration. If the issue persists, contact support."
  },
  {
    title: "Data Not Syncing",
    description: "Data sync issues can occur due to field mapping errors or permission changes.",
    solution: "Review your field mappings in the integration settings. Ensure your API credentials still have the required permissions."
  },
  {
    title: "Workflow Not Triggering",
    description: "Workflows may not trigger if the trigger conditions aren't met or the workflow is paused.",
    solution: "Check the workflow status (active/paused) and verify your trigger conditions match incoming data."
  }
];

export default function TroubleshootingGuide() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-50 via-background to-background border-b">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <Link 
            to="/docs" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Docs
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 text-orange-600">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <Badge variant="secondary" className="mb-2">Support</Badge>
              <h1 className="text-3xl md:text-4xl font-bold">Troubleshooting & FAQ</h1>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Find answers to common questions and solutions to frequent issues. 
            Can't find what you need? Our support team is here to help.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Common Issues */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              Common Issues
            </h2>
            <div className="space-y-4">
              {commonIssues.map((issue) => (
                <Card key={issue.title}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{issue.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-3">{issue.description}</p>
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Solution:</strong> {issue.solution}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-500" />
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Contact Support */}
          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-0">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4">Still Need Help?</h3>
              <p className="text-muted-foreground mb-6">
                Our support team is available to help you resolve any issues.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link to="/contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Support
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://discord.gg/econest" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Join Discord Community
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
