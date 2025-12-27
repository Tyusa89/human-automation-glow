import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getTemplateById } from "@/lib/templates";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Settings2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { brand } from "@/components/Brand";

type ActivationState = "loading" | "activating" | "success" | "error";

export default function TemplateActivation() {
  const navigate = useNavigate();
  const { templateId: raw } = useParams();
  const templateId = (raw ?? "").toLowerCase();
  
  const [state, setState] = useState<ActivationState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  
  const template = getTemplateById(templateId);

  useEffect(() => {
    if (!template) {
      setError("Template not found");
      setState("error");
      return;
    }
    activateTemplate();
  }, [templateId]);

  const activateTemplate = async () => {
    setState("activating");
    
    try {
      // Get current user and profile
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Fetch profile data for auto-configuration
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      setProfile(profileData);

      // Auto-generate config from profile
      const preferences = profileData?.preferences as Record<string, unknown> | null;
      const autoConfig = {
        mode: "auto",
        projectName: `${template?.title || "Project"} - ${profileData?.company || "My Business"}`,
        environment: "production",
        notifications: preferences?.email_reminders ?? true,
        timezone: profileData?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        workType: profileData?.work_type || "consultant",
        assistantLevel: profileData?.assistant_level || "balanced",
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

      // Record the template activation in user_templates
      const { error: insertError } = await supabase
        .from("user_templates")
        .insert({
          user_id: user.id,
          template_id: templateId,
          is_active: true,
          source: "auto-activation",
        });

      if (insertError) {
        console.warn("Could not record template activation:", insertError);
      }

      setState("success");
      
      // Short delay to show success state, then redirect
      setTimeout(() => {
        navigate(`/template-success?template=${templateId}`);
      }, 1500);

    } catch (err) {
      console.error("Template activation error:", err);
      setError(err instanceof Error ? err.message : "Failed to activate template");
      setState("error");
      toast.error("Failed to activate template");
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
      <Card className="w-full max-w-lg border-border/50 shadow-xl">
        <CardContent className="pt-8 pb-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
              {state === "success" ? (
                <CheckCircle2 className="h-8 w-8" />
              ) : (
                <Loader2 className="h-8 w-8 animate-spin" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {state === "success" ? "System Activated!" : `Activating ${template.title}`}
            </h1>
          </div>

          {/* Status */}
          <div className="space-y-4">
            {state === "activating" && (
              <div className="text-center space-y-3">
                <p className="text-muted-foreground">
                  Configuring your system for a <span className="text-foreground font-medium">{getBusinessTypeLabel()}</span>...
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Applying smart defaults from your profile</span>
                </div>
              </div>
            )}

            {state === "success" && (
              <div className="text-center space-y-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-foreground font-medium mb-1">
                    Your system is live
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We've configured this template based on your business.
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Redirecting to your dashboard...
                </p>
              </div>
            )}

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
                  <Button onClick={activateTemplate}>
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Advanced settings link - only show during activation/success */}
          {(state === "activating" || state === "success") && (
            <div className="mt-8 pt-6 border-t border-border/50 text-center">
              <button
                onClick={() => navigate(`/templates/${templateId}/setup?mode=advanced`)}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Settings2 className="h-4 w-4" />
                Advanced settings
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
