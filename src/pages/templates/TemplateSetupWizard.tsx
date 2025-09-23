import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

type Env = "Development" | "Staging" | "Production";

export default function TemplateSetupWizard() {
  const { templateId } = useParams();
  const nav = useNavigate();

  // global wizard state
  const [step, setStep] = useState(0); // 0..3
  const [projectName, setProjectName] = useState("EcoNest Project");
  const [env, setEnv] = useState<Env>("Development");
  const [integrations, setIntegrations] = useState({ zapier: false, intercom: false });
  const [channels, setChannels] = useState({ web: true, email: false, slack: false });
  const [autoRoute, setAutoRoute] = useState(true);
  const total = 4;

  const next = () => setStep((s) => Math.min(s + 1, total - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const generate = async () => {
    // only the selected template!
    await fetch("/api/templates/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templateId,
        projectName,
        env: env.toLowerCase(),
        integrations: Object.keys(integrations).filter((k) => (integrations as any)[k]),
        channels: Object.keys(channels).filter((k) => (channels as any)[k]),
        autoAddDemoRoute: autoRoute,
      }),
    });
    nav("/dashboard"); // redirect to dashboard after generation
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="text-xs tracking-wider text-zinc-400">INTEGRATION</div>
        <div className="mt-1 text-4xl font-extrabold">Template Setup</div>
        <p className="mt-2 text-zinc-300">
          Configure your Integration • Zapier × Intercom vibe template.
        </p>
        <button
          className="ml-auto mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-zinc-100 hover:bg-white/10"
          onClick={() => nav("/templates")}
        >
          Back to templates
        </button>

        {/* progress bars */}
        <div className="mt-6 grid grid-cols-4 gap-6">
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
          {step === 0 && (
            <div>
              <div className="text-lg font-semibold">Basics</div>
              <div className="mt-6 space-y-5">
                <div>
                  <div className="text-sm text-zinc-300">Project name</div>
                  <input
                    className="mt-2 w-full rounded-xl border border-emerald-500/30 bg-emerald-600/20 px-4 py-3 outline-none text-white"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
                <div>
                  <div className="text-sm text-zinc-300">Environment</div>
                  <select
                    className="mt-2 w-full rounded-xl border border-emerald-500/30 bg-emerald-600/20 px-4 py-3 text-white"
                    value={env}
                    onChange={(e) => setEnv(e.target.value as Env)}
                  >
                    <option>Development</option>
                    <option>Staging</option>
                    <option>Production</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="text-lg font-semibold">Integrations</div>
              <p className="mt-1 text-zinc-400">
                Toggle what you'll wire now. You can add the rest later.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[
                  { key: "zapier", label: "Zapier" },
                  { key: "intercom", label: "Intercom" },
                ].map((it) => (
                  <label
                    key={it.key}
                    className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-600/20 px-4 py-4 cursor-pointer hover:bg-emerald-600/30"
                  >
                    <input
                      type="checkbox"
                      checked={(integrations as any)[it.key]}
                      onChange={(e) =>
                        setIntegrations((s) => ({ ...s, [it.key]: e.target.checked }))
                      }
                      className="rounded border-white/20 bg-black/30"
                    />
                    <span>{it.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="text-lg font-semibold">Channels</div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  { key: "web", label: "Web" },
                  { key: "email", label: "Email" },
                  { key: "slack", label: "Slack" },
                ].map((ch) => (
                  <label
                    key={ch.key}
                    className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-600/20 px-4 py-4 cursor-pointer hover:bg-emerald-600/30"
                  >
                    <input
                      type="checkbox"
                      checked={(channels as any)[ch.key]}
                      onChange={(e) =>
                        setChannels((s) => ({ ...s, [ch.key]: e.target.checked }))
                      }
                      className="rounded border-white/20 bg-black/30"
                    />
                    <span>{ch.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="text-lg font-semibold">Review</div>
              <div className="mt-4 space-y-2 text-zinc-300">
                <div>
                  <span className="text-zinc-400">Template:</span>{" "}
                  Integration • Zapier × Intercom vibe
                </div>
                <div>
                  <span className="text-zinc-400">Project:</span> {projectName}
                </div>
                <div>
                  <span className="text-zinc-400">Env:</span>{" "}
                  {env.toLowerCase()}
                </div>
                <div>
                  <span className="text-zinc-400">Channels:</span>{" "}
                  {Object.entries(channels)
                    .filter(([, v]) => v)
                    .map(([k]) => k)
                    .join(", ") || "—"}
                </div>
                <div>
                  <span className="text-zinc-400">Integrations:</span>{" "}
                  {Object.entries(integrations)
                    .filter(([, v]) => v)
                    .map(([k]) => k)
                    .join(", ") || "—"}
                </div>
              </div>

              <label className="mt-5 flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRoute}
                  onChange={(e) => setAutoRoute(e.target.checked)}
                  className="rounded border-white/20 bg-black/30"
                />
                <span className="text-zinc-300">Auto-add demo route to router</span>
              </label>

              <div className="mt-6">
                <button
                  onClick={generate}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 font-medium hover:bg-emerald-500 transition-colors"
                >
                  Generate project
                </button>
              </div>
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