import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Layers, 
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Info,
  Lightbulb,
  Eye,
  Play,
  Settings,
  Copy,
  Zap,
  Clock,
  Shield,
  XCircle
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const tocItems = [
  { id: "what-are-templates", label: "What Are Templates?" },
  { id: "when-to-use", label: "When to Use Templates" },
  { id: "template-levels", label: "Template Levels Explained" },
  { id: "previewing", label: "Previewing a Template" },
  { id: "deploying", label: "Using a Template" },
  { id: "post-setup", label: "Post-Deployment Setup" },
  { id: "customizing", label: "Customizing Safely" },
  { id: "common-mistakes", label: "Common Mistakes" },
  { id: "faq", label: "FAQ" }
];

const templateLevels = [
  {
    level: "Easy / Beginner",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: Zap,
    points: [
      "Minimal setup required",
      "Safe defaults configured",
      "Great for first deployments",
      "Little to no integrations needed"
    ]
  },
  {
    level: "Intermediate",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Settings,
    points: [
      "Requires some configuration",
      "Integrations involved",
      "Some logic tuning expected",
      "Best with prior EcoNest experience"
    ]
  },
  {
    level: "Advanced",
    color: "bg-rose-100 text-rose-700 border-rose-200",
    icon: Shield,
    points: [
      "Complex multi-step workflows",
      "Multi-system dependencies",
      "Custom logic required",
      "Best for experienced users"
    ]
  }
];

const commonMistakes = [
  { mistake: "Skipping preview", fix: "Always preview to understand what you're deploying" },
  { mistake: "Deploying advanced templates too early", fix: "Start with beginner templates to learn the platform" },
  { mistake: "Forgetting to add credentials", fix: "Check required integrations before going live" },
  { mistake: "Editing live workflows without testing", fix: "Use sandbox mode or duplicate first" }
];

const faqs = [
  {
    question: "Can I redeploy the same template?",
    answer: "Yes. You can deploy the same template multiple times. Each instance is independent and can be configured differently."
  },
  {
    question: "Can templates be deleted safely?",
    answer: "Yes. Deleting a template instance stops its workflows and removes configuration. Historical data is retained for 30 days. Other instances are unaffected."
  },
  {
    question: "Do templates affect live systems immediately?",
    answer: "No. Templates do not affect any live systems until you complete setup and explicitly activate them."
  },
  {
    question: "Who can deploy templates?",
    answer: "By default, all users with Builder role or higher can deploy templates. Owners can restrict this in workspace settings."
  },
  {
    question: "Can I share a customized template with my team?",
    answer: "Yes. You can save a customized template as a new workspace template that team members can then deploy."
  }
];

