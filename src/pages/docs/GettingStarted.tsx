import { Link } from "react-router-dom";
import { Section } from "@/components/Sections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  CheckCircle2, 
  ArrowRight, 
  ChevronLeft,
  User,
  Layers,
  Plug,
  Play,
  BookOpen
} from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Create Your Account",
    description: "Sign up for EcoNest AI with your email or SSO provider.",
    icon: User,
    details: [
      "Visit econest.ai and click 'Get Started'",
      "Choose email signup or connect via Google/Microsoft",
      "Verify your email address",
      "Complete your profile setup"
    ]
  },
  {
    number: 2,
    title: "Choose a Template",
    description: "Browse our template library and pick one that matches your use case.",
    icon: Layers,
    details: [
      "Navigate to Product → Templates",
      "Filter by category or search by name",
      "Preview templates before deploying",
      "Click 'Use Template' to get started"
    ],
    link: { label: "Browse Templates", href: "/templates" }
  },
  {
    number: 3,
    title: "Connect Your Tools",
    description: "Link EcoNest to your existing services and data sources.",
    icon: Plug,
    details: [
      "Go to Integrations in your dashboard",
      "Choose from 50+ supported integrations",
      "Authorize connections securely",
      "Map your data fields"
    ],
    link: { label: "View Integrations", href: "/integrations" }
  },
  {
    number: 4,
    title: "Deploy & Go Live",
    description: "Launch your workflow to a widget, channel, or API endpoint.",
    icon: Play,
    details: [
      "Configure your deployment settings",
      "Test in sandbox mode first",
      "Publish to production",
      "Monitor performance in real-time"
    ]
  }
];

export default function GettingStarted() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-50 via-background to-background border-b">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <Link 
            to="/docs" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Docs
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600">
              <Rocket className="h-6 w-6" />
            </div>
            <div>
              <Badge variant="secondary" className="mb-2">Guide</Badge>
              <h1 className="text-3xl md:text-4xl font-bold">Getting Started</h1>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            New to EcoNest? Follow this guide to set up your account, deploy your first template, 
            and start automating in under 10 minutes.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Quick Overview */}
          <Card className="mb-12 border-emerald-200 bg-emerald-50/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <BookOpen className="h-6 w-6 text-emerald-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-emerald-900 mb-2">What You'll Learn</h3>
                  <ul className="text-sm text-emerald-700 space-y-1">
                    <li>• How to create and configure your EcoNest account</li>
                    <li>• How to select and deploy your first template</li>
                    <li>• How to connect your existing tools and services</li>
                    <li>• How to go live and start automating</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <Card key={step.number} className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-blue-500" />
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                      {step.number}
                    </div>
                    <div className="flex items-center gap-3">
                      <step.icon className="h-5 w-5 text-muted-foreground" />
                      <CardTitle>{step.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  <ul className="space-y-2 mb-4">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                  {step.link && (
                    <Button variant="outline" size="sm" asChild>
                      <Link to={step.link.href}>
                        {step.link.label}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Next Steps */}
          <Card className="mt-12 bg-gradient-to-br from-emerald-50 to-blue-50 border-0">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4">What's Next?</h3>
              <p className="text-muted-foreground mb-6">
                Now that you're set up, explore these resources to get the most out of EcoNest:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <Link to="/docs/templates" className="block p-4 rounded-lg bg-background hover:bg-muted transition-colors">
                  <Layers className="h-5 w-5 text-blue-600 mb-2" />
                  <p className="font-medium">Templates Guide</p>
                  <p className="text-sm text-muted-foreground">Deep dive into templates</p>
                </Link>
                <Link to="/docs/integrations" className="block p-4 rounded-lg bg-background hover:bg-muted transition-colors">
                  <Plug className="h-5 w-5 text-purple-600 mb-2" />
                  <p className="font-medium">Integrations</p>
                  <p className="text-sm text-muted-foreground">Connect your tools</p>
                </Link>
                <Link to="/docs/troubleshooting" className="block p-4 rounded-lg bg-background hover:bg-muted transition-colors">
                  <BookOpen className="h-5 w-5 text-amber-600 mb-2" />
                  <p className="font-medium">Get Help</p>
                  <p className="text-sm text-muted-foreground">FAQs & support</p>
                </Link>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
