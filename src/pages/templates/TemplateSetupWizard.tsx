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
  const current = tpl.steps[step];

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
                  <div>Review your configuration...</div>
                ) : (
                  <div>
                    <label className="block mb-2">{field.label}</label>
                    {field.kind === "text" && (
                      <input 
                        type="text" 
                        defaultValue={field.default}
                        className="w-full p-2 bg-zinc-800 rounded border border-zinc-600"
                      />
                    )}
                    {field.kind === "select" && (
                      <select 
                        defaultValue={field.default}
                        className="w-full p-2 bg-zinc-800 rounded border border-zinc-600"
                      >
                        {field.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                    {field.kind === "checkboxes" && (
                      <div className="space-y-2">
                        {field.options.map(opt => (
                          <label key={opt} className="flex items-center">
                            <input 
                              type="checkbox" 
                              defaultChecked={field.default?.includes(opt)}
                              className="mr-2"
                            />
                            {opt}
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
              className="px-4 py-2 bg-zinc-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button 
              onClick={() => setStep(Math.min(tpl.steps.length - 1, step + 1))}
              disabled={step === tpl.steps.length - 1}
              className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
            >
              {step === tpl.steps.length - 1 ? "Complete" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}