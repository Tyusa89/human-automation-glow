import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { registry } from "@/lib/registry";
import { normalizeId } from "@/lib/utils/ids";

export default function TemplateSetupWizard() {
  const { templateId: raw } = useParams();
  const navigate = useNavigate();
  const templateId = normalizeId(raw || "");

  const tpl = useMemo(
    () => registry.find(r => r.id === templateId),
    [templateId]
  );

  // Guard if bad id
  if (!tpl) {
    return (
      <div className="min-h-screen bg-[#0B1220] text-white flex items-center justify-center">
        <div className="p-6 text-red-300 text-center">
          <div className="text-xl font-semibold mb-2">Unknown template: {raw}</div>
          <div className="mt-4">
            <button 
              className="rounded-lg border border-white/10 px-3 py-2 hover:bg-white/5 transition-colors"
              onClick={() => navigate("/templates")}
            >
              Back to Templates
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Build initial form state from step defaults (per template)
  const initial = useMemo(() => {
    const obj: Record<string, any> = {};
    tpl.steps.forEach(step => step.fields.forEach(f => {
      if ("key" in f && f.key && "default" in f) obj[f.key] = (f as any).default ?? obj[f.key];
    }));
    return obj;
  }, [tpl]);

  const [form, setForm] = useState<Record<string, any>>(initial);
  const [step, setStep] = useState(0);

  const setField = (key: string, val: any) => setForm(s => ({ ...s, [key]: val }));

  const generate = async () => {
    await fetch("/api/templates/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId: tpl.id, ...form }),
    });
    navigate("/dashboard");
  };

  // UI
  const current = tpl.steps[step];

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="text-xs text-zinc-400">TEMPLATE • {tpl.name}</div>
        <h1 className="mt-1 text-4xl font-extrabold">Template Setup</h1>

        {/* progress */}
        <div className="mt-6 grid grid-cols-4 gap-6">
          {tpl.steps.map((_, i) => (
            <div key={i} className={`h-2 rounded-full ${i <= step ? "bg-emerald-500" : "bg-white/10"}`} />
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-lg font-semibold">{current.title}</div>

          {/* Render fields for this step */}
          <div className="mt-6 space-y-5">
            {current.fields.map((f, idx) => {
              if (f.kind === "text") return (
                <div key={idx}>
                  <div className="text-sm text-zinc-300">{f.label}</div>
                  <input
                    className="mt-2 w-full rounded-xl border border-emerald-500/30 bg-emerald-600/20 px-4 py-3 outline-none text-white"
                    value={form[f.key] ?? ""}
                    onChange={(e) => setField(f.key, e.target.value)}
                  />
                </div>
              );
              if (f.kind === "select") return (
                <div key={idx}>
                  <div className="text-sm text-zinc-300">{f.label}</div>
                  <select
                    className="mt-2 w-full rounded-xl border border-emerald-500/30 bg-emerald-600/20 px-4 py-3 text-white"
                    value={form[f.key] ?? ""}
                    onChange={(e) => setField(f.key, e.target.value)}
                  >
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              );
              if (f.kind === "checkboxes") return (
                <div key={idx}>
                  <div className="text-sm text-zinc-300">{f.label}</div>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {f.options.map(o => {
                      const arr: string[] = form[f.key] ?? [];
                      const checked = arr.includes(o);
                      return (
                        <label key={o} className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-600/20 px-3 py-2 cursor-pointer hover:bg-emerald-600/30">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const next = new Set(arr);
                              e.target.checked ? next.add(o) : next.delete(o);
                              setField(f.key, Array.from(next));
                            }}
                            className="rounded border-white/20 bg-black/30"
                          />
                          <span>{o}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
              if (f.kind === "review") return (
                <div key={idx} className="space-y-2 text-zinc-300">
                  {Object.entries(form).map(([k, v]) => (
                    <div key={k}><span className="text-zinc-400">{k}:</span> {Array.isArray(v) ? v.join(", ") : String(v ?? "—")}</div>
                  ))}
                </div>
              );
              return null;
            })}
          </div>
        </div>

        {/* footer */}
        <div className="mt-6 flex items-center justify-between">
          <button onClick={() => setStep(s => Math.max(0, s - 1))}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10">
            Back
          </button>
          <div>Step {step + 1} / {tpl.steps.length}</div>
          {step < tpl.steps.length - 1 ? (
            <button onClick={() => setStep(s => Math.min(tpl.steps.length - 1, s + 1))}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10">
              Next
            </button>
          ) : (
            <button onClick={generate}
                    className="rounded-xl bg-emerald-600 px-5 py-2.5 font-medium hover:bg-emerald-500">
              Generate project
            </button>
          )}
        </div>
      </div>
    </div>
  );
}