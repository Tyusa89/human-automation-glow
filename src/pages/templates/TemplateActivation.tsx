import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getTemplateById } from "@/lib/templates";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Settings2, Clock, Puzzle, Sparkles, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserPlan } from "@/hooks/useUserPlan";
import { canActivateTemplate, formatActivationLimitMessage, getActivationLimit } from "@/lib/templateActivation";

type ActivationState = "loading" | "details" | "activating" | "success" | "error" | "limit_reached";

export default function TemplateActivation() {
  const navigate = useNavigate();
  const { templateId: raw } = useParams();
  const templateId = (raw ?? "").toLowerCase();
  const { plan: userPlan, loading: planLoading } = useUserPlan();
  
  const [state, setState] = useState<ActivationState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [activeTemplateCount, setActiveTemplateCount] = useState(0);
  
  const template = getTemplateById(templateId);

  // Check activation eligibility on mount
  useEffect(() => {
    if (planLoading) return;
    
    if (!template) {
      setError("Template not found");
      setState("error");
      return;
    }
    
    checkEligibility();
  }, [templateId, planLoading]);

  const checkEligibility = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    // Get active template count
    const { count } = await supabase
      .from("user_templates")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_active", true);

    const currentCount = count ?? 0;
    setActiveTemplateCount(currentCount);

    // Check if user can activate
    const result = canActivateTemplate({
      userPlan,
      activeTemplateCount: currentCount,
    });

    if (!result.allowed) {
      setState("limit_reached");
      return;
    }

    // Fetch profile for auto-config
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    setProfile(profileData);
    setState("details");
  };

  const activateSystem = async () => {
    setState("activating");
    setLoadingPhase(0);
    
    // Progress through loading phases
    const phaseTimer = setInterval(() => {
      setLoadingPhase(prev => Math.min(prev + 1, 2));
    }, 800);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Double-check eligibility (backend enforcement)
      const { count } = await supabase
        .from("user_templates")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_active", true);

      const result = canActivateTemplate({
        userPlan,
        activeTemplateCount: count ?? 0,
      });

      if (!result.allowed) {
        clearInterval(phaseTimer);
        setActiveTemplateCount(count ?? 0);
        setState("limit_reached");
        return;
      }

      // Auto-generate config from profile
      const preferences = profile?.preferences as Record<string, unknown> | null;
      const autoConfig = {
        mode: "auto",
        projectName: `${template?.title || "Project"} - ${profile?.company || "My Business"}`,
        environment: "production",
        notifications: preferences?.email_reminders ?? true,
        timezone: profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        workType: profile?.work_type || profile?.business_type || "consultant",
        assistantLevel: profile?.assistant_level || "balanced",
      };

      // Call the templates-use function with auto mode
      const { data, error: fnError } = await supabase.functions.invoke("templates-use", {
        body: { 
          templateId, 
          formData: autoConfig,
          mode: "auto",
          userId: user.id,
        }
      });

      if (fnError) throw fnError;

      // Use RPC to atomically activate this template (deactivates others)
      const { error: rpcError } = await supabase.rpc("activate_template", {
        p_user_id: user.id,
        p_template_slug: templateId,
      });

      if (rpcError) throw rpcError;

      clearInterval(phaseTimer);
      setState("success");
      
      // Redirect after showing success
      setTimeout(() => {
        navigate(`/template-success?template=${templateId}`);
      }, 1500);

    } catch (err) {
      clearInterval(phaseTimer);
      console.error("Template activation error:", err);
      setError(err instanceof Error ? err.message : "Failed to activate system");
      setState("error");
      toast.error("Failed to activate system");
    }
  };

  // Get display text based on profile
  const getBusinessTypeLabel = () => {
    const types: Record<string, string> = {
      consultant: "Consultant",
      coach: "Coach",
      freelancer: "Freelancer",
      creative: "Creative / Designer",
      creative_designer: "Creative / Designer",
      "local-service": "Local Service Provider",
      local_service_provider: "Local Service Provider",
      other: "Business",
    };
    return types[profile?.work_type] || types[profile?.business_type] || "your business";
  };

  const loadingMessages = [
    { icon: Sparkles, text: "Applying your goals and workflow preferences" },
    { icon: Puzzle, text: "Connecting recommended modules" },
    { icon: CheckCircle2, text: "Finalizing setup" },
  ];

  const limit = getActivationLimit(userPlan);

  if (!template) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <div className="text-destructive text-lg font-medium mb-4">
              Template not found
            </div>
            <Button onClick={() => navigate("/templates")} variant="outline">
              Back to Templates
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-primary/20 shadow-xl bg-card/95 backdrop-blur-sm">
        <CardContent className="pt-8 pb-8">
          
          {/* Screen: Loading */}
          {state === "loading" && (
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
              <p className="text-muted-foreground">Checking eligibility...</p>
            </div>
          )}

          {/* Screen: Limit Reached */}
          {state === "limit_reached" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-4">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Activation Limit Reached
                </h1>
                <p className="text-muted-foreground">
                  {formatActivationLimitMessage(userPlan, activeTemplateCount)}
                </p>
              </div>

              <div className="space-y-3 py-4 border-t border-b border-border">
                <p className="text-sm text-muted-foreground">
                  You're running <span className="font-medium text-foreground">{activeTemplateCount}/{limit}</span> active template{limit > 1 ? "s" : ""}.
                </p>
                <p className="text-sm text-muted-foreground">
                  To activate <span className="font-medium text-foreground">{template.title}</span>, you can:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                  <li>• Deactivate your current template first</li>
                  <li>• Upgrade to Pro to run multiple templates</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => navigate("/pricing")}
                  size="lg"
                  className="w-full"
                >
                  Upgrade to Pro
                </Button>
                <Button 
                  onClick={() => navigate("/dashboard")}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
                <button
                  onClick={() => navigate("/templates")}
                  className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Back to templates
                </button>
              </div>
            </div>
          )}
          
          {/* Screen A: Template Details */}
          {state === "details" && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Activate {template.title}
                </h1>
                <p className="text-muted-foreground">
                  EcoNest will configure this automatically using your onboarding profile.
                </p>
              </div>

              {/* Bullets */}
              <div className="space-y-3 py-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <span>Takes ~10 seconds</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Settings2 className="h-4 w-4 text-primary shrink-0" />
                  <span>You can customize settings later</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>No extra setup required</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button 
                  onClick={activateSystem}
                  size="lg"
                  className="w-full"
                >
                  Activate system
                </Button>
                <button
                  onClick={() => navigate(`/templates/${templateId}/setup?mode=advanced`)}
                  className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Customize settings (optional)
                </button>
              </div>

              {/* Microcopy */}
              <p className="text-xs text-muted-foreground/70 text-center pt-2">
                By continuing, EcoNest will generate your project with recommended defaults.
              </p>
            </div>
          )}

          {/* Screen B: Activating (loading) */}
          {state === "activating" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Configuring your system…
                </h1>
                <p className="text-muted-foreground">
                  Using your <span className="text-foreground font-medium">{getBusinessTypeLabel()}</span> profile to apply the best defaults.
                </p>
              </div>

              {/* Progress lines */}
              <div className="space-y-3 py-4">
                {loadingMessages.map((msg, index) => {
                  const Icon = msg.icon;
                  const isActive = index <= loadingPhase;
                  const isCurrent = index === loadingPhase;
                  
                  return (
                    <div 
                      key={index}
                      className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                        isActive ? "text-foreground" : "text-muted-foreground/50"
                      }`}
                    >
                      {isCurrent ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
                      ) : isActive ? (
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      ) : (
                        <Icon className="h-4 w-4 shrink-0" />
                      )}
                      <span>{msg.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Screen B.5: Success (brief before redirect) */}
          {state === "success" && (
            <div className="text-center space-y-4">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                System activated ✓
              </h1>
              <p className="text-muted-foreground">
                Redirecting to your dashboard...
              </p>
            </div>
          )}

          {/* Error state */}
          {state === "error" && (
            <div className="text-center space-y-4">
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-destructive font-medium mb-1">
                  Activation failed
                </p>
                <p className="text-sm text-muted-foreground">
                  {error || "Something went wrong. Please try again."}
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate("/templates")}>
                  Back to Templates
                </Button>
                <Button onClick={() => { setState("loading"); setError(null); checkEligibility(); }}>
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