export default function TemplatesGuide() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <Link 
            to="/docs" 
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Docs
          </Link>
          
          <div className="flex items-start gap-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex-shrink-0">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Templates</h1>
              <p className="text-lg text-slate-600 max-w-2xl">
                Production-ready blueprints to launch workflows, agents, and automations faster.
              </p>
              <Badge variant="secondary" className="mt-3 bg-slate-100 text-slate-600">
                Beginner friendly • Scales to advanced use
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-12">
          
          {/* Sticky Sidebar TOC - Desktop Only */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">On this page</h3>
              <nav className="space-y-1">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left text-sm text-slate-600 hover:text-blue-600 py-1.5 px-3 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-3xl">
            
            {/* Section 1: What Are Templates? */}
            <section id="what-are-templates" className="mb-16 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What Are Templates?</h2>
              <p className="text-slate-600 mb-4">
                Templates are production-ready blueprints that let you launch workflows, agents, dashboards, 
                and integrations in minutes instead of weeks. Each template includes:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700"><strong>Prebuilt logic</strong> — flows, triggers, and actions ready to go</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700"><strong>Best-practice defaults</strong> — sensible configuration out of the box</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700"><strong>Fully editable</strong> — customize anything after deployment</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700"><strong>Non-destructive</strong> — original template remains unchanged</span>
                </li>
              </ul>
              
              {/* Info Callout */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  <strong>Templates are starting points</strong> — not locked systems. You own every instance you deploy.
                </p>
              </div>
            </section>

            {/* Section 2: When to Use Templates */}
            <section id="when-to-use" className="mb-16 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">When to Use Templates vs Custom Builds</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-emerald-200 bg-emerald-50/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Use Templates When
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-emerald-700 space-y-2">
                    <p>• You want speed</p>
                    <p>• The workflow is common</p>
                    <p>• You&apos;re validating an idea</p>
                    <p>• You want best practices</p>
                  </CardContent>
                </Card>
                
                <Card className="border-slate-200 bg-slate-50/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Build Custom When
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-600 space-y-2">
                    <p>• Logic is highly specific</p>
                    <p>• You&apos;re extending an existing system deeply</p>
                    <p>• You need edge-case control</p>
                    <p>• Requirements are unique to your org</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Section 3: Template Levels */}
            <section id="template-levels" className="mb-16 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Template Levels Explained</h2>
              <p className="text-slate-600 mb-6">
                Templates are tagged by complexity to help you choose the right starting point.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {templateLevels.map((level) => (
                  <Card key={level.level} className={`border ${level.color.split(" ")[2]}`}>
                    <CardHeader className="pb-2">
                      <Badge className={`w-fit ${level.color}`}>
                        {level.level}
                      </Badge>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      {level.points.map((point, i) => (
                        <p key={i} className="flex items-start gap-2 text-slate-600">
                          <CheckCircle2 className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                          {point}
                        </p>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Section 4: Previewing */}
            <section id="previewing" className="mb-16 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Previewing a Template</h2>
              <p className="text-slate-600 mb-6">
                Always preview before deploying to understand what you&apos;re getting.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm flex-shrink-0">1</span>
                  <div>
                    <p className="font-medium text-slate-900">Navigate to Templates</p>
                    <p className="text-sm text-slate-500">Go to Product → Templates in the main navigation</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm flex-shrink-0">2</span>
                  <div>
                    <p className="font-medium text-slate-900">Click Preview</p>
                    <p className="text-sm text-slate-500">Find a template and click the Preview button</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm flex-shrink-0">3</span>
                  <div>
                    <p className="font-medium text-slate-900">Review the details</p>
                    <p className="text-sm text-slate-500">Check included components, required integrations, and expected inputs/outputs</p>
                  </div>
                </div>
              </div>

              {/* Callout */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                <Eye className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-emerald-800">
                  <strong>Previewing does not create or modify anything</strong> in your workspace. It&apos;s completely safe.
                </p>
              </div>
            </section>

            {/* Section 5: Deploying */}
            <section id="deploying" className="mb-16 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Using a Template (Deployment)</h2>
              <p className="text-slate-600 mb-6">
                When you&apos;re ready to deploy, here&apos;s what happens:
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-semibold text-sm flex-shrink-0">1</span>
                  <p className="text-slate-700 pt-1">Click <strong>Use Template</strong></p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-semibold text-sm flex-shrink-0">2</span>
                  <p className="text-slate-700 pt-1">EcoNest clones the template into your workspace</p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-semibold text-sm flex-shrink-0">3</span>
                  <p className="text-slate-700 pt-1">A new instance is created that <strong>you fully own</strong></p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-semibold text-sm flex-shrink-0">4</span>
                  <p className="text-slate-700 pt-1">You&apos;re routed to setup (if configuration is required)</p>
                </div>
              </div>

              {/* Important Note */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100">
                <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  <strong>You fully own deployed templates</strong> and can edit them safely. The original template is never modified.
                </p>
              </div>
            </section>

            {/* Section 6: Post-Deployment Setup */}
            <section id="post-setup" className="mb-16 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Post-Deployment Setup</h2>
              <p className="text-slate-600 mb-6">
                Most templates require some setup after deployment. Use this checklist:
              </p>
              
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded border-2 border-slate-300 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Connect required integrations (Zapier, Slack, CRM, etc.)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded border-2 border-slate-300 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Add API keys or credentials</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded border-2 border-slate-300 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Map your data fields (leads, contacts, tickets)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded border-2 border-slate-300 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Review and adjust triggers</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded border-2 border-slate-300 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Test with sample data before going live</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Section 7: Customizing Safely */}
            <section id="customizing" className="mb-16 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Customizing Templates Safely</h2>
              <p className="text-slate-600 mb-6">
                Follow these best practices when making changes:
              </p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Change one thing at a time</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Test after each change</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Duplicate before major edits</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Avoid deleting required triggers blindly</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Document your changes for team reference</span>
                </li>
              </ul>

              {/* Warning Callout */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
                <Copy className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  <strong>If unsure, duplicate the template first.</strong> This gives you a safe copy to experiment with.
                </p>
              </div>
            </section>

            {/* Section 8: Common Mistakes */}
            <section id="common-mistakes" className="mb-16 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes</h2>
              <p className="text-slate-600 mb-6">
                Avoid these pitfalls to save time and prevent issues:
              </p>
              
              <div className="space-y-4">
                {commonMistakes.map((item, i) => (
                  <Card key={i} className="border-slate-200">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start gap-4">
                        <XCircle className="h-5 w-5 text-rose-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-slate-900">{item.mistake}</p>
                          <p className="text-sm text-slate-500 mt-1">
                            <strong className="text-emerald-600">Fix:</strong> {item.fix}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Section 9: FAQ */}
            <section id="faq" className="mb-16 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">FAQ</h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-slate-200">
                    <AccordionTrigger className="text-left text-slate-900 hover:text-blue-600">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Footer CTA */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-emerald-50 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to deploy your first template?</h3>
              <p className="text-slate-600 mb-6">
                Browse our library and get started in minutes.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/templates">
                    Browse Templates
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/templates?level=beginner">
                    View Beginner Templates
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/docs">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Docs
                  </Link>
                </Button>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
