import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  ChevronLeft, 
  ArrowRight,
  TrendingUp,
  HeadphonesIcon,
  Settings,
  CheckCircle2
} from "lucide-react";

const solutions = [
  {
    id: "sales",
    title: "Sales",
    icon: TrendingUp,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    description: "Automate lead qualification, follow-ups, and pipeline management.",
    useCases: [
      "Lead scoring and qualification",
      "Automated follow-up sequences",
      "CRM synchronization",
      "Meeting scheduling automation",
      "Deal pipeline tracking"
    ],
    templates: ["Lead Qualification Bot", "CRM Sync", "Meeting Scheduler"]
  },
  {
    id: "support",
    title: "Support",
    icon: HeadphonesIcon,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "Deflect tickets, triage issues, and empower customers with self-service.",
    useCases: [
      "Ticket triage and routing",
      "AI-powered chat support",
      "Knowledge base automation",
      "Escalation workflows",
      "Customer satisfaction tracking"
    ],
    templates: ["Customer Support Widget", "Ticket Triage Bot", "FAQ Chatbot"]
  },
  {
    id: "operations",
    title: "Operations",
    icon: Settings,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    description: "Streamline internal processes, approvals, and cross-team workflows.",
    useCases: [
      "Approval workflows",
      "Data synchronization",
      "Report generation",
      "Inventory management",
      "Process automation"
    ],
    templates: ["Report Generator", "Data Sync Tool", "Inventory Manager"]
  }
];

export default function SolutionsGuide() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-50 via-background to-background border-b">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <Link 
            to="/docs" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Docs
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 text-amber-600">
              <Lightbulb className="h-6 w-6" />
            </div>
            <div>
              <Badge variant="secondary" className="mb-2">Guide</Badge>
              <h1 className="text-3xl md:text-4xl font-bold">Solutions Guide</h1>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Pre-built solutions for Sales, Support, and Operations teams. 
            Choose a solution area to see relevant templates and use cases.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Solutions */}
          <div className="space-y-12">
            {solutions.map((solution) => (
              <section key={solution.id} id={solution.id}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${solution.bgColor} ${solution.color}`}>
                        <solution.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{solution.title}</CardTitle>
                        <p className="text-muted-foreground mt-1">{solution.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Common Use Cases</h4>
                        <ul className="space-y-2">
                          {solution.useCases.map((useCase) => (
                            <li key={useCase} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className={`h-4 w-4 mt-0.5 ${solution.color}`} />
                              {useCase}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Recommended Templates</h4>
                        <ul className="space-y-2">
                          {solution.templates.map((template) => (
                            <li key={template} className="flex items-center gap-2 text-sm">
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              {template}
                            </li>
                          ))}
                        </ul>
                        <Button variant="outline" size="sm" className="mt-4" asChild>
                          <Link to="/templates">
                            Browse Templates
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            ))}
          </div>

          {/* CTA */}
          <Card className="mt-12 bg-gradient-to-br from-amber-50 to-emerald-50 border-0">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4">Not Sure Where to Start?</h3>
              <p className="text-muted-foreground mb-4">
                Talk to our team and we'll help you identify the best solution for your needs.
              </p>
              <Button asChild>
                <Link to="/contact">
                  Get a Recommendation
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
