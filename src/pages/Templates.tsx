import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/ui";
import { templateCards } from "@/lib/site-data";
import { brand } from "@/components/Brand";

export default function TemplatesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <Section id="templates" title="Templates" eyebrow="Start fast">
        <div className="grid md:grid-cols-4 gap-4">
          {templateCards.map((t) => (
            <Card key={t.title} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-base">{t.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">{t.desc}</CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6">
          <Button className={`${brand.primary.bg} ${brand.primary.bgHover}`}>Browse all templates</Button>
        </div>
      </Section>
    </div>
  );
}