import { Link } from "react-router-dom";
import { Section } from "@/components/Sections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Layers, 
  Search, 
  Eye, 
  Play, 
  Settings, 
  Pencil,
  Shield,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  BookOpen
} from "lucide-react";

const beginnerTemplates = [
  "Report Generator",
  "Appointment Booker", 
  "Data + Docs Sync",
  "Social Media Scheduler"
];

const intermediateTemplates = [
  "Lead Qualification Bot",
  "Customer Support Widget",
  "Expense Tracker"
];

const advancedTemplates = [
  "Workflow Automation",
  "Analytics Dashboard",
  "Data Sync Warehouse",
  "Email Campaign Builder"
];

export default function TemplatesGuide() {
  return (
    <div className="min-h-screen">
      {/* Breadcrumb & Header */}
      <div className="bg-gradient-to-br from-blue-50 via-background to-background border-b">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <Link 
            to="/docs" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Docs
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <Badge variant="secondary" className="mb-2">Guide</Badge>
              <h1 className="text-3xl md:text-4xl font-bold">Templates Guide</h1>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Learn how to browse, deploy, and customize EcoNest templates to launch workflows, 
            agents, and integrations in minutes.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Table of Contents */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                In This Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="grid md:grid-cols-2 gap-2 text-sm">
                <a href="#what-are-templates" className="text-muted-foreground hover:text-primary">1. What Are Templates?</a>
                <a href="#accessing-templates" className="text-muted-foreground hover:text-primary">2. Accessing Templates</a>
                <a href="#template-cards" className="text-muted-foreground hover:text-primary">3. Understanding Template Cards</a>
                <a href="#previewing" className="text-muted-foreground hover:text-primary">4. Previewing a Template</a>
                <a href="#deploying" className="text-muted-foreground hover:text-primary">5. Using a Template</a>
                <a href="#setup" className="text-muted-foreground hover:text-primary">6. Post-Deployment Setup</a>
                <a href="#customizing" className="text-muted-foreground hover:text-primary">7. Customizing Your Template</a>
                <a href="#beginner" className="text-muted-foreground hover:text-primary">8. Recommended Templates</a>
                <a href="#tips" className="text-muted-foreground hover:text-primary">9. Safe Usage Tips</a>
                <a href="#when-to-use" className="text-muted-foreground hover:text-primary">10. Templates vs Custom Builds</a>
              </nav>
            </CardContent>
          </Card>

          {/* Section 1 */}
          <section id="what-are-templates" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm">1</span>
              What Are Templates?
            </h2>
            <p className="text-muted-foreground mb-4">
              Templates are production-ready blueprints that let you launch workflows, agents, dashboards, 
              and integrations in minutes instead of weeks.
            </p>
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <p className="font-medium mb-3">Each template includes:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Preconfigured logic</strong> — flows, triggers, and actions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Default schemas</strong> — data mappings when applicable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Best-practice structure</strong> — sensible defaults out of the box</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Clean starting point</strong> — customize safely without breaking anything</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Section 2 */}
          <section id="accessing-templates" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm">2</span>
              Accessing Templates
            </h2>
            <div className="space-y-4">
              <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
                <li>Sign in to EcoNest AI</li>
                <li>From the top navigation, click <strong className="text-foreground">Product → Templates</strong></li>
                <li>You'll land on the Templates Library</li>
              </ol>
              <Card className="border-blue-200 bg-blue-50/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Search className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">At the top you'll find:</p>
                      <ul className="text-sm text-blue-700 mt-2 space-y-1">
                        <li>• <strong>Search bar</strong> — find templates by name or use case</li>
                        <li>• <strong>Category filter</strong> — narrow by solution type</li>
                        <li>• <strong>Badges</strong> — Popular, Easy, Beginner, Intermediate, Advanced</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 3 */}
          <section id="template-cards" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm">3</span>
              Understanding Template Cards
            </h2>
            <p className="text-muted-foreground mb-4">
              Each template card shows key details at a glance:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Template Info</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>• <strong>Template Name</strong></p>
                  <p>• Short description of what it does</p>
                  <p>• Complexity badges (Easy / Advanced)</p>
                  <p>• Experience level (Beginner / Intermediate / Advanced)</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Actions Available</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <strong>Preview</strong> — inspect before deploying
                  </p>
                  <p className="flex items-center gap-2">
                    <Play className="h-4 w-4 text-emerald-600" />
                    <strong>Use Template</strong> — launch instantly
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 4 */}
          <section id="previewing" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm">4</span>
              Previewing a Template
              <Badge variant="outline" className="ml-2">Recommended</Badge>
            </h2>
            <p className="text-muted-foreground mb-4">
              Before deploying, click <strong>Preview</strong> to:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
                <span>See what the template includes</span>
              </li>
              <li className="flex items-start gap-2">
                <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
                <span>Understand inputs, outputs, and integrations</span>
              </li>
              <li className="flex items-start gap-2">
                <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
                <span>Confirm it matches your use case</span>
              </li>
              <li className="flex items-start gap-2">
                <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
                <span>Avoid deploying unnecessary components</span>
              </li>
            </ul>
            <Card className="border-emerald-200 bg-emerald-50/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Preview does not create anything in your workspace.</span>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 5 */}
          <section id="deploying" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm">5</span>
              Using a Template (Deploying)
            </h2>
            <p className="text-muted-foreground mb-4">When ready:</p>
            <ol className="space-y-3 list-decimal list-inside text-muted-foreground mb-4">
              <li>Click <strong className="text-foreground">Use Template</strong></li>
              <li>EcoNest will clone the template into your workspace</li>
              <li>A new instance you own will be created</li>
              <li>The original template remains unchanged</li>
              <li>You'll be routed to setup or configuration (if required)</li>
            </ol>
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-2 text-amber-700">
                  <Lightbulb className="h-5 w-5 mt-0.5" />
                  <span>Each template becomes <strong>fully editable</strong> after deployment.</span>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 6 */}
          <section id="setup" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm">6</span>
              Post-Deployment Setup
            </h2>
            <p className="text-muted-foreground mb-4">Most templates require light setup:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Common Steps
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>• Connecting integrations (Zapier, Intercom, APIs)</p>
                  <p>• Adding credentials or API keys</p>
                  <p>• Mapping fields (leads, tickets, inventory)</p>
                  <p>• Adjusting triggers, rules, or thresholds</p>
                </CardContent>
              </Card>
              <Card className="border-emerald-200 bg-emerald-50/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-2 text-emerald-700">
                    <CheckCircle2 className="h-5 w-5 mt-0.5" />
                    <span className="text-sm">EcoNest highlights required steps so nothing is missed.</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 7 */}
          <section id="customizing" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm">7</span>
              Customizing Your Template
            </h2>
            <p className="text-muted-foreground mb-4">After deployment, you can:</p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2">
                <Pencil className="h-4 w-4 text-muted-foreground" />
                Rename the template
              </li>
              <li className="flex items-center gap-2">
                <Pencil className="h-4 w-4 text-muted-foreground" />
                Modify workflows or logic
              </li>
              <li className="flex items-center gap-2">
                <Pencil className="h-4 w-4 text-muted-foreground" />
                Add new triggers or actions
              </li>
              <li className="flex items-center gap-2">
                <Pencil className="h-4 w-4 text-muted-foreground" />
                Connect additional tools
              </li>
              <li className="flex items-center gap-2">
                <Pencil className="h-4 w-4 text-muted-foreground" />
                Disable or remove components safely
              </li>
            </ul>
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-2 text-blue-700">
                  <Lightbulb className="h-5 w-5 mt-0.5" />
                  <span><strong>Best practice:</strong> Start with one change at a time and test after each update.</span>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 8 - Recommended Templates */}
          <section id="beginner" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm">8</span>
              Recommended Starting Templates
            </h2>
            <p className="text-muted-foreground mb-6">If you're new to EcoNest, start here:</p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <Badge className="w-fit bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Beginner / Easy</Badge>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {beginnerTemplates.map((t) => (
                      <li key={t} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card id="intermediate">
                <CardHeader className="pb-2">
                  <Badge className="w-fit bg-amber-100 text-amber-700 hover:bg-amber-100">Intermediate</Badge>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {intermediateTemplates.map((t) => (
                      <li key={t} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-amber-600" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card id="advanced">
                <CardHeader className="pb-2">
                  <Badge className="w-fit bg-rose-100 text-rose-700 hover:bg-rose-100">Advanced</Badge>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {advancedTemplates.map((t) => (
                      <li key={t} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-rose-600" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 9 */}
          <section id="tips" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm">9</span>
              Safe Usage Tips
            </h2>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>Templates do not affect live systems until configured</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>You can duplicate templates to experiment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>Deleting a template instance does not impact others</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>Owner/Admin roles control who can deploy templates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Section 10 */}
          <section id="when-to-use" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm">10</span>
              When to Use Templates vs Custom Builds
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-lg text-emerald-700">Use Templates When:</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    You want speed
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    The use case is common
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    You want best-practice defaults
                  </p>
                </CardContent>
              </Card>
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-700">Build Custom When:</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    You need highly specific logic
                  </p>
                  <p className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    You're extending an existing workflow deeply
                  </p>
                </CardContent>
              </Card>
            </div>
            <Card className="mt-4 border-amber-200 bg-amber-50/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-2 text-amber-700">
                  <Lightbulb className="h-5 w-5 mt-0.5" />
                  <span>Many users start with templates and evolve them into fully custom solutions.</span>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Next Steps CTA */}
          <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-0">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4">Next Steps</h3>
              <ol className="space-y-2 text-muted-foreground mb-6">
                <li>1. <Link to="/templates" className="text-primary hover:underline">Browse Templates</Link> → Choose one use case</li>
                <li>2. Preview → Deploy → Configure</li>
                <li>3. Test → Optimize → Scale</li>
              </ol>
              <p className="font-medium text-emerald-700 mb-4">EcoNest Templates are designed to grow with you.</p>
              <Button asChild>
                <Link to="/templates">
                  Browse Templates
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
