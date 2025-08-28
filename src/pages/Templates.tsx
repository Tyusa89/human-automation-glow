import { Section } from "@/components/Sections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { templateCards } from "@/lib/data";

export default function TemplatesPage() {
  return (
    <Section title="Templates" eyebrow="Start fast">
      <div className="grid md:grid-cols-4 gap-4">
        {templateCards.map((t, index) => (
          <Card 
            key={t.title} 
            className="hover-scale transition-all duration-300 hover:shadow-lg animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader><CardTitle className="text-base">{t.title}</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">{t.desc}</CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <Button>Browse all templates</Button>
      </div>
    </Section>
  );
}