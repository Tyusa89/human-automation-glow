import React from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Workflow, LayoutTemplate, ArrowRight } from "lucide-react";

export default function ProductPage() {
  const navigate = useNavigate();

  const features = [
    { title: 'AI Agents', desc: 'Autonomous workers that think, plan, and act.', icon: Bot, path: '/solutions' },
    { title: 'Automations', desc: 'Reliable workflows powered by n8n + Supabase.', icon: Workflow, path: '/templates' },
    { title: 'Templates', desc: 'Pre-built systems you can install instantly.', icon: LayoutTemplate, path: '/templates' },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold text-white">EcoNest Platform</h1>
      <p className="mt-2 text-white/70 max-w-2xl">
        EcoNest is an AI-powered automation platform that combines intelligent agents,
        workflows, and integrations to run your business operations with minimal manual effort.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {features.map((item) => (
          <button
            key={item.title}
            onClick={() => navigate(item.path)}
            className="group rounded-xl border border-white/10 p-5 bg-white/5 text-left hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <item.icon className="h-6 w-6 text-primary mb-3" />
            <h2 className="font-medium text-white flex items-center gap-2">
              {item.title}
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </h2>
            <p className="mt-2 text-sm text-white/60">{item.desc}</p>
          </button>
        ))}
      </div>
    </main>
  );
}