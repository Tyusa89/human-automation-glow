import React, { useState } from "react";
import { Layout, PenTool, Share2, ShoppingBag, Mail, Bot, Palette, Code2, Megaphone, Sparkles, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/ProductForm";

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

const Feature: React.FC<{ icon: React.ReactNode; title: string; copy: string; onGetQuote: () => void }>
  = ({ icon, title, copy, onGetQuote }) => (
  <div className="flex gap-4 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="shrink-0 p-2 rounded-xl bg-slate-50 border border-slate-200">{icon}</div>
    <div className="flex-1">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed mb-3">{copy}</p>
      <Button size="sm" variant="default" className="text-white">
        Get Requirements Form
      </Button>
    </div>
  </div>
);

export default function ProductPage() {
  const [activeForm, setActiveForm] = useState<string | null>(null);

  const handleGetQuote = (productType: string) => {
    setActiveForm(productType);
  };

  const services = [
    { icon: <Layout className="h-5 w-5" />, title: "Web Design", copy: "Modern, fast, conversion‑focused websites built for your business goals." },
    { icon: <PenTool className="h-5 w-5" />, title: "Creative", copy: "Brand visuals, content creation, and advertising that captures attention." },
    { icon: <Share2 className="h-5 w-5" />, title: "Social Media Marketing", copy: "Planning, UGC pipelines, and scheduling to grow your social presence." },
    { icon: <ShoppingBag className="h-5 w-5" />, title: "eCommerce", copy: "Complete online stores, sales funnels, and product operations." },
    { icon: <Mail className="h-5 w-5" />, title: "Email Marketing", copy: "Newsletters, drip sequences, and automated email campaigns." },
    { icon: <Sparkles className="h-5 w-5" />, title: "AI Marketing", copy: "Personalized content generation and intelligent targeting strategies." },
    { icon: <Palette className="h-5 w-5" />, title: "Branding", copy: "Brand identity development, voice guidelines, and visual systems." },
    { icon: <Code2 className="h-5 w-5" />, title: "Web Development", copy: "Custom applications, integrations, and technical solutions." },
    { icon: <Megaphone className="h-5 w-5" />, title: "Influencer Marketing", copy: "Creator partnerships, strategy development, and outreach campaigns." },
    { icon: <Bot className="h-5 w-5" />, title: "AI Agents", copy: "Intelligent automation workflows powered by advanced AI technology." },
    { icon: <MessageSquare className="h-5 w-5" />, title: "AI Chat bot", copy: "Website chat widgets for support, engagement, and lead capture." },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <Section id="product" title="Our Services" eyebrow="What We Offer">
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service) => (
            <Feature 
              key={service.title}
              icon={service.icon} 
              title={service.title} 
              copy={service.copy} 
              onGetQuote={() => handleGetQuote(service.title)}
            />
          ))}
        </div>
      </Section>

      {activeForm && (
        <ProductForm 
          productType={activeForm as any}
          onClose={() => setActiveForm(null)}
        />
      )}
    </div>
  );
}