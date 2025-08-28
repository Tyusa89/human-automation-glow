import React from "react";
import { Sparkles } from "lucide-react";

export const Section: React.FC<{ 
  id: string; 
  title: string; 
  eyebrow?: string; 
  children: React.ReactNode;
  className?: string;
}> = ({ id, title, eyebrow, children, className = "" }) => (
  <section id={id} className={`scroll-mt-24 py-16 md:py-24 ${className}`}>
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8">
        {eyebrow && (
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{eyebrow}</div>
        )}
        <h2 className="text-2xl md:text-4xl font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  </section>
);

export const Feature: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  copy: string;
}> = ({ icon, title, copy }) => (
  <div className="flex gap-4 p-4 rounded-2xl border bg-card shadow-sm">
    <div className="shrink-0 p-2 rounded-xl bg-muted border">{icon}</div>
    <div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{copy}</p>
    </div>
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground">
    {children}
  </span>
);

export const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-foreground text-background px-3 py-1 text-xs">
    <Sparkles className="h-3.5 w-3.5" />
    {children}
  </span>
);