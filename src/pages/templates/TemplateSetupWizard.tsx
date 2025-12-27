import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { registry } from "@/lib/registry";
import { ExternalLink, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function TemplateSetupWizard() {
  const nav = useNavigate();
  const { templateId: raw } = useParams();
  const templateId = (raw ?? "").toLowerCase();
  
  // Initialize hooks at the top to avoid conditional hook calls
  const [step, setStep] = useState(0);
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  
  const tpl = registry.find(r => r.id === templateId);

  // Initialize form state when template is found
  useEffect(() => {
    if (tpl?.steps) {
      const initialState: Record<string, any> = {};
      tpl.steps.forEach(step => {
        step.fields.forEach(field => {
          if (field.kind !== "review" && field.default !== undefined) {
            initialState[field.key] = field.default;
          }
        });
      });
      setFormState(initialState);
    }
  }, [tpl]);

  if (!tpl) {
    // visible error instead of blank page
    return (
      <div className="min-h-screen bg-background grid place-items-center text-destructive">
        <div className="text-center">
          <div className="text-2xl font-semibold">Unknown template: {raw ?? "undefined"}</div>
          <button className="mt-4 rounded-lg border border-border px-4 py-2 text-foreground hover:bg-muted transition-colors"
                  onClick={() => nav("/templates")}>
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  if (!tpl.steps || tpl.steps.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">TEMPLATE • {tpl.name}</div>
          <h1 className="mt-1 text-3xl font-bold">Advanced Configuration</h1>
          <p className="mt-4 text-muted-foreground">No advanced settings available for this template.</p>
          <button 
            className="mt-6 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
            onClick={() => nav("/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const current = tpl.steps[step];

  const updateFormValue = (key: string, value: any) => {
    setFormState(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('templates-use', {
        body: { templateId: tpl.id, formData: formState }
      });
      
      if (error) throw error;
      
      console.log("Project generated:", data);
      toast.success("Template generated successfully!");
      
      // Use the 'next' URL from the API response, or fall back to demo routes
      if (data?.next) {
        nav(data.next);
      } else if (tpl.id === "integration" || tpl.id === "zapier-intercom-integration") {
        nav("/demo/zapier-intercom");
      } else if (tpl.id === "social-media-scheduler") {
        nav("/demo/social-media-scheduler");
      } else if (tpl.id === "email-campaign-builder") {
        nav("/demo/email-campaign-builder");
      } else if (tpl.id === "inventory-manager") {
        nav("/demo/inventory-manager");
      } else if (tpl.id === "analytics-dashboard") {
        nav("/demo/analytics-dashboard");
      } else if (tpl.id === "data-sync-tool") {
        nav("/demo/data-sync-tool");
      } else if (tpl.id === "report-generator") {
        nav("/demo/report-generator");
      } else {
        nav(`/dashboard?template=${tpl.id}`);
      }
    } catch (error) {
      console.error("Error generating project:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate template");
    } finally {
      setIsGenerating(false);
    }
  };

  const isLastStep = step === tpl.steps.length - 1;
  const isReviewStep = current.fields.some(f => f.kind === "review");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">ADVANCED SETTINGS • {tpl.name}</div>
            <h1 className="mt-1 text-3xl font-bold">Customize Configuration</h1>
            <p className="text-sm text-muted-foreground mt-1">Optional — your system is already configured with smart defaults</p>
          </div>
          <a 
            href="/support"
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-primary-foreground font-medium transition-colors"
          >
            <BookOpen size={16} />
            Learn How to Use Templates
            <ExternalLink size={14} />
          </a>
        </div>
        
        <div className="mt-8">
          <div className="text-sm text-muted-foreground mb-2">
            Step {step + 1} of {tpl.steps.length}
          </div>
          <h2 className="text-2xl font-bold mb-6">{current.title}</h2>
          
          <div className="space-y-4">
            {current.fields.map((field, i) => (
              <div key={i} className="text-muted-foreground">
                {field.kind === "review" ? (
                  <div className="space-y-4">
                    <div className="text-lg font-semibold mb-4 text-foreground">Review your configuration:</div>
                    {Object.entries(formState).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-border">
                        <span className="font-medium text-foreground">{key}:</span>
                        <span className="text-muted-foreground">
                          {Array.isArray(value) ? value.join(", ") : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <label className="block mb-2 font-medium text-foreground">{field.label}</label>
                    {field.kind === "text" && (
                      <input 
                        type="text" 
                        value={formState[field.key] || ""}
                        onChange={(e) => updateFormValue(field.key, e.target.value)}
                        className="w-full p-3 bg-muted rounded-lg border border-border text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    )}
                    {field.kind === "select" && (
                      <select 
                        value={formState[field.key] || ""}
                        onChange={(e) => updateFormValue(field.key, e.target.value)}
                        className="w-full p-3 bg-muted rounded-lg border border-border text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        {field.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                    {field.kind === "checkboxes" && (
                      <div className="space-y-2">
                        {field.options.map(opt => (
                          <label key={opt} className="flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={(formState[field.key] || []).includes(opt)}
                              onChange={(e) => {
                                const current = formState[field.key] || [];
                                const updated = e.target.checked 
                                  ? [...current, opt]
                                  : current.filter((item: string) => item !== opt);
                                updateFormValue(field.key, updated);
                              }}
                              className="mr-3 w-4 h-4 accent-primary"
                            />
                            <span className="text-foreground">{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button 
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="px-6 py-3 bg-muted text-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/80 transition-colors"
            >
              Previous
            </button>
            
            {isLastStep && isReviewStep ? (
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
              >
                {isGenerating ? "Saving..." : "Save Configuration"}
              </button>
            ) : (
              <button 
                onClick={() => setStep(Math.min(tpl.steps.length - 1, step + 1))}
                disabled={step === tpl.steps.length - 1}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}