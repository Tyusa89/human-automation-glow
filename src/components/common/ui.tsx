"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { brand } from "@/components/Brand";

export function Section({ id, title, eyebrow, children }: { id: string; title: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          {eyebrow && <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">{eyebrow}</div>}
          <h2 className="text-2xl md:text-4xl font-semibold text-slate-900">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

export function Feature({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="shrink-0 p-2 rounded-xl bg-slate-50 border border-slate-200">{icon}</div>
      <div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{copy}</p>
      </div>
    </div>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">{children}</span>;
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full text-white px-3 py-1 text-xs ${brand.primary.bg}`}>
      <Sparkles className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

export function StudioTiles({ items }: { items: { icon: React.ReactNode; label: string }[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white border rounded-2xl shadow-sm p-4">
      <div className="text-sm text-slate-500 mb-2">Visual Automation Studio</div>
      <div className="grid grid-cols-3 gap-3">
        {items.map((n, i) => (
          <div key={i} className="border rounded-xl p-3 bg-slate-50">
            <div className="flex items-center gap-2 text-slate-700">{n.icon}<span className="text-xs">{n.label}</span></div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-slate-500">Drag, connect, and publish without code.</div>
    </motion.div>
  );
}