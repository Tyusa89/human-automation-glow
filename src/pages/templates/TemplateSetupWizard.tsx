import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registry } from "@/lib/registry";

export default function TemplateSetupWizard() {
  const nav = useNavigate();
  const { templateId: raw } = useParams();
  const templateId = (raw ?? "").toLowerCase();
  
  const tpl = registry.find(r => r.id === templateId);

  if (!tpl) {
    // visible error instead of blank page
    return (
      <div className="min-h-screen grid place-items-center text-rose-300">
        <div className="text-2xl font-semibold">Unknown template: {raw ?? "undefined"}</div>
        <button className="mt-4 rounded-lg border border-white/10 px-4 py-2"
                onClick={() => nav("/templates")}>
          Back to Templates
        </button>
      </div>
    );
  }

  if (!tpl.steps || tpl.steps.length === 0) {
    return (
      <div className="min-h-screen bg-[#0B1220] text-white">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="text-xs text-zinc-400">TEMPLATE • {tpl.name}</div>
          <h1 className="mt-1 text-4xl font-extrabold">Template Setup</h1>
          <p className="mt-4 text-zinc-300">Setup wizard coming soon...</p>
        </div>
      </div>
    );
  }

  const [step, setStep] = useState(0);
  const [formState, setFormState] = useState<Record<string, any>>(() => {
    // Initialize form state with defaults
    const initialState: Record<string, any> = {};
    tpl.steps.forEach(step => {
      step.fields.forEach(field => {
        if (field.kind !== "review" && field.default !== undefined) {
          initialState[field.key] = field.default;
        }
      });
    });
    return initialState;
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const current = tpl.steps[step];

  const updateFormValue = (key: string, value: any) => {
    setFormState(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Project generated:", { templateId: tpl.id, ...formState });
      
      // Redirect based on template
      if (tpl.id === "integration") {
        nav("/demo/zapier-intercom");
      } else {
        // For other templates, show success message
        nav("/templates");
      }
    } catch (error) {
      console.error("Error generating project:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const isLastStep = step === tpl.steps.length - 1;
  const isReviewStep = current.fields.some(f => f.kind === "review");

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="text-xs text-zinc-400">TEMPLATE • {tpl.name}</div>
        <h1 className="mt-1 text-4xl font-extrabold">Template Setup</h1>
        
        <div className="mt-8">
          <div className="text-sm text-zinc-400 mb-2">
            Step {step + 1} of {tpl.steps.length}
          </div>
          <h2 className="text-2xl font-bold mb-6">{current.title}</h2>
          
          <div className="space-y-4">
            {current.fields.map((field, i) => (
              <div key={i} className="text-zinc-300">
                {field.kind === "review" ? (
                  <div className="space-y-4">
                    <div className="text-lg font-semibold mb-4">Review your configuration:</div>
                    {Object.entries(formState).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-zinc-700">
                        <span className="font-medium">{key}:</span>
                        <span className="text-zinc-400">
                          {Array.isArray(value) ? value.join(", ") : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <label className="block mb-2 font-medium">{field.label}</label>
                    {field.kind === "text" && (
                      <input 
                        type="text" 
                        value={formState[field.key] || ""}
                        onChange={(e) => updateFormValue(field.key, e.target.value)}
                        className="w-full p-3 bg-zinc-800 rounded border border-zinc-600 text-white focus:border-blue-500 focus:outline-none"
                      />
                    )}
                    {field.kind === "select" && (
                      <select 
                        value={formState[field.key] || ""}
                        onChange={(e) => updateFormValue(field.key, e.target.value)}
                        className="w-full p-3 bg-zinc-800 rounded border border-zinc-600 text-white focus:border-blue-500 focus:outline-none"
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
                              className="mr-3 w-4 h-4"
                            />
                            <span>{opt}</span>
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
              className="px-6 py-3 bg-zinc-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-600 transition-colors"
            >
              Previous
            </button>
            
            {isLastStep && isReviewStep ? (
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 py-3 bg-green-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-500 transition-colors"
              >
                {isGenerating ? "Generating..." : "Generate Project"}
              </button>
            ) : (
              <button 
                onClick={() => setStep(Math.min(tpl.steps.length - 1, step + 1))}
                disabled={step === tpl.steps.length - 1}
                className="px-6 py-3 bg-blue-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
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