import { Sparkles } from "lucide-react";
import { ReactNode } from "react";

export function Section({
  id,
  title,
  eyebrow,
  children,
}: { id?: string; title: string; eyebrow?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          {eyebrow && (
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              {eyebrow}
            </div>
          )}
          <h2 className="text-2xl md:text-4xl font-semibold text-foreground">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

export function Feature({ icon, title, copy }: { icon: ReactNode; title: string; copy: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl border bg-card shadow-sm">
      <div className="shrink-0 p-2 rounded-xl bg-muted border">{icon}</div>
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{copy}</p>
      </div>
    </div>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border bg-card px-2.5 py-1 text-xs text-muted-foreground">
      {children}
    </span>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs">
      <Sparkles className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}