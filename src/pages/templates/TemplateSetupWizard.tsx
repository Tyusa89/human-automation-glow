import { useParams, useNavigate } from "react-router-dom";
import { registry } from "@/lib/registry";
import { normalizeId } from "@/lib/utils/ids";

export default function TemplateSetupWizard() {
  const nav = useNavigate();
  const { templateId: raw } = useParams();
  const templateId = raw ? normalizeId(raw) : "";

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

  // TODO: render the correct setup for tpl
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