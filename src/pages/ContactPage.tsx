import React from "react";
import { Button } from "@/components/ui/button";
import { brand } from "@/components/Brand";

// --- Helpers ---
const Section: React.FC<{ id: string; title: string; eyebrow?: string; children: React.ReactNode }>
  = ({ id, title, eyebrow, children }) => (
  <section id={id} className="scroll-mt-24 py-16 md:py-24">
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8">
        {eyebrow && (
          <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">{eyebrow}</div>
        )}
        <h2 className="text-2xl md:text-4xl font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  </section>
);

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Section id="contact" title="Contact" eyebrow="We'd love to help">
        <form className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">First name</label>
              <input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Last name</label>
              <input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input type="email" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Company</label>
            <input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">How can we help?</label>
            <textarea rows={5} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600" />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">By submitting, you agree to our privacy policy.</div>
            <Button className={`${brand.primary.bg} ${brand.primary.bgHover}`}>Send message</Button>
          </div>
        </form>
      </Section>
    </div>
  );
}