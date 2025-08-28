import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/ui";
import { templates, Template } from "@/lib/templates";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { Badge } from "@/components/ui/badge";

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  const categories = ["All", "Support", "Marketing", "Ops", "Data"];
  
  const filteredTemplates = selectedCategory === "All" 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <Section id="templates" title="Templates" eyebrow="Start fast">
        <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
          Choose from our collection of production-ready templates to jumpstart your next project.
        </p>
        
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.slug} template={template} />
          ))}
        </div>
        
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No templates found for the selected category.</p>
          </div>
        )}
      </Section>
    </div>
  );
}