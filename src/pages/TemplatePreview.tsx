import { useEffect, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, Lock, Check, Zap, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  getTemplateIdentity, 
  getUpgradeLabel,
  getUpgradeHref,
  isTemplateLocked,
  DIFFICULTY_LABELS,
  type PlanTier,
  type Difficulty,
} from "@/config/templates/templateIdentity";
import { useUserPlan } from "@/hooks/useUserPlan";
import { recordTemplateOpen } from "@/lib/templateActivity";

// Difficulty badge styling
const difficultyStyles: Record<Difficulty, string> = {
  beginner: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  intermediate: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  advanced: "bg-purple-500/20 text-purple-400 border-purple-500/40",
};

// Plan badge styling
const planStyles: Record<PlanTier, string> = {
  free: "bg-slate-500/20 text-slate-400 border-slate-500/40",
  pro: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  business: "bg-purple-500/20 text-purple-400 border-purple-500/40",
};

// Category display names
const categoryLabels: Record<string, string> = {
  dashboards: "Dashboards",
  ops: "Operations",
  bots: "Bots & AI",
  ecommerce: "Marketing",
  other: "Integrations",
};

// Default bullets fallback
const defaultBullets = [
  "Designed to get you to first value fast",
  "Works with your existing EcoNest workspace",
  "Uses the same Baseframe-clean flow across templates",
];

// Default setup steps fallback
const defaultSetupSteps = [
  "Connect required tools (if any)",
  "Confirm settings",
  "Run a test",
  "Go live",
];

// What you get features
const features = [
  { 
    title: "Quick Setup", 
    text: "Get started in under 10 minutes with guided configuration.",
    icon: Clock,
  },
  { 
    title: "Automation Ready", 
    text: "Works with your existing EcoNest workspace and integrations.",
    icon: Zap,
  },
  { 
    title: "Production Grade", 
    text: "Built for reliability with error handling and monitoring.",
    icon: Shield,
  },
];

export default function TemplatePreview() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { plan: userPlan } = useUserPlan();

  const identity = useMemo(() => (slug ? getTemplateIdentity(slug) : null), [slug]);
  const locked = identity ? isTemplateLocked(identity.requiredPlan, userPlan) : false;

  // Track template open for "Recent" list
  useEffect(() => {
    if (slug) recordTemplateOpen(slug);
  }, [slug]);

  // Use template-specific bullets or fallback to defaults
  const bullets = identity?.previewBullets?.length 
    ? identity.previewBullets 
    : defaultBullets;

  // Use template-specific steps or fallback to defaults
  const steps = identity?.setupSteps?.length 
    ? identity.setupSteps 
    : defaultSetupSteps;

  if (!identity) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Template not found</h1>
        <p className="text-muted-foreground mb-8">
          The template you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/templates")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to templates
        </Button>
      </div>
    );
  }

  const planLabel = identity.requiredPlan === "free" 
    ? "Free" 
    : identity.requiredPlan === "pro" 
      ? "Pro" 
      : "Business";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back link */}
        <Button variant="ghost" asChild className="mb-6 -ml-2">
          <Link to="/templates">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to templates
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className={planStyles[identity.requiredPlan]}>
              {planLabel}
            </Badge>
            <Badge variant="outline" className={difficultyStyles[identity.difficulty]}>
              {DIFFICULTY_LABELS[identity.difficulty]}
            </Badge>
            <Badge variant="outline" className="bg-slate-500/20 text-slate-400 border-slate-500/40">
              {categoryLabels[identity.category] || identity.category}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold mb-3">{identity.name}</h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            {identity.description || identity.primaryJob}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            {locked ? (
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate(getUpgradeHref(identity.requiredPlan))}
                className={`${
                  identity.requiredPlan === "business" 
                    ? "border-purple-500/50 text-purple-400 hover:bg-purple-500/10" 
                    : "border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                }`}
              >
                <Lock className="h-4 w-4 mr-2" />
                {getUpgradeLabel(identity.requiredPlan)}
              </Button>
            ) : (
              <Button 
                size="lg"
                onClick={() => navigate(`/templates/${identity.slug}/activate`)}
              >
                <Play className="h-4 w-4 mr-2" />
                Activate
              </Button>
            )}
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/templates")}
            >
              Browse templates
            </Button>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Primary Job */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Primary job</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{identity.primaryJob}</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Setup steps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Setup</CardTitle>
              <p className="text-sm text-muted-foreground">What you'll do</p>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {i + 1}
                    </span>
                    <span className="text-sm text-muted-foreground pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
              {locked && (
                <p className="mt-4 text-sm text-amber-500">
                  Requires {planLabel} plan.
                </p>
              )}
            </CardContent>
          </Card>

          {/* What you get - spans full width */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">What you get</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                {features.map((feature, i) => (
                  <div key={i} className="flex flex-col gap-2 p-4 rounded-lg bg-muted/50">
                    <feature.icon className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-medium mb-1">Ready to get started?</h3>
            <p className="text-sm text-muted-foreground">
              {locked 
                ? `Upgrade to ${planLabel} to unlock this template.`
                : `Activate ${identity.name} and start seeing results.`
              }
            </p>
          </div>
          {locked ? (
            <Button 
              onClick={() => navigate(getUpgradeHref(identity.requiredPlan))}
              className={`${
                identity.requiredPlan === "business" 
                  ? "bg-purple-600 hover:bg-purple-700" 
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              <Lock className="h-4 w-4 mr-2" />
              {getUpgradeLabel(identity.requiredPlan)}
            </Button>
          ) : (
            <Button onClick={() => navigate(`/templates/${identity.slug}/activate`)}>
              <Play className="h-4 w-4 mr-2" />
              Activate now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
