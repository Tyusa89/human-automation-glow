import { useState } from "react";
import Modal from "./Modal";
import { TEMPLATES, Template } from "@/lib/templates";

export default function TemplatePreview() {
  const [active, setActive] = useState<Template | null>(null);

  const badge = (text: string, tone: "gray" | "green" | "yellow" | "red" = "gray") => {
    const map: Record<typeof tone, string> = {
      gray: "bg-gray-100 text-gray-700",
      green: "bg-green-100 text-green-700",
      yellow: "bg-yellow-100 text-yellow-700",
      red: "bg-red-100 text-red-700",
    };
    return <span className={`text-xs px-2.5 py-1 rounded-full ${map[tone]}`}>{text}</span>;
  };

  const diffTone = (d: Template["difficulty"]) =>
    d === "Easy" ? "green" : d === "Medium" ? "yellow" : "red";

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {TEMPLATES.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border bg-white p-5 shadow hover:shadow-lg transition"
          >
            <div className="mb-3 flex items-center justify-between">
              {badge(t.category, "gray")}
              {badge(t.difficulty, diffTone(t.difficulty))}
            </div>

            <h3 className="text-lg font-semibold">{t.name}</h3>
            <p className="mt-1 text-sm text-gray-600">{t.description}</p>

            <ul className="mt-3 list-disc pl-5 text-sm text-gray-700">
              {t.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>

            <div className="mt-5">
              <button
                onClick={() => setActive(t)}
                className="w-full rounded-xl bg-green-700 px-4 py-2.5 text-white hover:bg-green-800"
              >
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Preview */}
      <Modal open={!!active} onClose={() => setActive(null)} title={active?.name}>
        {active && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {badge(active.category, "gray")}
              {badge(active.difficulty, diffTone(active.difficulty))}
            </div>
            <p className="text-gray-700">{active.description}</p>
            <div>
              <h4 className="font-medium">What's included</h4>
              <ul className="mt-2 list-disc pl-5 text-gray-700">
                {active.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 hover:bg-gray-50"
                onClick={() => setActive(null)}
              >
                Close
              </button>
              <button
                className="flex-1 rounded-xl bg-green-700 px-4 py-2.5 text-white hover:bg-green-800"
                onClick={() => {
                  // 🔧 hook up your "create from template" action here
                  // e.g., navigate(`/create?template=${active.id}`)
                  setActive(null);
                }}
              >
                Use this template
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}