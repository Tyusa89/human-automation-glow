import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { getTemplateById, type TemplateMeta, type StepField } from "@/lib/registry";

export default function TemplateSetupWizard() {
  const { templateId } = useParams();
  const nav = useNavigate();

  // Get template configuration from registry  
  const templateMeta = useMemo(() => {
    if (!templateId) return null;
    return getTemplateById(templateId);
  }, [templateId]);

  // Dynamic form state based on template configuration
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Initialize form data with defaults
  useMemo(() => {
    if (!templateMeta) return;
    
    const initialData: Record<string, any> = {};
    templateMeta.steps.forEach(stepConfig => {
      stepConfig.fields.forEach(field => {
        if (field.kind !== "review" && field.default !== undefined) {
          initialData[field.key] = field.default;
        }
      });
    });
    setFormData(initialData);
  }, [templateMeta]);

  if (!templateMeta) {
    return (
      <div className="min-h-screen bg-[#0B1220] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400">Template not found</h1>
          <p className="text-zinc-400 mt-2">The template "{templateId}" doesn't exist in our registry.</p>
          <button
            onClick={() => nav("/templates")}
            className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-zinc-100 hover:bg-white/10"
          >
            Back to templates
          </button>
        </div>
      </div>
    );
  }

  const total = templateMeta.steps.length;
  const next = () => setStep((s) => Math.min(s + 1, total - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const generate = async () => {
    await fetch("/api/templates/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templateId,
        ...formData,
      }),
    });
    nav("/dashboard");
  };

  const renderField = (field: StepField) => {
    if (field.kind === "review") return null;

    const value = formData[field.key];
    
    switch (field.kind) {
      case "text":
        return (
          <div key={field.key}>
            <div className="text-sm text-zinc-300">{field.label}</div>
            <input
              className="mt-2 w-full rounded-xl border border-emerald-500/30 bg-emerald-600/20 px-4 py-3 outline-none text-white"
              value={value || ""}
              onChange={(e) => updateFormData(field.key, e.target.value)}
            />
          </div>
        );
      
      case "select":
        return (
          <div key={field.key}>
            <div className="text-sm text-zinc-300">{field.label}</div>
            <select
              className="mt-2 w-full rounded-xl border border-emerald-500/30 bg-emerald-600/20 px-4 py-3 text-white"
              value={value || field.options[0]}
              onChange={(e) => updateFormData(field.key, e.target.value)}
            >
              {field.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );
      
      case "checkboxes":
        return (
          <div key={field.key}>
            <div className="text-sm text-zinc-300 mb-4">{field.label}</div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {field.options.map(option => (
                <label
                  key={option}
                  className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-600/20 px-4 py-4 cursor-pointer hover:bg-emerald-600/30"
                >
                  <input
                    type="checkbox"
                    checked={(value || []).includes(option)}
                    onChange={(e) => {
                      const currentArray = value || [];
                      const newArray = e.target.checked
                        ? [...currentArray, option]
                        : currentArray.filter((item: string) => item !== option);
                      updateFormData(field.key, newArray);
                    }}
                    className="rounded border-white/20 bg-black/30"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const currentStepConfig = templateMeta.steps[step];
  const isReviewStep = currentStepConfig.fields.some(field => field.kind === "review");

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="text-xs tracking-wider text-zinc-400">{templateMeta.type.toUpperCase()}</div>
        <div className="mt-1 text-4xl font-extrabold">Template Setup</div>
        <p className="mt-2 text-zinc-300">
          Configure your {templateMeta.name} template.
        </p>
        <button
          className="ml-auto mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-zinc-100 hover:bg-white/10"
          onClick={() => nav("/templates")}
        >
          Back to templates
        </button>

        {/* progress bars */}
        <div className="mt-6 grid gap-6" style={{ gridTemplateColumns: `repeat(${total}, 1fr)` }}>
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full ${
                i <= step ? "bg-emerald-500" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* panel */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-lg font-semibold">{currentStepConfig.title}</div>
          
          {isReviewStep ? (
            <div>
              <div className="mt-4 space-y-2 text-zinc-300">
                <div>
                  <span className="text-zinc-400">Template:</span> {templateMeta.name}
                </div>
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-zinc-400">{key}:</span>{" "}
                    {Array.isArray(value) ? value.join(", ") || "—" : value || "—"}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button
                  onClick={generate}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 font-medium hover:bg-emerald-500 transition-colors"
                >
                  Generate project
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {currentStepConfig.fields.map(renderField)}
            </div>
          )}
        </div>

        {/* footer controls */}
        <div className="mt-6 flex items-center justify-between text-zinc-300">
          <button
            onClick={back}
            disabled={step === 0}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10 disabled:opacity-40 transition-colors"
          >
            Back
          </button>
          <div>Step {step + 1} / {total}</div>
          <button
            onClick={step < total - 1 ? next : undefined}
            disabled={step === total - 1}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-zinc-200 hover:bg-white/10 disabled:opacity-40 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}